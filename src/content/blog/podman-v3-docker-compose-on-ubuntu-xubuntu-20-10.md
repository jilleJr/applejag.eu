---
title: 'Podman v3 + docker-compose on Ubuntu (Xubuntu) 20.10'
description: >-
  I'm just documenting how I got it to work, with the various sources in each section in case something gets outdated
pubDate: '2021-04-08'
heroImage: /blog/podman-v3-docker-compose-on-ubuntu-xubuntu-20-10/podman.png
tags:
  - docker
  - guide
  - linux
  - podman
---

This was done on a Xubuntu machine. Not in WSL. May or may not work in WSL.

I'm just documenting how I got it to work, with the various sources in each section in case something gets outdated.<!--more-->

## Install podman

This ensures you get Podman v3+. Podman v2 does not support the docker.sock feature that we need here.

```sh
. /etc/os-release

echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_${VERSION_ID}/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list

curl -L "https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_${VERSION_ID}/Release.key" | sudo apt-key add -

sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install podman
```

> *Source: <https://podman.io/getting-started/installation>*

## Install fuse-overlayfs

```sh
sudo apt install fuse-overlayfs
```

Edit `/etc/containers/storage.conf` (as root) by uncommenting the line `#mount_program = "/usr/bin/fuse-overlayfs"` under the `[storage.options.overlay]` section, like so:

```diff
 [storage.options.overlay]
 # ignore_chown_errors can be set to allow a non privileged user running with
 # a single UID within a user namespace to run containers. The user can pull
 # and use any image even those with multiple uids.  Note multiple UIDs will be
 # squashed down to the default uid in the container.  These images will have no
 # separation between the users in the container. Only supported for the overlay
 # and vfs drivers.
 #ignore_chown_errors = "false"

 # Path to an helper program to use for mounting the file system instead of mounting it
 # directly.
-#mount_program = "/usr/bin/fuse-overlayfs"
+mount_program = "/usr/bin/fuse-overlayfs"

 # mountopt specifies comma separated list of extra mount options
 mountopt = "nodev,metacopy=on"
```

> *Source: <https://github.com/containers/podman/blob/master/docs/tutorials/rootless_tutorial.md>*

## Symlink docker&rarr;podman

Docker-compose tries to call `docker` command when it builds. We want it to use Podman instead. Aliasing only applies for the user in the interactive shell and not for other commands, therefore a symlink is required.

```sh
sudo ln -vs /usr/bin/podman /usr/local/bin/docker
```

> *(No source)*

## Install docker-compose

We only want docker-compose. We do not want the other dependencies that you get if you would've installed via `apt`, such as the `docker.io` or `containerd` packages.

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```

> *Source: <https://docs.docker.com/compose/install/>*

## Enable podman.sock & link docker.sock

Uses systemd to basically run `/usr/bin/podman system service`. It comes shipped with the Podman APT package we installed previously.

```sh
sudo systemctl start podman.service
sudo systemctl enable podman.socket

sudo ln -sv /run/podman/podman.sock /run/docker.sock
sudo ln -sv /run/podman/podman.sock /var/run/docker.sock
```

Test if it works:

```sh
$ sudo curl -H "Content-Type: application/json" --unix-socket /var/run/docker.sock http://localhost/_ping
OK
```

> *Source: <https://github.com/containers/podman/tree/v3.1.0/contrib/systemd>*

## Always run podman as root

This is a limitation with the `podman.sock` at the time of writing (2021-04-08), that the systemd Unix socket `/run/podman/podman.sock` has to run as root and therefore it can only be accessed via root.

It's recommended to only use Podman as root then, because otherwise you will be mixing up which containers and images you're really using, as they are stored and maintained on a per-user basis.

Suggest adding the following to your `~/.profile`, `~/.zprofile`, or similar file:

```sh
alias podman='sudo podman'
alias docker='sudo podman'
alias docker-compose='sudo docker-compose'
```

> *Source: <https://github.com/containers/podman/blob/v3.1.0/rootless.md>*

## Test it out

```sh
mkdir gitea-postgres
cd gitea-postgres
wget 'https://github.com/docker/awesome-compose/raw/master/gitea-postgres/docker-compose.yaml'

# You can omit the 'sudo' if you have the alias setup
sudo docker-compose up
```

Then visit: <http://localhost:3000>

To cleanup both containers, data, and volumes, run the following:

```sh
# You can omit the 'sudo' if you have the alias setup
sudo docker-compose down -v
```

> *Sources:*
>
> - <https://www.redhat.com/sysadmin/podman-docker-compose>
> - <https://github.com/docker/awesome-compose/tree/master/gitea-postgres>
