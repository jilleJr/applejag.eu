---
title: 'Embed link.xml in UPM package (Unity3D)'
description: >-
  In Unity (the game engine) you can tell the compiler not to strip away certain parts of your code,
  or to “preserve” it to use the correct term.
  You do this either with a `[Preserve]` attribute, or with a link.xml file.

  Up until recently, it was unknown how to include such a `link.xml` file inside your UPM packages, as it had not been documented. Big thanks to maksimbu over at the Unity forums who did the most RnD here.
pubDate: '2021-04-10'
heroImage: /blog/embed-link-xml-in-upm-package-unity3d/pexels-lucas-fonseca-2239655.jpg
tags:
  - guide
  - unity
  - upm
  - il2cpp
---

In Unity (the game engine) you can tell the compiler not to strip away certain parts of your code, or to "preserve" it to use the correct term. You do this either with a [`[Preserve]` attribute](https://docs.unity3d.com/Manual/ManagedCodeStripping.html#PreserveAttribute), or with a [`link.xml` file](https://docs.unity3d.com/Manual/ManagedCodeStripping.html#LinkXML).

Up until recently, it was unknown how to include such a `link.xml` file inside your UPM packages, as it had not been documented. Big thanks to [maksimbu](https://forum.unity.com/members/maksimbu.6424246/) over at the Unity forums [who did the most RnD here](https://forum.unity.com/threads/while-custom-package-need-a-link-xml.727460/#post-6637414).

You have two main options:

1. Add a section to your `README.md` telling your users to create a `link.xml` file themselves in their `Assets/` directory and add given content you specify.

2. Embed your `link.xml` inside a precompiled assembly (DLL) inside your package.

We will be going through option 2.<!--more-->

## Embedded resource

1. Create a .NET project, if you don't have one already. (Can be C#, F#, VB, _whatever_, as long as it has a `.*proj` file)

2. Add your `link.xml` file to your project. Recommended to place it at `Resources/link.xml`.

3. Add the following to your `.*proj` file (ex: `.csproj`):
   ```xml
     <ItemGroup>
       <EmbeddedResource Include="Resources\link.xml">
         <LogicalName>MyAssemblyName.xml</LogicalName>
       </EmbeddedResource>
     </ItemGroup>
   ```
   The file must be an embedded resource, and if you omit the `<LogicalName>` property then the resource will get a generated name with the assembly name prefixed on the files name. Even if you name your file `MyAssemblyName.xml`, without `<LogicalName>` that embedded resource will then have the name `MyAssemblyName.MyAssemblyName.xml`, which Unity will then not find.

4. Replace `MyAssemblyName` with the name of your assembly.

5. Compile and include the DLL in your package. For most cases, you can precompile all your C# code you would anyway include into your package to get much faster compiling and loading for the user, at the cost of a little bigger package size.

The above solution is used in my package [Newtonsoft.Json-for-Unity](https://github.com/jilleJr/Newtonsoft.Json-for-Unity), as can be seen here: <https://github.com/jilleJr/Newtonsoft.Json-for-Unity/blob/bfd8ab8/Src/Newtonsoft.Json/Resources/link.xml>

Have a great dane!~~

---

*(Cover photo by [Lucas Fonseca](https://www.pexels.com/photo/man-in-front-of-monitor-2239655/))*
