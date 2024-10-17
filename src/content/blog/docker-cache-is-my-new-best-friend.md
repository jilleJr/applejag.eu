---
title: 'Docker cache is my new best friend'
description: >-
  My main gripe with Docker is that it's so bad at caching.
  Yes yes yes, snip it, I know that Docker caches the build layers.
  But every build tool (cough cough only the good ones) has their
  own level of caching. But as soon as you do make builds via Docker
  then you lose all that!
pubDate: '2024-10-18'
heroImage: /blog/docker-cache-is-my-new-best-friend/docker.png
tags:
  - docker
  - go
  - guide
  - podman
  - programming
---

*Oh boy nobody told me build times could be this fast.*

My main gripe with Docker is that it's so bad at caching.
Yes yes yes, snip it, I know that Docker caches the build layers.
And I know about tool-specific optimizations like
[caching APT in Docker builds](/blog/caching-apt-in-docker-builds/).
But every build tool (i.e not just package managers) has their
own level of caching, and hosting cache proxies for everything sucks.
But most imporantly, **I want build cache!**
Then as soon as you do make builds via Docker you lose all that!

Hah! not so much more many much more moo thank thanks tha
the to [Docker cache mounts](https://docs.docker.com/build/cache/optimize/#use-cache-mounts)
(and yes Podman supports it too):

```dockerfile
FROM golang:1.23
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build
```

I ran `docker build` with that Dockerfile on my dinkur project.
First run took 24 seconds on the `RUN` step.
I then added an empty line to the `main.go` to invalidate the cache in `COPY`.
Then the second run took 1.5 seconds smirk emoji

## How it works

Simply put:

- `--mount=type=cache` creates a new Docker volume, identified by the `target=...` field.
- As long as `target=...` field is the same, then the cache will be reused.
- Alternatively, you can add `id=...`, which defaults to the same value as `target=...`
- It does not care about the path of the Dockerfile. Only the ID.
- Skip cache with `docker build --no-cache`
- Clear cache with `docker buildx prune`
- The cache is stored in the same place as other Docker image layers/caches. I.e `/var/lib/docker/overlay2/...`

## Go build cache

Above was a minimal example.
This is how you want a proper Go Dockerfile to look like:

```dockerfile
FROM golang:1.23 AS build
WORKDIR /go/src/app

# First cache dependencies
# This allows distributed caches to still work
# (such as Docker builds in GitHub Actions)
# as they still primarily only cache by Docker image layers.
COPY go.mod go.sum .
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

# Build the rest of the files
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go install

FROM cgr.dev/chainguard/static
COPY --from=build /go/bin/my-app /bin/my-app
ENTRYPOINT ["/bin/my-app"]
```

Sources:

- Cache mount for Go: <https://stackoverflow.com/a/72558221> ([Docker's own docs](https://docs.docker.com/build/cache/optimize/#use-cache-mounts) does not cover build cache in `/root/.cache/go-build`)
- I found `cgr.dev` Docker image when using Ko: <https://ko.build/configuration/#overriding-base-images>, and it seems like the perfect Go base image instead of `FROM scratch`

## Debian/Ubuntu apt dependency cache

Apt and apt-get does not support multiple processes to run at the same time.
It requires some locking to make sure only 1 instance touches the cache at a time.

Luckily, Docker thought of that and added `sharing=locked`:

```dockerfile
FROM ubuntu:latest
RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean \
    && apt-get update \
    && apt-get -y --no-install-recommends install ruby ruby-dev gcc
```

Successive runs will still need to install the packages. So it's not a huge big time win.
However it is a nice network win as you don't need to pull the packages again.

Source: <https://stackoverflow.com/a/72851168>

## Node/NPM/JavaScript

Because NPM also removes packages when doing `npm install`/`npm ci`,
then you want to tell NPM that this is only a cache and not the
resulting `node_modules` directory.

```dockerfile
FROM node

WORKDIR /usr/src/app
COPY package.json package-lock.json .
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm \
    && npm ci
```

This means you can reuse the cache across projects without messing up your cache.

For [Deno](https://deno.com/), [Bun](https://bun.sh/), [pnpm](https://pnpm.io/),
[Yarn](https://yarnpkg.com/), and others alike you might need some more digging in how to use it properly.

Source: <https://stackoverflow.com/a/64192857>

---

That's the stuff I currently have a use-case for.
But it's probably easy enough to extrapolate how to use this in other tools
like Java or .NET builds for build and package cache.
