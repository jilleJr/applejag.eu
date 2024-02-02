---
title: 'Choosing lang for new project: flog'
description: >-
  Filter-logs: flog. A command-line utility to filter logs depending on if it's an error, infromation, trace, debug, or wheatever kind of severity. And yes, especially for multiline logs!
pubDate: '2021-01-23'
heroImage: /blog/choosing-lang-for-new-project-flog/flog-screenshot.png
tags:
  - devlog
  - programming
---

*I see you hating on the name already, but stop that. I'm already in love with it.*

Filter-logs: flog. A command-line utility to filter logs depending on if it's an error, infromation, trace, debug, *or wheatever kind of severity.* And yes, especially for multiline logs!

Sample use case:

```sh
# Only give me the <1 day old logs from fileOutput.log
$ flog -t 1d fileOutput.log

# ...or what about only error logs
$ flog -s error fileOutput.log

# Only show me error logs from dotnet run
$ dotnet run -v m | flog -s error
```

Would be so useful, and not *that* complicated to make, right?

I've not found any such tool online, so let's just make one of my own. But what language?<!--more-->

---

Choosing language is so much harder the more programming languages you learn. They do have their own strengths in things like performance, memory usage, enjoyment to work with, enforcement of programming heuristics, etc.

For this project I rounded up the following languages as candidates: Go, Crystal, C\# and F\#.

These are not all programming languages I know, but are all programming languages that I want to work with when making this tool. Some languages such as Lua, JS, PHP I've intentionally excluded because it's a hassle to install for the mere user that doesn't have Lua runtime, Node.js, PHP or whatever installed already. I only looked at a subset of languages that support delivering a single native executable.

## Lang: C\#

Pros:

- Usage of `ReadOnlySpan<T>` can lead to increadible string performance and memory usage
- I have the most experience with C\# and its ecosystem

Cons:

- Sluggish startup time, even with `-p:PublishReadyToRun=true`, when compared to Go & Crystal
- VS is still best IDE experience as omnisharp still has some issues, and I don't want to lock down to VS
- Binaries still get pretty large

## Lang: F\#

Pros:

- Immutability
- Functional programming style is fun to work with
- Super readable code

Cons:

- Still marginally slower than OO styled programming
- VS is still best IDE experience as ionide still has some issues, and I don't want to lock down to VS
- Sluggish startup time, even with `-p:PublishReadyToRun=true`, when compared to Go & Crystal
- Binaries still get pretty large

## Lang: Go

Pros:

- Fast boot up time
- Increadibly cheap GC
- Fast performance thanks to their amount of AOT->native
- Loveley ecosystem
- It's a bliss working with Go in Emacs
- Super fast compilation

## Lang: Crystal

Pros:

- Fast boot up time
- Increadibly cheap GC
- Best performance thanks to their amount of inlining and AOT->native

Cons:

- Bad IDE experience (intellisense)
- Currently only for Linux & OS X
- Slow compilation

---

## My choice

It's not that extensive of a list. I somewhat wanted to do some more Crystal because I'm really fond of their type system. But I've been having such a good experience lately with Doom Emacs + Go-mode that I just want to jump back into that IDE all of the time, just don't have a project... (UP UNTIL NOW >:) )

Therefore, I'm going to go with go~

For reference, the project will initially (and possibly indefinetly, until that ForgeFed starts kicking up speed) over at GitHub: <https://github.com/applejag/flog>
