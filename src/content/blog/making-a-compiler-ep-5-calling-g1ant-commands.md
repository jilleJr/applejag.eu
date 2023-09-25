---
title: 'Making a compiler (ep 5) calling G1ANT commands'
description: 'So bappin happy this feature is finally in a working state. I’ve been procrastinating this hippo for so long, but now it’s implemented and it works wonders!'
pubDate: '2018-04-02'
heroImage: /blog/making-a-compiler-ep-5-calling-g1ant-commands/tumblritsa-me-jag17251876966702.png
tags:
  - adventiredOfG1ant
  - csharp
  - devlog
  - g1ant
  - programming
---

33 commits, 44 files changed, +3k additions, **1** (① _one_) feature…

So bappin happy this feature is finally in a working state. I’ve been procrastinating this hippo for so long, but now it’s implemented and it works wonders!

In G1ANT you have commands and not functions to call, and they use a kind of out parameter structure for the commands results. Like for example, to get the result from a dialog box you do it like this:

![Sample G1ANT.Robot code using dialog.ask](/blog/making-a-compiler-ep-5-calling-g1ant-commands/tumblritsa-me-jag17251876966701.png)<!--more-->

But I’m like, _“Hey I want to use return values.”_

So my solution is as a like this one: If used as a return value, just translate it into an out param! BriLLIanT! (+ some other stuff in complex scenarios)

Glance at the following Robot++ and generated Robot code example below:

![Compiled code using return values](/blog/making-a-compiler-ep-5-calling-g1ant-commands/tumblritsa-me-jag17251876966702.png)

Slick AF if you ask me! _Especially the tmp vars stuff! They’re extra hot B]_

The project is apparently at 5k lines of C# code so far, according to this poopscript: <https://github.com/rrwick/LinesOfCodeCounter>

![LinesOfCodeCounter output](/blog/making-a-compiler-ep-5-calling-g1ant-commands/tumblritsa-me-jag17251876966703.png)

That’s it for todais bost,

Cheez-in-yo firehouse!

> _This post was originally posted (by me) here: <https://itsa-me-jag.tumblr.com/post/172518769667/making-a-compiler-ep-5-calling-g1ant-commands>_
