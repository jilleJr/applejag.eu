---
title: 'Making a compiler (ep 1)'
description: 'Ever been so tired of the syntax of a programming language that you just couldn’t stand it? But in the meantime being forced to use it because of your workplace? So you develop a new language to compensate so you don’t have to handle the absolute shitstorm headaches from using the language?'
pubDate: '2018-03-21'
heroImage: /blog/making-a-compiler-ep-1/tumblritsa-me-jag17211695844704.png
tags:
  - adventiredOfG1ant
  - csharp
  - devlog
  - g1ant
  - programming
---

> This is a follow-up on my rant [sH*£!#tty DaHMN bad LANG](../sh-ps-tty-dahmn-bad-lang)

Ever been so tired of the syntax of a programming language that you just couldn’t stand it? But in the meantime being forced to use it because of your workplace? So you develop a new language to compensate so you don’t have to handle the absolute shitstorm headaches from using the language?

I know I am. *(Because I have a lot of free time at the moment)*

Welcome to the devlog of Robot++. A compiler written in C# that translates the syntax of my made up language Robot++ into executable [G1ANT.Robot](https://g1ant.com/) code.

On todays report of my mission in *“trying to embarrass the G1ANT developers by making a compiler as a statement of how bad they are at making a language”* is some progress pics!

<!--more-->

Let’s start glancing at figure A, an exemplary code snippet written in the language of G1ANT.Robot that we can shittalk to get you back in the mood.

!["y/n" user dialog loop, written in G1ANT](/blog/making-a-compiler-ep-1/tumblritsa-me-jag17211695844701.png)

If you ever taught yourself to be competent in the programming field *(compared to the fartfaces who made shat out this language)* then you should with some grasp be able to understand the code here.

What you’re confronted with is a regular while-loop. Try read it and understand the flow. Now if you’re tired of your life and don’t want a death trigger, or just want to read along to get my point in the following paragraph, then here’s a C# snippet that’s translated as good as I was able to do at this hour (sleep deprivation, my favorite).

!["y/n" user dialog loop, written in C#](/blog/making-a-compiler-ep-1/tumblritsa-me-jag17211695844702.png)

Now isn’t that much nicer. Quickly understandable code! Of course I made up the `dialog.ask` as a function but this is the kind of syntax I want to work with!!

---

So with some deadtime on the job spent on programming a tool I will probably only use for a couple of weeks, I have so far in two weeks made it parse if-statements! Woop.

Actually the thing is pretty complex, so I enjoy this futile result as it’s a great building block for the features to come. Here’s a stupid list of the current things list for the thing:

- Tokenizer / Lexer built with RegExpressions
- TDD for the core thing build with RegExamples
- Parser for parsing, build with the Vegan Spaghetti Idiom™
- Compiler thingiemcgig, it turns it back into string yo.
- A pretty spades slick CLI for users (i.e. me, lol)
- Syntax highlighting in the CLI, small nice feat
- Made with .NET Core, C#. Same as the G1ANT.Robot. Which is funny.

Check this radaflapjack screenshot of the CLI (it’s pretty cool):

![Compiling from C# to G1ANT on the command line](/blog/making-a-compiler-ep-1/tumblritsa-me-jag17211695844703.png)

The syntax I’m rolling for the compiler is some weird mix between Lua & C#. Best of both worlds right? Anyhow it compiles back to `.robot` anyway, the syntax I can change if I ever want it. Here’s an example of "Robot++" written by yours truly (right), and the G1ANT.Robot code produced by the compiler (left):

![Transpiling example, to G1ANT, from "Robot++"](/blog/making-a-compiler-ep-1/tumblritsa-me-jag17211695844704.png)

Hope you didn’t enjoy it as much as I did. I’m having a fucking blast writing this compiler, it’s untraveled ground for mr jag, and I’m setting a nice pavement.

See none of y’all next update where I unravel more features. Hopefully some fucking function calls or something *(Oh right, fuck, time for some serious thonking for how to solve return values… UUUH)* Anyways, I’m late to my lack of sleep, BYE.

Cheerio, trucknuts

> *This post was originally posted (by me) here: <https://itsa-me-jag.tumblr.com/post/172116958447/making-of-a-compiler>*
