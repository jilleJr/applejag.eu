---
title: 'Making a compiler (ep 2) try-catch solution'
description: 'So in the spirit of not-enough-chores-at-work I’ve today found a sickly bad workaround for how to handle try-catch statements.'
pubDate: '2018-03-22'
heroImage: /blog/making-a-compiler-ep-2-try-catch-solution/tumblritsa-me-jag17214082913703.png
tags:
  - adventiredOfG1ant
  - csharp
  - devlog
  - g1ant
  - programming
---

So in the spirit of *not-enough-chores-at-work* I’ve today found a sickly bad workaround for how to handle try-catch statements.

My solution is (like the code of your website) solved by a clump of workarounds to achieve a pretty simple goal. Howevery, because of my humbleness, I find my solution to be quite best and 300IQ’d.

The G1ANT.Robot lang has some sort of error handling built in, which is nice; but only for commands. What you can do is to append the arguments `errorresult` and `errorjump` to any command, and they’ll catch ‘em all. Like take a peakis at this dungus script example:

![try-catch of a function call](/blog/making-a-compiler-ep-2-try-catch-solution/tumblritsa-me-jag17214082913701.png)<!--more-->

^this is an integration test of wanted compiled output. Not even hard to program into the compiler.

*HOLD THE BANANAPHONE THO! This method only works for the blammin commands! What about the equations?!? You can’t add `errorjump` to an assignment!*

Well a me and lots of coffee can answer that! You c, I found a loophole.

My trial-n-error has revealed to me that, if you assign a variable, the robot interpreter actually tries to compile it into C# first, ALWAYS! (This is probably one of the reasons it’s so shitty slow) Then if it fails, it just reads it as a string.

Which means, you can just throw in a comment in there! If the variable holds that comment in the start: it failed,,, and in the case it succeeded: no comment!

Its gEnIOUs I tELL yAA!

So let’s see an example of my beautiful solution:

![try-catch of an assignment](/blog/making-a-compiler-ep-2-try-catch-solution/tumblritsa-me-jag17214082913702.png)

Ain’t that a fucking nice chunk of code! *MMmmmMMMMHMHMM A bit too XXX for look at while at work, raise yo dongers!*
That’s how it would be generated anyways. 6 robot code generated for the simple task of 1 assignment. I mean it works a pretty 100%.

---

These compiled `.robot` scripts are going to be sooooo unreadable! LOVE ET.

Til’ next time, cheerio grunkbutts!

---
---
---

**EDIT:** HOLD THE FUCKING SPACEJAM. UHGH muttfluckers, you can Just Fucking throw all shits inside a procedure and then errorjump that! Works even smoother.

![try-catch of an assignment, mk.2](/blog/making-a-compiler-ep-2-try-catch-solution/tumblritsa-me-jag17214082913703.png)

SIGH, AND HERE I’VE WASTED UNPRECIOUS WORK TIME IN THIS WHEN THERES JUST A SIMPLE SOLUTION AS THAT?!?

So worth tho. Still proud.

To compensate for my derp tho, I give you derp gif

![derpy](/blog/making-a-compiler-ep-2-try-catch-solution/tumblrinlinep605kyabya1vn9t13250.gif)

> *This post was originally posted (by me) here: <https://itsa-me-jag.tumblr.com/post/172140829137/making-a-compiler-ep-2-try-catch-solution>*
