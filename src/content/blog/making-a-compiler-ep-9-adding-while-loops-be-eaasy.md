---
title: 'Making a compiler (ep 9) Adding while-loops be eaASY'
description: 'This was a feature I didn’t add because I just imagined it would be done in an hour or so.'
pubDate: '2018-04-13'
heroImage: /blog/making-a-compiler-ep-9-adding-while-loops-be-eaasy/tumblritsa-me-jag17289836142701.png
tags:
  - adventiredOfG1ant
  - csharp
  - devlog
  - g1ant
  - programming
---

This was a feature I didn’t add because I just imagined it would be done in an hour or so.

Oh how I was wrong. It took me FULL 90 MINUTES!

What took the most time was writing all those stupid unit tests. Implementing `if-else`, `while`, and `do-while` was arguably the easiest thing I’ve added. With my UNQUESTIONABLY SENSATIONALISTIC CODE BASE it was added in a jiffy.  🍆✊💦

![while-loop compilation](/blog/making-a-compiler-ep-9-adding-while-loops-be-eaasy/tumblritsa-me-jag17289836142701.png)

That right there ^ was like, echo conditional jump, echo codeblock, echo label, DDdddDDONE!<!--more-->

Also, check out this sicc™ mini optimization:

![optimized while-loop with empty block](/blog/making-a-compiler-ep-9-adding-while-loops-be-eaasy/tumblritsa-me-jag17289836142702.png)

Which in turns combined with a prefix operator makes this little loop super cool:

![while-loop with prefix operator](/blog/making-a-compiler-ep-9-adding-while-loops-be-eaasy/tumblritsa-me-jag17289836142703.png)

I should reaaaally make a roadmap for planned features tho… I’m starting to procrastinate,,, which is bhaaaad. Like I really need to implement that variable type check, but it’s such a big hurdle D:::

Go nail yo’shelf,,,´,,,,,

Cheerio!

> _This post was originally posted (by me) here: <https://itsa-me-jag.tumblr.com/post/172898361427/making-a-compiler-ep-9-adding-while-loops-be>_
