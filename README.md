safeguard
=========

Safeguard is a tool for validaitng the safety and security of your infrastructure before it is provisioned.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/safeguard.svg)](https://npmjs.org/package/safeguard)
[![Downloads/week](https://img.shields.io/npm/dw/safeguard.svg)](https://npmjs.org/package/safeguard)
[![License](https://img.shields.io/npm/l/safeguard.svg)](https://github.com/safeguards-io/safeguard/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g safeguard
$ safeguard COMMAND
running command...
$ safeguard (-v|--version|version)
safeguard/0.0.0 darwin-x64 node-v11.12.0
$ safeguard --help [COMMAND]
USAGE
  $ safeguard COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`safeguard hello`](#safeguard-hello)
* [`safeguard help [COMMAND]`](#safeguard-help-command)
* [`safeguard init`](#safeguard-init)

## `safeguard hello`

Describe the command here

```
USAGE
  $ safeguard hello

OPTIONS
  -c, --config=config  [default: ./safeguards.yml] Use a config file other than the default ./safeguards.yml

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/safeguards-io/safeguard/blob/v0.0.0/src/commands/hello.js)_

## `safeguard help [COMMAND]`

display help for safeguard

```
USAGE
  $ safeguard help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `safeguard init`

Describe the command here

```
USAGE
  $ safeguard init

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/init.js](https://github.com/safeguards-io/safeguard/blob/v0.0.0/src/commands/init.js)_
<!-- commandsstop -->