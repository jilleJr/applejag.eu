---
title: 'Flatpak Firefox in Fedora Kinoite/Silverblue/rpm-ostree'
description: >-
  Fedora Kinoite and Silverblue come shipped with Firefox pre-installed, but without hardware acceleration libraries because of licensing issues with those dependencies.
pubDate: '2023-02-16'
heroImage: /blog/flatpak-firefox-in-fedora-kinoite-silverblue-rpm-ostree/pexels-patrice-schoefolt-14050363.jpg
tags:
  - guide
  - linux
  - firefox
  - ostree
---


Fedora [Kinoite](https://kinoite.fedoraproject.org/) and [Silverblue](https://silverblue.fedoraproject.org/) come shipped with Firefox pre-installed, but without hardware acceleration libraries because of licensing issues with those dependencies.

To fix this, here's the short version:

```sh
# Uninstalls Firefox from base ostree image. Requires restart
sudo rpm-ostree override remove firefox firefox-langpacks

# Installs Firefox
flatpak install flathub org.mozilla.firefox

# Extensions for video codecs, hardware acceleration drivers, etc
flatpak install flathub org.freedesktop.Platform.ffmpeg-full org.freedesktop.Platform.VAAPI.Intel org.freedesktop.Platform.GL.default
```

More info on additional Flatpak runtime extensions: <https://docs.flatpak.org/en/latest/available-runtimes.html>

If this doesn't resolve your performance issues completely, there are more tips below in this post.

<!--more-->

## Further Firefox changes

In case you still have performance problems, you may have some success with the [tips by Dadrophenia from Reddit](https://www.reddit.com/r/flatpak/comments/k9oih9/how_i_got_hardware_acceleration_working_on/), such as visiting `about:config` and changing to the following settings:

```properties
gfx.webrender.all=true
media.ffmpeg.vaapi.enabled=true
media.ffvpx.enabled=false # (maybe not required anymore?)
media.av1.enabled=false # (maybe not required anymore?)
```

There's also this wiki page from Fedora regarding hardware acceleration that might be useful: <https://fedoraproject.org/wiki/Firefox_Hardware_acceleration> Note: it assumes regular DNF/YUM install, not Flatpak.

## Fallback to rpm-ostree install

RPM Fusion repository doesn't work super great with rpm-ostree, however they do have a dedicated guide on this topic: <https://rpmfusion.org/Howto/OSTree>

This then assumes you don't override the ostree base image. You can revert your Firefox overrides by running:

```sh
# Re-enables Firefox from base ostree image. Requires restart
sudo rpm-ostree override reset firefox firefox-langpacks
#                        ^^^^^
#                       "reset" instead of "remove"
```

## Fallback to Chromium

*I know, I know... We're talking about Firefox here.* But some workloads like hardware-accelerated video ***encoding*** &times; Firefox &times; Flatpak &times; Wayland, are perhaps not super well supported yet.

Chromium handles this *better*, and can sometimes be a necessary option when your job relies on web conference tools like Zoom or Google Meet.

Switching to the Flatpak version of Brave (which is a Chromium-based browser) has worked great for me whenever my Firefox starts hogging CPU.

```sh
flatpak install flathub com.brave.Browser
```

---

*(Photo by [patrice schoefolt](https://www.pexels.com/photo/red-panda-on-brown-tree-trunk-14050363/))*
