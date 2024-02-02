---
title: 'kubectl debug + Nixery = SUPERPOWERS!!'
description: >-
  Use case: You have a "FROM scratch" or otherwise really locked down Docker image running in Kubernetes. How do you debug it?
pubDate: '2022-11-04'
heroImage: /blog/kubectl-debug-nixery-superpowers/pexels-cottonbro-studio-8721342.jpg
tags:
  - guide
  - kubernetes
  - docker
  - programming
---


Use case: You have a `FROM scratch` or otherwise really locked down Docker image running in Kubernetes. How do you debug it?

Like this:

```bash
kubectl debug my-mongodb-pod -it --image nixery.dev/mongosh -- mongosh
```

It's like, how did I not find this earlier!?

<!--more-->

## What is `kubectl debug`

The `kubectl debug` command adds an ephemeral container to a Kubernetes Pod. Either by adding the container to an existing Pod (default), or by creating a duplicate Pod with the added container (if using `--copy-to=new-pod-name` flag).

"Ephemeral container" is different than regular app- and init-containers:

- No health checks
- Will not restart the Pod if it crashes
- RAM & CPU usage are not affected by the resource limits/requests set on the other containers
- Does not get counted in `kubectl get pods` output
- Uses equivalent of `RestartPolicy: Never`

Read more: <https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container>

## What is Nixery

NixOS, a GNU/Linux distro, has a very efficient package management system, that keep a very good track of dependencies.

Nixery is independent from NixOS itself, and adds Nix packages to Docker image layers on-demand when you pull them.

For example:

```bash
# Starts a container with only the meta-package shell (Bash+coreutils), Git, and htop
podman run --rm -it nixery.dev/shell/git/htop bash

# Starts a container with only curl
podman run --rm -it nixery.dev/curl curl http://whatthecommit.com/index.txt

# Starts a container with only the mongosh binary
podman run --rm -it nixery.dev/mongosh mongosh -u mongoadmin -p secretpassword
```

It's THE solution for "oh I just need an image with 'those' packages real quick, but who got time to upload some temp Docker images to Quay/Docker Hub??"

Read more: <https://nixery.dev/>

## Accessing files from main app container

The ephemeral debug container is after all it's own container, so accessing files from the main app container gets weird. But there's a trick!

First, you need to target the main app container when starting the debug container, like so:

```bash
# "some-name" being the Pod's main app container's name
kubectl debug my-pod -it --image nixery.dev/shell --target some-name -- bash
```

Inside `/proc/${ some process ID }/root` is the root filesystem of a given process. It gets weird as that file says it's a symlink pointing towards `/`, so stuff that resolves paths for you sometimes gets confused. E.g:

```bash
# The PID (Process ID) of main app container entrypoint command will always be 1
$ realpath /proc/1/root
/
```

But in that directory you'll find the filesystem of the app container, instead of the debug container's files. With this you can do some funky stuff like attaching a `tmux` session from a different container! For example:

1. You have a Pod running with a `tmux` session, e.g like this which will start the Pod `my-tmux` with a container also named `my-tmux`:
  ```bash
  kubectl run my-tmux --image nixery.dev/shell/tmux --rm -it -- tmux
  ```

2. Launch an ephemeral debug container, overriding the `tmux` socket path to use the socket of the app container:
  ```bash
  kubectl debug my-tmux -it --image nixery.dev/shell/tmux --target my-tmux -- tmux -S /proc/1/root/tmp/tmux-0/default attach
  ```

3. Do some inputs in the terminal and see they output from both terminals. They are running in separate containers! :D This also shows that the filesystems are not only accessible between each other, but that even special file types like sockets also work

Read more: <https://iximiuz.com/en/posts/kubernetes-ephemeral-containers/#using-kubectl-debug-with-a-shared-pid-namespace>

## Potential

1. Do memory dumps of applications running in production, e.g via [`dotnet-dump collect`](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/dotnet-dump#dotnet-dump-collect), without the container getting OutOfMemory killed by Kubernetes because it's reaching the RAM resource limits
2. You can start using ["Distroless images"](https://github.com/GoogleContainerTools/distroless), as you can always add the Bash shell later via debug container. Stop shipping debug apps in your Docker images, as this is a major vector for hackers. Like remote code execution vulnerabilities could give them a shell inside the container, but if there's no other programs there, not even a bash, then that plugs that security hole.
3. Collect diagnostics of running Go program via [gops](https://github.com/google/gops)

## Bonus

You can actually also use `kubectl debug` to target the nodes themselves, and a lot of other fun stuff. Do check out the links above, because there's a lot of fun to learn.

Also, if you need this kind of access for locally running Docker containers, check out <https://github.com/iximiuz/cdebug>

---

*(Cover photo by [cottonbro studio](https://www.pexels.com/photo/a-person-sitting-on-the-floor-with-vr-goggles-using-a-computer-8721342/))*
