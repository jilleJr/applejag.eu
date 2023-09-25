---
title: 'Making a compiler (ep 10) Ʉɳïʗʘḍℇ identifier names'
description: 'Sometimes you can feel the tingle of “hey, you know that’s probably done already 201395 times before, probably much better too” but keep on doing it anyways…'
pubDate: '2018-04-14'
heroImage: /blog/making-a-compiler-ep-10-unic-d-identifier-names/tumblritsa-me-jag17290787145701.png
tags:
  - adventiredOfG1ant
  - csharp
  - devlog
  - g1ant
  - programming
---

_+141 additions, -6 deletions, 5 files changed, 4 hours. Easily my quickest PR so far._

Sometimes you can feel the tingle of _“hey, you know that’s probably done already 201395 times before, probably much better too”_ but keep on doing it anyways…

Exactly that feeling is what I got when I just now produced this list: <https://pastebin.com/c377Rx1K><!--more-->

Butt hay! With quite the minimal amount of code, I got the compiler to be able to in a nice way tidy up identifier names, since G1ANT doesn’t allow any `[^a-zA-Z0-9_]` characters in their identifiers.

And pffffffffffft, no why would I just remove the special characters? What’s the fun it THAT?!

Anypoop here’s a monitordumP of the results

![Unicode to ASCII normalization unit test](/blog/making-a-compiler-ep-10-unic-d-identifier-names/tumblritsa-me-jag17290787145701.png)

And also, now it sees these two variables are different but the generated name is altered to avoid conflict:

![Variable name conflict resolving](/blog/making-a-compiler-ep-10-unic-d-identifier-names/tumblritsa-me-jag17290787145702.png)

PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPretty cool.

Sleep cabin, lads!

> _This post was originally posted (by me) here: <https://itsa-me-jag.tumblr.com/post/172907871457/making-a-compiler-ep-10-%CA%89%C9%B3%C3%AF%CA%97%CA%98%E1%B8%8D%E2%84%87-identifier-names>_
