---
title: 'Making a compiler (ep 12-13) Built-in variables & C# methods'
description: 'You cant probably see it because of Tumblr''s lack of affection towards timestamps, but last episode came out 6 months ago'
pubDate: '2018-11-05'
heroImage: /blog/making-a-compiler-ep-12-13-built-in-variables-and-c-methods/tumblritsa-me-jag17978927438205.gif
tags:
  - adventiredOfG1ant
  - csharp
  - devlog
  - g1ant
  - programming
---

eBIG BARF

THIS TOOK A WHILE

![Puking glitter](/blog/making-a-compiler-ep-12-13-built-in-variables-and-c-methods/tumblritsa-me-jag17978927438201.gif)\
<sup>[Originally posted by palesystemmalfunction](https://tmblr.co/ZggVek20Fazbp)</sup>

You cant probably see it because of Tumblr's lack of affection towards timestamps, but last episode came out [6 months ago](../making-a-compiler-ep-11-checking-for-value-types).

I had a good flow before. Nearly one PR per week. But then summerjob happened, and some vacation, and some vacation from my vacation, then school started, then dog ate my trashcan…

I’ve been busy. And I’ve lost the flame for this project.<!--more-->

Ok so episode 12 was omitted ‘cause it was just such a short one. It was just “Oh hey I’m an idiot, I pick my nose and added the variable list”

It was back at [ep 5](../making-a-compiler-ep-5-calling-g1ant-commands) i added the commands. I just forgot the variables.

**Anywahcays.** New feature just compläted:

C-TO-THE\_S-TO\_Da\_\_##\#sharp!

![Pouring a bucket of drink](/blog/making-a-compiler-ep-12-13-built-in-variables-and-c-methods/tumblritsa-me-jag17978927438202.gif)\
<sup>[Originally posted by sexdropei](https://tmblr.co/ZqiAwt2ZlhEB1)</sup>

*relevant gif.*

This feature set was actually a big head scratch and too much *~~alcohol~~* spaghetti code. Like look, now I can use ToString… :meh:

![Compiling .ToString() to G1ANT.Robot](/blog/making-a-compiler-ep-12-13-built-in-variables-and-c-methods/tumblritsa-me-jag17978927438203.png)

The headscratch was having it parse it and understand which overload to use, if it is g1ant cmd or c# cmd, and dealing with stuff like void methods…

You (my one reader base, aka myself) may not know this (we both knew it stupid eggfishousarous) stop parentheses interrupt me. the g1ant syntax doesn’t allow for c# void functions anyways.

Which is cool for scenarios like list.Sort()….. GRr.

![Creating a list and sorting it with IList.Sort()](/blog/making-a-compiler-ep-12-13-built-in-variables-and-c-methods/tumblritsa-me-jag17978927438204.gif)

For reference, that `x.Sort()` compiles into this:

`♥x=⊂new Func<System.Collections.Generic.List<System.Object>, System.Collections.Generic.List<System.Object>>((System.Collections.Generic.List<System.Object> _)=>{_.Sort();return _;})(♥x)⊃`

Yea. Nice workaround… Just gonna gouge my eyes brb

That gif is from me [adding the compiler to VS Code](https://code.visualstudio.com/docs/editor/tasks#_custom-tasks) btw. It works nicely. Added detection for errors was pretty cool too. Here’s some more of that:

![Compiling in VS Code and getting error squiglies](/blog/making-a-compiler-ep-12-13-built-in-variables-and-c-methods/tumblritsa-me-jag17978927438205.gif)

*Would you look at that.!. Time is already up at 150ms compile time. I find that a lot. I mean it’s not that basic of an application, and it’s not well optimized at all, I think I double compile here and there because I have a stupid algorithm… but butts!*

Anypose, Au revoir, spidermoms.

> *This post was originally posted (by me) here: <https://itsa-me-jag.tumblr.com/post/179789274382/making-a-compiler-ep-12-13-built-in-variables>*
