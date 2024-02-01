---
title: 'When to use quotes in bash'
description: >-
  Short version: basically all the time, except when using keywords or operators.

  But let's dig into the whens and wonts, as it is difficult to guess as a newcomer to bash.
pubDate: '2021-01-11'
heroImage: /blog/when-to-use-quotes-in-bash/-2-1-2024.png
tags:
  - guide
  - bash
  - programming
---


Short version: **basically all the time**, except when using keywords or operators.

But let's dig into the whens and wonts, as it is difficult to guess as a newcomer to bash.<!--more-->

## What I mean with `bash`

Just so we're talking about the same thing here: I'm off the course referring to the "Bourne Again Shell" (b-a-sh). It's what comes pre installed as the default shell on many operating systems, such as Mac OS X [_(at least before macOS Catalina)_](https://www.theverge.com/2019/6/4/18651872/apple-macos-catalina-zsh-bash-shell-replacement-features), GNU/Linux Ubuntu, _can't come up with any other distros (oh yeah, GNU/Linux Mint, GNU/Linux Debian...)_, but also when installing Git for Windows. The very popular shell named `bash`, that's the one I'm talking about here.

## Why use quotes

Let's look at an example, shall we:

```bash
# example 1
$ echo hello world!
hello world!

$ echo "hello world!"
hello world!
```

Both will give you the same output. So what's the gag? Well stop blaming me, you've not read long enough yet. You're the gag.

Let's make a small script to print the arguments we feed it. Drink some coffee, go take a shit, fire up your trusty VIM, because here comes a massive script:

```bash
#!/usr/bin/env bash
ARG_NUMBER=0
echo "NUM OF ARGS: ${#@}"
for ARG; do
        ((ARG_NUMBER++))
        echo "ARG $ARG_NUMBER >>$ARG<<"
done
```

^ Save that to `print_args.sh`, then make it executable by running:

```bash
$ chmod +x ./print_args.sh
```

Alright, now, you guessed it! Obtain some legs and run the example from above again, but with `./print_args.sh` instead of `echo`.

```bash
# example 2
$ ./print_args.sh hello world!
NUM OF ARGS: 2
ARG 1 >>hello<<
ARG 2 >>world!<<

$ ./print_args.sh "hello world!"
NUM OF ARGS: 1
ARG 1 >>hello world!<<
```

Ah ya, different output, see? Here's the thing with arguments: Usually, it do really does matter if it counts as one, and sometimes it doesn't. For the small mere `echo` command, it doesn't. At least when we only use one space~!

Let's check out this small edge case from example 1 but add more spaces:

```bash
# example 3
$ echo hello         world!
hello world!

$ echo "hello         world!"
hello         world!
```

Got you in your pretty just-big-enough face. Put some brain juice in and you'll see the correlation. You can even try example 3 but with `./print_args.sh` instead of `echo`.

To spoil it: `echo` takes all its arguments and prints them, and adds spaces in between the different arguments so it looks nice. Kind of how spaces gets merged in HTML. When you add quotes around the input, the whole `hello`, `world!`, and all the spaces in between gets passed as 1 (one) argument.

This does matter quite a bit in some cases. Let's say you have a file that has a space in its name. Let's say, `hello world.txt`, for lack of inspiration. If you want to rename (move) this file to have `.rump` as extension instead, you may write something like

```bash
# example 4
$ mv hello world.txt hello world.rump
```

According to the documentation of `mv`, that will be interpreted as moving the files `hello`, `world.txt`, and another `hello` into a directory named `world.rump`.

If you instead quote the file names, you get the intended result:

```bash
# example 5
$ mv "hello world.txt" "hello world.rump"
```

## How `bash` parses its tokens

*Really? We need to go through this?*

*Nah, you're right. Let's skip this. Or, let's just get out the short version:*

Bash splits everything on whitespace (spaces, tabs, etc).

## How to not split stuff on whitespace

In your arsenal, you have

- the DOUBLE QUOTE `"`
- the SINGLE QUOTE `'`
- and not to be forgotten, the BACKSLASH `\`
- _there's also so called heredoc strings, but let's ignore that for now because I have cramps in my groin from all this writing._

Using the BACKSLASH before a space tells `bash` that you don't want to split the word there. For example:

```bash
# example 6
$ ./print_args.sh hello\ world!
NUM OF ARGS: 1
ARG 1 >>hello world!<<
```

But that's tedious. You have to edit the text you just want to run. No fun.

Instead you can wrap it in quotes. For basic text, the DOUBLE QUOTE and SINGLE QUOTE are fully interchangeable with each other. One bonus is that they can include each other, but not themselves.

```bash
# example 7
$ ./print_args.sh "hello 'foo' world!"
NUM OF ARGS: 1
ARG 1 >>hello 'foo' world!<<

$ ./print_args.sh 'hello "foo" world!'
NUM OF ARGS: 1
ARG 1 >>hello "foo" world!<<
```

## SINGLE- vs DOUBLE QUOTEs

variables, bro. This is like day 1 stuff of bash. Cmon now.

But in your bash, try the following example:

```bash
# example 8
$ ./print_args.sh "my home = $HOME"
NUM OF ARGS: 1
ARG 1 >>my home = /home/kalle<<

$ ./print_args.sh 'my home = $HOME'
NUM OF ARGS: 1
ARG 1 >>my home = $HOME<<
```

If you're using DOUBLE QUOTEs, then variables are, you know, like the `$HOME` thingie, gets like embedded of sorts, (or in more proper terms: the variables are ***expanded***). With SINGLE QUOTEs, the `$HOME` is kept as-is before passed on to the `print_args.sh` script.

## When _not_ to use quotes

- On keywords (ex: `if`, `then`, `fi`, `case`, `esac`, etc)
- On operators (ex: `<`, `>`, `(`, `)`, etc)

## When to use quotes

- On everything else you want to pass as 1 unit.
- Especially when you're just passing along variables.
- Yes even just passing to local functions.
- Oh and when you need to pass the characters `<` or text `if` into another program as an argument.

To be more concrete:

- On all variables
- On all strings containing whitespace
- On all strings containing weird characters such as `&`
- On all strings.

Yes, all variables.

Do this:

```bash
# example 9
funcA() {
  echo "value: $1"
}
funcB() {
  funcA "$1"
}

funcB 'hello world!'

## This outputs:
# value: hello world!
```

Never do this:

```bash
# example 10
funcA() {
  echo "value: $1"
}
funcB() {
  # unquoted! oh noes!
  funcA $1
}

funcB 'hello world!'

## This outputs:
# value: hello
```

...notice the missing `world!`, as it's lost when sending the first argument from `funcB` to `funcA`.

## Ok, usage of quotes is not strictly needed if

- There are no variables involved
- There are no special characters (including whitespace) involved
- _Usually_ when running commands, you don't want to quote the command name.

On the last bullet there, as an complementary example, here's overuse of quoting:

```bash
# example 11
$ "echo" "foo"
foo
```

Yes you can quote the command name `echo`, but that's not necessary. You already know `echo` doesn't contain any whitespace.

Doing this however; here you should use quotes:

```bash
# example 12
$ ECHO_CMD=echo
$ "$ECHO_CMD" "foo"
foo
```

If `$ECHO_CMD` is changed to point to the path of an executable, where the path contains a space, you'll get funny results. Example:

```bash
# example 13
$ ECHO_CMD="/usr/share/some space folder/bin/echo"

$ $ECHO_CMD "foo"
bash: /usr/share/some: No such file or directory

$ "$ECHO_CMD" "foo"
bash: /usr/share/some space folder/bin/echo: No such file or directory
```

OK both gave error, but that's because I didn't have a file at that location. The point is, the latter sample with the DOUBLE QUOTEd `$ECHO_CMD` gave a much more giving error.

## Cool stuff to do with quotes

The variables `$@` and `$*` are two cool magic variables. They include the arguments passed to the script or function. Whichever is the closest.

- `$@` is an array of all the args.
- `$*` is a string of all the args concatenated/joined together with spaces.

When you quote them, they get even cooler. When you don't quote them, they're actually pretty lame. When they're not quoted, their values are re-evaluated when passing them along, creating new arguments groupings.

- `"$@"` gets expanded to all the arguments, but correctly quoted when passing it along, maintaining the strings as separate args.
- `"$*"` is still just a string of all the args concatenated/joined together with spaces.

Let's peek at an example, shall we, yes? Yes. Look, first this is the truth we're referencing in the upcoming snippets:

```bash
# example 14
$ ./print_args.sh "hello world!" foo bar
NUM OF ARGS: 3
ARG 1 >>hello world!<<
ARG 2 >>foo<<
ARG 3 >>bar<<
```

Now, let's make some functions that run `./print_args.sh` so we can test which one passes its values along, in an intact fashion:

```bash
# example 15

# A function to just call ./print_args.sh
print_args_1() {
  ./print_args.sh $@
}
print_args_2() {
  ./print_args.sh $*
}
print_args_3() {
  ./print_args.sh "$@"
}
print_args_4() {
  ./print_args.sh "$*"
}
```

The function `print_args_3` uses `"$@"`, which should preserve our arguments correctly. And to try them out:

```bash
# example 16

$ print_args_1 "hello world!" foo bar
NUM OF ARGS: 4
ARG 1 >>hello<<
ARG 2 >>world!<<
ARG 3 >>foo<<
ARG 4 >>bar<<

$ print_args_2 "hello world!" foo bar
NUM OF ARGS: 4
ARG 1 >>hello<<
ARG 2 >>world!<<
ARG 3 >>foo<<
ARG 4 >>bar<<

$ print_args_3 "hello world!" foo bar
NUM OF ARGS: 3
ARG 1 >>hello world!<<
ARG 2 >>foo<<
ARG 3 >>bar<<

$ print_args_4 "hello world!" foo bar
NUM OF ARGS: 1
ARG 1 >>hello world! foo bar<<
```

As expected (well as _I_ expected. Though I'm the only one reading this, so yeah, as _we_ expected, I guess), `print_args_3` does what we want (in this case at least, since we just set our goal to make it work like that. If you want any of the other behaviours then please consult with your doctor and proceed with the oral check, then you can write that code of yours, with or without your doctor's approval).

## Security aspect

Oh yea, almost forgot. There's this whole security thing with quoting variables in bash as well.

If you don't quote your strings that uses variables, you're up for some SQL-injection-esque vulnerabilities in your script, but more like BASH-injection.

Keep 'em quoted.
