![Safeguards](https://github.com/safeguards-io/safeguards/blob/master/banner.png)

**Safeguards** is a tool for validaitng the security and opertional compliance of your infrastructure before it is provisioned. It's like a linter for your Terraform, CloudFormation and Azure Resource Manager templates that you can run from your local CLI or integrate it into a CI/CD pipeline. It comes with a wide range of policies out-of-the box so with no configuration you can comply with industry security standards and operational best practices. And if that isn't enough, you can configure the policies or create your own to comply with organization requirements and conventions.

[![Build Status](https://travis-ci.org/safeguards-io/safeguards.svg?branch=master)](https://travis-ci.org/safeguards-io/safeguards)
[![Coverage Status](https://coveralls.io/repos/github/safeguards-io/safeguards/badge.svg?branch=master)](https://coveralls.io/github/safeguards-io/safeguards?branch=master)
[![Version](https://img.shields.io/npm/v/@safeguards/safeguards.svg)](https://npmjs.org/package/@safeguards/safeguards)
[![Downloads/week](https://img.shields.io/npm/dw/@safeguards/safeguards.svg)](https://npmjs.org/package/@safeguards/safeguards)
[![License](https://img.shields.io/npm/l/@safeguards/safeguards.svg)](https://github.com/safeguards-io/safeguards/blob/master/package.json)
[![Known Vulnerabilities](https://snyk.io/test/github/safeguards-io/safeguards/badge.svg?targetFile=package.json)](https://snyk.io/test/github/safeguards-io/safeguards?targetFile=package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @safeguards/safeguards
$ safeguard COMMAND
running command...
$ safeguard (-v|--version|version)
@safeguards/safeguards/0.0.01 darwin-x64 node-v11.12.0
$ safeguard --help [COMMAND]
USAGE
  $ safeguard COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`safeguard check`](#safeguard-check)
* [`safeguard help [COMMAND]`](#safeguard-help-command)
* [`safeguard init`](#safeguard-init)

## `safeguard check`

Describe the command here

```
USAGE
  $ safeguard check

OPTIONS
  -c, --config=config  [default: .safeguards.yml] Use a config file other than the default ./safeguards.yml

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/check.js](https://github.com/safeguards-io/safeguards/blob/v0.0.01/src/commands/check.js)_

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

Run this command in your working directory for a Terraform, CloudFormation or Azure Resource Manager

```
USAGE
  $ safeguard init

OPTIONS
  -t, --template=template  [default: default] Select a template from https://github.com/safeguards-io/templates

DESCRIPTION
  Run this command in your working directory for a Terraform, CloudFormation or Azure Resource Manager
  project. This will generate a .safeguars.yml file in that directory which you should commit to your
  VCS repo. You can use the default template, or select any one of the template from 
  https://github.com/safeguards-io/templates.
```

_See code: [src/commands/init.js](https://github.com/safeguards-io/safeguards/blob/v0.0.01/src/commands/init.js)_
<!-- commandsstop -->
