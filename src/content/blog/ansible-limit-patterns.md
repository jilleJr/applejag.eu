---
title: 'Ansible --limit patterns'
description: >-
  Did you know you can do more than just “OR”-ing groups and hosts with the Ansible --limit flag?
pubDate: '2023-01-24'
heroImage: /blog/ansible-limit-patterns/pexels-engin-akyurt-9756784.jpg
tags:
  - guide
  - ansible
  - programming
---

Did you know you can do more than just "OR"-ing groups and hosts with the Ansible `--limit` flag?

```sh
# Target hosts that are both in group_a AND in group_b
ansible --limit "group_a,&group_b"

# Target hosts that are in group_a, but NOT in group_b
ansible --limit "group_a,!group_b"
```

But there's more, like regex patterns and reading hosts from a separate file!
<!--more-->

## Regex patterns

Target hosts and groups using Regex pattern, matches `group_aa`, `group_ac`, `group_ca`, `group_cc` (must prefix with `~` to get processed as regex)

```sh
ansible --limit '~^group_[ac]{2}$'
```

Note that it matches any subsets by default, so the following would match `group_a`, `group_b`, etc:

```sh
ansible --limit '~up_'
```

## Read hosts from file

Target hosts and groups in file (only works on `ansible-playbook` command, not on `ansible` command):

```sh
echo '
host_1
host_2
!group_c
~group_[ab]
# my comment
' > limits.txt

ansible-playbook --limit @limits.txt
```

This allows you to write a subset of hosts or groups to a file, without having to modify the inventory file.

Inside this file, you can still make use of the `&` and `!` operators, as well as the `~` for regex patterns.

You can *kind of* use comments by adding `#` symbol, as you won't have any hosts or groups in your inventory that starts the name with `#`. It's harmless if it can't match, and will log something like:

```console
[WARNING]: Could not match supplied host pattern, ignoring: #my comment
```

## Retries

There's also retry files that Ansible can generate for you when a host fails in a playbook. E.g:

```sh
# Must be "True". Will not activate if set to "true" or "TRUE"
export ANSIBLE_RETRY_FILES_ENABLED=True

ansible-playbook playbooks/my_playbook.yml
```

Logs output:

```console
PLAY [all] *************************************************************************

TASK [do something] ****************************************************************
ok: [host_1]
ok: [host_2]
ok: [host_3]
ok: [host_4]
fatal: [host_5]: FAILED! => {"msg": "error oh no"}
ok: [host_6]
	to retry, use: --limit @/home/yourusername/some/path/to/playbooks/my_playbook.retry

PLAY RECAP *************************************************************************
host_1    : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
host_2    : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
host_3    : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
host_4    : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
host_5    : ok=1    changed=0    unreachable=0    failed=1    skipped=0    rescued=0    ignored=0
host_6    : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

Ansible created a new file, named `my_playbook.retry` in this case, right next to my playbook file, only containing:

```plaintext
host_5
```

Then if I want to rerun the playbook with only failed tasks, I run:

```sh
ansible-playbook playbooks/my_playbook.yml --limit @playbooks/my_playbook.retry
```

## Read more

Documentation on `--limit` patterns: <https://docs.ansible.com/ansible/latest/inventory_guide/intro_patterns.html#advanced-pattern-options>

Documentation on retry files: <https://docs.ansible.com/ansible/latest/inventory_guide/intro_patterns.html#patterns-and-ansible-playbook-flags>

Config reference on `RETRY_FILES_ENABLED`: <https://docs.ansible.com/ansible/latest/reference_appendices/config.html#retry-files-enabled>

---

*(Cover photo by [Engin Akyurt](https://www.pexels.com/photo/cracked-yellow-paving-tile-9756784/))*
