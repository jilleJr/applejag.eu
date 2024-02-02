---
title: "Setting up WriteFreely with Nginx & Let's Encrypt on Ubuntu 20.10 (Groovy Gorilla)"
description: >-
  WriteFreely is a marvelous piece of software. A walkthrough of how I got it running on a Ubuntu 20.10 server.
pubDate: '2021-01-01'
heroImage: /blog/setting-up-writefreely-with-nginx-and-lets-encrypt-on-ubuntu-20-10-groovy/pexels-j-kelly-brito-322335.jpg
tags:
  - guide
  - writefreely
  - linux
---


> *Please dedicate 1-2h of your time for this guide. (Given you follow it from top to bottom.)*

[WriteFreely](https://writefreely.org/), the software that's hosting ~~this blog~~ *(**Edit:** formerly where I hosted my blog)*, is a marvelous piece of software.

My personal quick list of best features:

- Write in Markdown *(even has support for MathJax, though I do not use it)*
- Simple auth
- Supports both single user blog, and multi user blog.
- Suuuper clean frontend design.
- Open Source, written in Go, so I'm already feeling inclined in submitting some PRs.
- Low memory & CPU footprint *(Currently using 175 MiB RAM and 0% CPU while idle.)*
- Simple setup *(for the most part, as we'll discuss in this post)*
- Support for ActivityPub (Fediverse)

The last bullet there about ActivityPub; you better lookup what it is if you're not aware. Google/DuckDuckGo/Yacy/*search for* it to get a grasp what it is. Spoiler: It's very cool. Let's dig into how to setup an instance of your own! <!--more-->

## Elephant in the room: MySQL 8 vs 5

For the most part, you only need to follow the instructions shown at <https://writefreely.org/start>, but I'll cite them here. But MySQL is the biggest issue at the moment.

As described in [issue #335](https://github.com/writeas/writefreely/issues/335#issuecomment-658247794), there's a **backwards incompatability** between MySQL 8 and Mysql 5. *(They skipped MySQL 6 & 7)* But here's the thing: MySQL 8 isn't yet available for Ubuntu 20.10 Groovy Gorilla! (as of today, 2021-01-01, *happy new year!*)

You may've experienced this if you've tried. The documentation states to just run the command `sudo dpkg-reconfigure mysql-apt-config`, where you then can select if you want version 8, 5.7, 5.6, *or whatever version you need.* But on Ubuntu 20.10, they seem to only have release version 8 as a starter. This seems to be a pattern though. They will probably fix a release, soon™️

The requirements on the <https://writefreely.org/start> page:

> ### Requirements for MySQL-backed installs
>
> - A MySQL (5.6+) database
> - Database server timezone set to UTC

^ Means you need MySQL &ge; 5.6 & < 6.\*. I.e. 5.6.\* or 5.7.\*. MySQL 8 is off limits!

But let's go from the top! Here's how I installed WriteFreely:

## Sort out your DNS

This is up to you. It's so wide spread in how it's done, so you have to seek other knowledge sources. Best tip though: **Remember that DNS usually takes up to 24h to apply & refresh.** You need to be patient with this kind of stuff.

## Root access to a Linux server

Could be hosted on your own <abbr title="PC = Personal Computer. Antonym of 'Server'. Stop thinking that PC = Windows! There are PCs running Linux and OS X as well!!">PC</abbr>, but you need root access as we're going to install stuff natively.

If you can run `sudo apt update`, then you're all good!

If you can't, *well I'm only here to discuss the happy path OK I don't want to go on writing too much. Use your google-foo*

## Installing MySQL 5.7

> **Note:** This does assume the official `mysql_config.deb` package does not have MySQL 5.7 available yet for Ubuntu 20.10.

First step is to obtain the `.deb` files. We're cheating here a little bit, as we're going to use the `.deb` files that target Ubuntu 18.04, but that has so far worked out for me. No issues.

I retrieved the downloads from this page: <https://dev.mysql.com/downloads/mysql/5.7.html>

What you do is fill out the options on the page, something like:

- **Select Version:** 5.7.32
- **Select Operating System**: Ubuntu Linux
- **Select OS Version:** Ubuntu Linux 18.04 (x86, 64-bit)

In the list that forms below, find the one named **"DEB Bundle"** (should be at the top)

![DEB Bundle package in the packages list](/blog/setting-up-writefreely-with-nginx-and-lets-encrypt-on-ubuntu-20-10-groovy/bfaklb1c.png)

We want this download available on our Linux server. What we can do is copy the link of the `.tar` download URL and run something like:

```sh
kalle@localhost:~$ wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-server_5.7.32-1ubuntu18.04_amd64.deb-bundle.tar

--2021-01-01 01:21:43--  https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-server_5.7.32-1ubuntu18.04_amd64.deb-bundle.tar
Resolving dev.mysql.com (dev.mysql.com)... 137.254.60.11
Connecting to dev.mysql.com (dev.mysql.com)|137.254.60.11|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://cdn.mysql.com//Downloads/MySQL-5.7/mysql-server_5.7.32-1ubuntu18.04_amd64.deb-bundle.tar [following]
--2021-01-01 01:21:44--  https://cdn.mysql.com//Downloads/MySQL-5.7/mysql-server_5.7.32-1ubuntu18.04_amd64.deb-bundle.tar
Resolving cdn.mysql.com (cdn.mysql.com)... 2.21.37.74
Connecting to cdn.mysql.com (cdn.mysql.com)|2.21.37.74|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 159293440 (152M) [application/x-tar]
Saving to: ‘mysql-server_5.7.32-1ubuntu18.04_amd64.deb-bundle.tar’

mysql-server_5.7.32-1ubuntu18.04_amd64.deb-bundle.tar              100%[=================================>] 151.91M  9.35MB/s    in 16s

2021-01-01 01:22:01 (9.28 MB/s) - ‘mysql-server_5.7.32-1ubuntu18.04_amd64.deb-bundle.tar’ saved [159293440/159293440]
```

Now, un-tar that file:

```sh
kalle@localhost:~$ tar xf mysql-server_5.7.32-1ubuntu18.04_amd64.deb-bundle.tar
```

For the record, this results in a lot of files in your current directory:

```sh
kalle@localhost:~$ ls
libmysqlclient-dev_5.7.32-1ubuntu18.04_amd64.deb
libmysqlclient20_5.7.32-1ubuntu18.04_amd64.deb
libmysqld-dev_5.7.32-1ubuntu18.04_amd64.deb
mysql-client_5.7.32-1ubuntu18.04_amd64.deb
mysql-common_5.7.32-1ubuntu18.04_amd64.deb
mysql-community-client_5.7.32-1ubuntu18.04_amd64.deb
mysql-community-server_5.7.32-1ubuntu18.04_amd64.deb
mysql-community-source_5.7.32-1ubuntu18.04_amd64.deb
mysql-community-test_5.7.32-1ubuntu18.04_amd64.deb
mysql-server_5.7.32-1ubuntu18.04_amd64.deb
mysql-server_5.7.32-1ubuntu18.04_amd64.deb-bundle.tar
mysql-testsuite_5.7.32-1ubuntu18.04_amd64.deb
```

Now, what **we want to install is the `mysql-community-server`**, but as that package got some dependencies, we need to do this in a certain order. Namely:

```sh
$ sudo dpkg -i mysql-common_5.7.32-1ubuntu18.04_amd64.deb
$ sudo dpkg -i mysql-community-client_5.7.32-1ubuntu18.04_amd64.deb
$ sudo dpkg -i mysql-client_5.7.32-1ubuntu18.04_amd64.deb
$ sudo dpkg -i mysql-community-server_5.7.32-1ubuntu18.04_amd64.deb
```

> There might be other dependencies there as well. Such as it might complain for `Package libtinfo5 is not installed`, but that's easily resolved by just running:
>
> ```sh
> $ sudo apt install libtinfo5
> ```

The last one above there is the money shot. That will install the `mysql-community-server` package and after its setup initiate the setup sequence where it will ask for root user name and password for the MySQL database. Fill in appropriate values.

That's it! Your MySQL server should be up and running on your Linux server by now!

## Create database in MySQL

The hard part is over. Now back to just citing some WriteFreely written docs.

From the `mysql-client` package you installed in the last step, you should have the `mysql` commandline tool available. Use it to log in to your local MySQL database:

```sh
kalle@localhost:~$ mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.7.32 MySQL Community Server (GPL)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

In this new prompt (as pronounced by the leading `mysql> `) run the following query:

```sql
CREATE DATABASE writefreely CHARACTER SET latin1 COLLATE latin1_swedish_ci;
```

Then you can write the query `exit` and you should get back to your bash prompt. Sample output:

```sh
mysql> CREATE DATABASE writefreely CHARACTER SET latin1 COLLATE latin1_swedish_ci;
Query OK, 1 row affected (0.00 sec)

mysql> exit
Bye
kalle@localhost:~$
```

## Installing Nginx

Next step: Nginx!

What is Nginx? *Google it, lol.* Nah jk, it's a web traffic router of sorts. It has a lot of performant routing, caching, TLS/SSL certificate serving, reverse proxying management, and a lot more built in. We'll explore the TLS/SSL certificate serving and reverse proxying in this post.

Run the following: <em>(cited from: <http://nginx.org/en/linux_packages.html#Ubuntu>)</em>

```sh
kalle@localhost:~$ sudo apt install -y curl gnupg2 ca-certificates lsb-release

kalle@localhost:~$ echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list

kalle@localhost:~$ curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
```

The last bit there just snagged the Nginx public signing key for their packages. Now be the good Linux administrator I know you are and doublecheck it's the correct one. Run the following command, and the certificate should show up:

```sh
kalle@localhost:~$ sudo apt-key fingerprint ABF5BD827BD9BF62
pub   rsa2048 2011-08-19 [SC] [expires: 2024-06-14]
      573B FD6B 3D8F BC64 1079  A6AB ABF5 BD82 7BD9 BF62
uid   [ unknown] nginx signing key <signing-key@nginx.com>
```

If no: toss your arms up in the air and do a small shout of "EEEEEeeeeeEEEE", then get off that airport Wi-Fi and complete this later when there's no hacker in the middle.

If yes: Run the following commands to install Nginx:

```sh
kalle@localhost:~$ sudo apt update
kalle@localhost:~$ sudo apt install nginx
```

Hey! It's installed now! Try visit your server at port 80 and you should see something like this:

![Nginx default landing page](/blog/setting-up-writefreely-with-nginx-and-lets-encrypt-on-ubuntu-20-10-groovy/auwqs0v9.png)

## Install WriteFreely

WriteFreely doesn't have (as of today) an "apt" package. Doesn't really need one either. What you do is just download the 1 single binary that is the entire web service from their GitHub releases page: <https://github.com/writeas/writefreely/releases/latest>

Scroll down on that page to the bottom and find the "Assets" section. There you want to copy the link to (probably) the `writefreely_*_linux_amd64.tar.gz` variant.

We will be hosting the website under `/var/www/yoursite.com/`, so take that into consideration to replace `yoursite.com` with your actual page domain name. As for me, I store mine under `/var/www/blog.jillejr.tech/`.

```sh
kalle@localhost:~$ sudo mkdir -v /var/www
mkdir: created directory '/var/www'
```

Inside that folder, download the `writefreely` binary. Example for WriteFreely v0.12.0:

```sh
kalle@localhost:~$ cd /var/www
kalle@localhost:/var/www$ wget https://github.com/writeas/writefreely/releases/download/v0.12.0/writefreely_0.12.0_linux_amd64.tar.gz
```

Then decompress and un-tar it, like so:

```sh
kalle@localhost:/var/www$ tar xzf writefreely_0.12.0_linux_amd64.tar.gz
```

This extracts into a directory named `writefreely`. Rename the directory to the name of your domain (ex: `yoursite.com`). You may also remove the `.tar.gz` file you downloaded.

```sh
kalle@localhost:/var/www$ mv writefreely yoursite.com
kalle@localhost:/var/www$ rm writefreely_0.12.0_linux_amd64.tar.gz
```

That's mostly it! Now you have your own WriteFreely instance installed at `/var/www/yoursite.com`. Few steps left though before we can boot it up.

## Configure WriteFreely

Navigate to your sites folder and run the `writefreely` program found in that directory with the arguments `config start`, like so:

```sh
kalle@localhost:/var/www$ cd /var/www/yoursite.com
kalle@localhost:/var/www/yoursite.com$ cd /var/www/yoursite.com
kalle@localhost:/var/www/yoursite.com$ writefreely config start
```

This will go through a lot of configurations. Some of which are MySQL related, and some are just basic settings such as the web pages name and URL. Here's how I set up mine:

```sh
kalle@localhost:/var/www/blog.jillejr.tech$ sudo ./writefreely config start
Loaded configuration config.ini.

  ✍ WriteFreely Configuration ✍

  This quick configuration process will update the applications config
file, config.ini.

  It validates your input along the way, so you can be sure any future
errors arent caused by a bad configuration. If youd rather configure your
server manually, instead run: writefreely --create-config and edit that
file.

 Server setup
Production, behind reverse proxy
Local port: 8123

 Database setup
MySQL
Username: root
Password: ********************
Database name: writefreely
Host: localhost
Port: 3306

 App setup
Single user blog
Admin username: REDACTED
Admin password: REDACTED
Blog name: Techy blog of Kalle
Public URL: https://blog.jillejr.tech
Enabled
Public
Public
2021/01/01 03:09:12 Connecting to mysql database...
2021/01/01 03:09:12 Creating user REDACTED...
```

Next step is to generate some secrets that WriteFreely uses internally. Do so by running the following:

```sh
kalle@localhost:/var/www/yoursite.com$ sudo ./writefreely keys generate
```

We're not done yet though! We need Nginx and the Let's Encrypt certs figured out first!

## Configuring Nginx

What you need to do it alter the Nginx config file (named `nginx.conf`) that can usually be found at `/etc/nginx/nginx.conf`.

Use your preferred editor here to edit that file, but make sure to run it with `sudo`! For example:

```sh
# via vim
sudo vim /etc/nginx/nginx.conf
# via nano
sudo nano /etc/nginx/nginx.conf
# via ed (who even uses ed nowadays?)
sudo ed /etc/nginx/nginx.conf
```

Here I find it best to just show by example. Here's how my `nginx.conf` file looked:

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
	# multi_accept on;
}

http {

	##
	# Basic Settings
	##

	sendfile on;
	tcp_nopush on;
	types_hash_max_size 2048;
	# server_tokens off;

	# server_names_hash_bucket_size 64;
	# server_name_in_redirect off;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	##
	# SSL Settings
	##

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	##
	# Logging Settings
	##

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# Gzip Settings
	##

	gzip on;

	# gzip_vary on;
	# gzip_proxied any;
	# gzip_comp_level 6;
	# gzip_buffers 16 8k;
	# gzip_http_version 1.1;
	# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

	##
	# Virtual Host Configs
	##

	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;

	server {

		server_name blog.jillejr.tech;

		gzip on;
		gzip_types
			application/javascript
			application/x-javascript
			application/json
			application/rss+xml
			application/xml
			image/svg+xml
			image/x-icon
			application/vnd.ms-fontobject
			application/font-sfnt
			text/css
			text/plain;
		gzip_min_length 256;
		gzip_comp_level 5;
		gzip_http_version 1.1;
		gzip_vary on;

		location ~ ^/.well-known/(webfinger|nodeinfo|host-meta) {
			proxy_set_header Host $host;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $remote_addr;
			proxy_pass http://127.0.0.1:8123;
			proxy_redirect off;
		}

		location ~ ^/(css|img|js|fonts)/ {
			root /var/www/blog.jillejr.tech/static;
			# Optionally cache these files in the browser:
			# expires 12M;
		}

		location / {
			proxy_set_header Host $host;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $remote_addr;
			proxy_pass http://127.0.0.1:8123;
			proxy_redirect off;
		}

		listen 80;
		listen [::]:80;
	}
}
```

What you need to replace in the above snippet:

- `8123`: That's the port I specified my WriteFreely instance should be hosted at. Replace with what you specified in the `writefreely config start` prompt. There are two occurrences of it above.

- `blog.jillejr.tech`: My domain name. Pretty straight forward but this needs to be your sites domain name. There are two occurrences of it above.

> To fill you out a little, what we're doing here is letting Nginx handle the traffic that comes to port 80 and redirecting it to our WriteFreely application (that's in my case hosted at port 8123), but only if the server name equals `blog.jillejr.tech`.
>
> **Why this redirection?** This is what's called "reverse proxying", where a server can be used for multiple web sites, all hosted at port 80. But depending on what DNS name they supplied (ex: `blog.jillejr.tech` vs `jillejr.tech`) they talk to different web applications. This is a modern standard of hosting multiple sites on the same server.
>
> Though, as stated previously, this is not only why we're using Nginx. We'll come to the other use cases later where we'll add certificates and HTTP***S*** support.

To make the changes apply, we need to explicitly tell Nginx to reload its configuration. Do this with the command:

```sh
kalle@localhost:~$ nginx -s reload
```

Now, if you have your DNS hooked up correctly, you should be able to visit `yoursite.com` and receive some kind of content. Make sure to visit the HTTP version and not the HTTP***S*** version; As we've not yet configured HTTPS, though we want to, and if you've perhaps configured your WriteFreely instance to use the `https://yoursite.com` as host, the page might not work properly yet. But no worries, we'll fix the certificates shortly!

## Going HTTPS with Let's Encrypt

If you're not familiar: [Let's Encrypt](https://letsencrypt.org/) is a non-profit organization that gives out **free certificates!** Or to be more specific, they give out so called "End-Entity Certificates" to anyone, mainly for the web.

_If you already have a certificate, skim ahead a little as you don't need this awesome certificate source._

To take use of this, Let's Encrypt have provided us with a marvellous tool called [`certbot`](https://certbot.eff.org/).

What we're going to do, is install `certbot` as a snap package (or if you will, use an [alternative source](https://certbot.eff.org/docs/install.html)). Run the following:

```sh
# This just updates your version of snapd
kalle@localhost:~$ sudo snap install core; sudo snap refresh core

# Then install the certbot package
kalle@localhost:~$ sudo snap install --classic certbot
```

Here's something I'm going to blindly recommend as the documentation says so, but you should link the `certbot` executable to better ensure you have it available without needing to modify your `$PATH` variable:

```sh
kalle@localhost:~$ sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

**Here's the big one**, tell `certbot` to generate certificates and add those to your `nginx-conf`, all in one short command:

```sh
kalle@localhost:~$ sudo certbot --nginx
```

You will step through a bunch of options while doing this. Now, again, be a good Linux citizen and READ THEIR TERM OF SERVICE!

In a trail to guilt trip you [dear reader], you cannot scroll past this as you do with any other app you install on your computer. Violating their terms can get you into serious legal problems!

Their terms of service is linked to by the `certbot`, but can also be found here in HTML format: <https://community.letsencrypt.org/tos>

Continuing on, the `certbot` commandline interface will step you through some options. It should be able to detect your server name from your Nginx configuration and give you the option to give it a certificate.

```sh
root@localhost:~# sudo certbot --nginx
# snip
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx

Which names would you like to activate HTTPS for?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: blog.jillejr.tech
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 1
```

^ Select the number of the site you'd wish to certificate. For me, that'd be option 1, so I entered the number `1`.

What this will do:

- Generate private and public certificates under
  - `/etc/letsencrypt/live/yoursite.com/fullchain.pem`
  - `/etc/letsencrypt/live/yoursite.com/privkey.pem`
- Alter your Nginx configuration
  - Change the `listen` option from port 80 to port 443.
  - Add loading of the above mentioned `.pem` certificates
  - Add a new `server` section with `listen` on port 80 and then redirects to port 443.
- Trigger `nginx -s reload` for you.

The new HTTPS site should be visible immediately (given you have the port 443 open in your firewall). No 24h waiting. Try visit "yoursite.com", and in most browsers you will see a nice padlock next to your URL.

![URL-bar for blog.jillejr.tech in Chrome with the padlock](/blog/setting-up-writefreely-with-nginx-and-lets-encrypt-on-ubuntu-20-10-groovy/5j5uqcbb.png)

Now, next thing to assert is certificate renewal. Given everything is configured correctly, you should be able to run the following dry-run command:

```sh
sudo certbot renew --dry-run
```

> The argument `--dry-run` means it will not apply any changes. The command will only do "immutable assertions", if you will. It's considered OK to run a `--dry-run` command as many times as you want, as long as you don't hit the Let's Encrypt's API request throttle limits.

Next thing you can verify is that the `certbot` renewal [cron](https://en.wikipedia.org/wiki/Cron) job is set up. Do that by running the following command:

```sh
kalle@localhost:~$ systemctl list-timers | grep -E 'NEXT|certbot'
NEXT                        LEFT           LAST                        PASSED       UNIT                           ACTIVATES
Fri 2021-01-01 22:40:00 UTC 18h left       Fri 2021-01-01 00:14:06 UTC 3h 51min ago snap.certbot.renew.timer       snap.certbot.renew.service

```

If you get an output, then it's all OK! The output is a little bit cramped here on this web page, so here's a preview in my console where the headers line up:

![console output](/blog/setting-up-writefreely-with-nginx-and-lets-encrypt-on-ubuntu-20-10-groovy/hrdi5hqy.png)

In my case, it tells me that my next automatic renewal will be run again in 18h. (It runs once per 24h)

And yes, Nginx will automatically use the renewed certificates after a renewal. You don't need to visit these configurations again!

## Wrapping up

That ought to be everything.

Given you have followed my gastly guide from top to bottom, you should have successfully set up:

- Reverese proxying via Nginx
- HTTPS via certificates from Let's Encrypt with automatic renewal
- Run MySQL 5.7 on Ubuntu 20.10
- Run WriteFreely, configured the way you want it.
- _a nice well rested night. Sleep tight <3_

## "But I got stuck"

Just contact me! Do it before I change my mind! ;)

You'll have to dig for yourself after my contact info though. I'm not trying to hide it; my contact info can be found almost anywhere if you just google any one of my usernames or real name. I just don't want to post them here to have yet another place to update my contact info once I submit myself to a new [to me] social platform.

Search on Google/Yahoo/Bing/Yacy/DuckDuckGo/Yandex/*how many search engines can I fit here?*/Gibiru/GitHub/*etc.* for one of the following names and you'll find me.

---

*Cover photo by [J. Kelly Brito](https://www.pexels.com/photo/woman-at-work-322335/)*
