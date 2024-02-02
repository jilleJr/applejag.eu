---
title: 'Rewriting a compiler, for work, as an intern'
description: >-
  When searching for internship via school I found this small startup with this cute project of building a teaching tool for programming. There were back then 2 programmers: the founder and the co-founder.

  First project I get: rewrite the compiler. The Python compiler.
  “But wait, why not just embed a real compiler from the first case?”
  -nanananana it's never simple, as you probably know from your own projects.
pubDate: '2019-03-21'
heroImage: /blog/rewriting-a-compiler-for-work-as-an-intern/ba85sq6.jpg
tags:
  - devlog
  - rant
---


When searching for internship via school I found this small startup with this cute project of building a teaching tool for programming. There were back then 2 programmers: the founder and the co-founder.

Then like 1 week before the internship started, the co-founder had a burnout and had to get off the project, while the company was so low on budget the founder, aka my new b0ss, had to work separate jobs to keep the company alive. (quite metal tbh)

It's funny because I'm a junior developer, 100%. I've been coding as a hobby for around 8 years now but I've never worked in a big company before. (No exception to this workplace either)

First project I get: rewrite the compiler. The Python compiler.
"But wait, why not just embed a real compiler from the first case?"
-nanananana it's never simple, as you probably know from your own projects.<!--more-->

---

The new compiler, as compared to existing embedded compiler solutions out there, needed these prime features:
- Walk through the code (debugger style), but programmatically.
- Show custom exceptions (ex: "A colon is needed at the end of an if-statement" instead of "Syntax error line 3")
- Have a "Did-you-mean this variable?" error for usage of unassigned variables.
- Be able to be embedded in Unity's WebGL build target

All for the use case of being a friendly compiler.
The last dash in the list is actually the biggest bottleneck which excluded all existing open-source projects (i could find). Compliant with WebAssembly I can't use threads among other things, IL2CPP has lots of restrictions, Unity has some as well...

Oh and it should of course be built using test-driven development.

"Good luck!" - said the founder, first day of work as she then traveled to USA for **3 weeks**, leaving me solo with the to-be-made codebase and humongous list of requirements.

---

I just finished the 6th week of internship, boss has been at "HQ" for 3 weeks now, and I just hit the biggest milestone yet for this project.

Yes I've been succeeding! This project has gone so well, and I'm surprising myself how much code I've been pumping out during these weeks.

I'm up now at almost 40'000 lines of source and 30'000 lines of code. ‼
( Biggest project I've ever worked on previously was at 8'000 lines of code )

The milestone (that I finished today) was for-loops! As been trying to showcase in the GIF:

![debugging demo](/blog/rewriting-a-compiler-for-work-as-an-intern/ba85sq6.gif)

It's such a giant project and I can honestly say I've done some good work here. Self-five. Over-performing is a thing.

The things that makes me shiver though is that most that use this application will never know the intricates of it's insides, and the brain work put into it.

The project is probably over-engineered. A lot. Having a home-made compiler gives us a lot of flexibility for our product as we're trying to make more of a "pedagogic IDE". But no matter that I reinvented the wheel for the 105Gth time, it's still the most fun I've had with a project to date.

---

~~Also btw if anyone wants to see source code, please give me good reasons as I'm actively trying to convince my boss to make the compiler open-source.~~ The source code for the compiler can be found here: <https://github.com/zifro-playground/compiler>

Cheers!

> This was originally posted (by me) over at: <https://devrant.com/rants/2036312/long-when-searching-for-internship-via-school-i-found-this-small-startup-with-th>
