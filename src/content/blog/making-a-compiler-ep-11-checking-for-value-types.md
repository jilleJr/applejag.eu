---
title: 'Making a compiler (ep 11) Checking for value types'
description: 'A feature I’ve been draggin in my mind for quite the time, even mentioned it in a previous post, but when I finally got around implementing it, it went surprisingly well  ¯\_(ツ)_/¯'
pubDate: '2018-04-17'
heroImage: /blog/making-a-compiler-ep-11-checking-for-value-types/tumblritsa-me-jag17302878424702.png
tags:
  - adventiredOfG1ant
  - csharp
  - devlog
  - g1ant
  - programming
---

A feature I’ve been draggin in my mind for quite the time, even mentioned it in a previous post (<./making-a-compiler-ep-9-adding-while-loops-be-eaasy>), but when I finally got around implementing it, it went surprisingly well  ¯\\_(ツ)_/¯

The feature in question is this thing about value conflict in variables. The G1ANT.Robot language doesn’t allow it, so I thought…. yea fuck that, I’m not goin to either.

I was already savin the shitty variables in stacks of lists for each code block, so I just added a Type value to the items and zamziop kdone. Now just throw some exceptions here n there were the value types differs.

![Example code that will throw on compilation](/blog/making-a-compiler-ep-11-checking-for-value-types/tumblritsa-me-jag17302878424701.png)<!--more-->

^this here gives an exception if you toss it into the compiler nowadays, but PRE This addin it didn’t!

The biggest hurdle though was to fuyckin check what the result of an operation was…. UGGGGG

To solve that, I someone cheated. I mixed try-catch statements with the dynamic keyword…. 👿😈

![Checking if two types can be compared via dynamic types](/blog/making-a-compiler-ep-11-checking-for-value-types/tumblritsa-me-jag17302878424702.png)

I MEAN, MAYBE I could’ve made a robust USE-REFLECTION-TO-CJECK-FOR-OPERATOR-FUNCTIONS but FUCK THJAT when you can just do this^^^^

**Ｋ**ｅｅｐ**Ｉ**ｔ**Ｓ**ｈｉｚｚｌｅ**Ｓ**ａｌｌｙ

Also SHUT UP, I know I’m checking for null AFTER doing the operation, butT FUCK IT

Arroir shoirrznutz!

> _This post was originally posted (by me) here: <https://itsa-me-jag.tumblr.com/post/173028784247/making-a-compiler-ep-11-checking-for-value-types>_
