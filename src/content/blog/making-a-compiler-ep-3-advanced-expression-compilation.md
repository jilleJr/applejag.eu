---
title: 'Making a compiler (ep 3) advanced expression compilation'
description: 'Tremendous amount of time have been spent solely for expression parsing, ‘cause I want that stupid shitpile to work in a proper way.'
pubDate: '2018-03-24'
heroImage: /blog/making-a-compiler-ep-3-advanced-expression-compilation/tumblritsa-me-jag17220961110201.png
tags:
  - adventiredOfG1ant
  - csharp
  - devlog
  - g1ant
  - programming
---

Tremendous amount of time have been spent solely for expression parsing, ‘cause I want that stupid shitpile to work in a proper way.

I’ve just now successfully rewritten the compiling part to in a cleaner way parse expressions and statements, and dahym it’s working like a charm.

With the new system I can much easier handle expressions; look at their content and for example, remove unneeded parentheses, extract statements that needs to compile ahead of time, and other fun stuff. <!--more-->

![Parenthases compilation unit tests](/blog/making-a-compiler-ep-3-advanced-expression-compilation/tumblritsa-me-jag17220961110201.png)

Here’s two unit tests that I’ve been targeting for the past week. And today they finally passed!

Here’s another unit test that I’ve been able to easily make work with the rewrite of the compiler:

![Nested assignment compilation unit test](/blog/making-a-compiler-ep-3-advanced-expression-compilation/tumblritsa-me-jag17220961110202.png)

(I took previous screenshot in Visual Studio, and this one via the Github website, 'cause I’m on the phone now halfway through writing this, because. Because.)

But AWH FEELS GOOD, you see that compiled code?? B-e-a-uuutiful!

Ah I love myself.

Cheerio noobnuts

> *This post was originally posted (by me) here: <https://itsa-me-jag.tumblr.com/post/172209611102/making-a-compiler-ep-3-expression-compilation>*
