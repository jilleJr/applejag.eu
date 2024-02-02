---
title: 'Caching APT in Docker builds'
description: >-
  Those poor servers hosting APT packages. APT is superbly optimized with clever caching, but that goes away when you're doing Docker builds. And my poor slow internet access!

  Yea we got Docker layer caching, but that doesn't really account for when you have to make small changes all of the time to the APT packages when developing locally. And does your CI/CD pipeline have distributed Docker layer caching? No? Thought so.
pubDate: '2022-09-23'
heroImage: /blog/caching-apt-in-docker-builds/pexels-tiger-lily-4481326.jpg
tags:
  - guide
  - docker
  - podman
  - programming
---


Those poor servers hosting APT packages. APT is superbly optimized with clever caching, but that goes away when you're doing Docker builds. And my poor slow internet access!

Yea we got Docker layer caching, but that doesn't really account for when you have to make small changes all of the time to the APT packages when developing locally. And does your CI/CD pipeline have distributed Docker layer caching? No? Thought so.

Personally I've found a 60-80% build speedup for `apt update && apt install` tasks thanks to just setting the `http_proxy` environment variable. Here's how!

<!--more-->

## Step 1. Run an APT cache server

We're going to use the [docker.io/konstruktoid/apt-cacher-ng](https://hub.docker.com/r/konstruktoid/apt-cacher-ng) Docker image that packages apt-cacher-ng *(aka ACNG, APT-Cacher-Next-Generation)*.

```sh
docker run -d --restart=always --cap-drop=all --name apt-cacher-ng -p 3142:3142 konstruktoid/apt-cacher-ng VerboseLog=1 Debug=7 ForeGround=1 PassThroughPattern=.*

# Or via Podman:
podman run -d --restart=always --cap-drop=all --name apt-cacher-ng -p 3142:3142 konstruktoid/apt-cacher-ng VerboseLog=1 Debug=7 ForeGround=1 PassThroughPattern=.*
```

The above starts a "detached" container (i.e. runs in the background) of `apt-cacher-ng`.

> For CI/CD pipelines, you should consider hosting the APT cache server somewhere accessible in your company's network. Like hosting the `apt-cacher-ng` in some internal Kubernetes cluster. Or, at our company we have a [Nexus repository](https://www.sonatype.com/products/nexus-repository) that supports APT cache as one of its repository types, which then also can be configured with automatic garbage collection.

## Step 2. Set env var `http_proxy` before any APT action

Here we're just running a silly experiment to prove a point. Let's run some `apt` stuff!

```console
$ podman run --rm -it ubuntu:22.04 bash -c 'time apt update'
...
real	0m2.113s
user	0m1.192s
sys	0m0.215s

$ podman run --rm -it -e http_proxy=http://localhost:3142 --network host ubuntu:22.04 bash -c 'time apt update'
...
real	0m1.239s
user	0m1.190s
sys	0m0.189s
```

Without cache: 2s
With cache: 1.2s
About 66% faster! :)

But let's compare with some package installs.

```console
$ podman run --rm -it ubuntu:22.04 bash -c 'time (apt update && apt install -y git)'
...
real	0m6.258s
user	0m2.848s
sys	0m1.016s

$ podman run --rm -it -e http_proxy=http://localhost:3142 --network host ubuntu:22.04 bash -c 'time (apt update && time apt install -y git)'
...
real	0m3.443s
user	0m2.759s
sys	0m0.960s
```

Without cache: 6s
With cache: 3.5s
Now 70-80% faster!

> I'm adding `--network host` here because I want to have access to the `apt-cacher-ng` container on the same host's network. If `apt-cacher-ng` was hosted elsewhere then I wouldn't need the `--network host` hack.

## Step 3. Use in builds

You can use the `ARG` Dockerfile command. Here's an example Dockerfile:

```dockerfile
FROM ubuntu:22.04

ARG http_proxy="http://localhost:3142"
# Just installing a bunch of stuff for testing purposes
RUN apt update && apt install -y curl wget git man python3 jq nodejs golang
```

```sh
podman build . -t my-image:latest --network host
```

And then just like that you get a major speed boost in your builds! Aaand the best part is that now you can rest easy that you computer isn't DDOS'ing the APT servers.

> I'm adding `--network host` here as well, same reason as above.
>
> Could also use the `ENV` Dockerfile command, but by using `ARG` you allow the user to disable the proxy if they need to via `--build-arg http_proxy=""`.

Have fun~

---

*(Photo by [Tiger Lily](https://www.pexels.com/photo/photo-of-warehouse-4481326/))*
