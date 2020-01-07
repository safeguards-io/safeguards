![Safeguards](https://raw.githubusercontent.com/safeguards-io/safeguards/master/banner.png)

**Safeguards** is a tool for validaitng the security and opertional compliance of your infrastructure before it is provisioned. It's like a linter for your Terraform, CloudFormation and Azure Resource Manager templates that you can run from your local CLI or integrate it into a CI/CD pipeline. It comes with a wide range of policies out-of-the box so with no configuration you can comply with industry security standards and operational best practices. And if that isn't enough, you can configure the policies or create your own to comply with organization requirements and conventions.

[![Build Status](https://travis-ci.org/safeguards-io/safeguards.svg?branch=master)](https://travis-ci.org/safeguards-io/safeguards)
[![Coverage Status](https://coveralls.io/repos/github/safeguards-io/safeguards/badge.svg?branch=master)](https://coveralls.io/github/safeguards-io/safeguards?branch=master)
[![Version](https://img.shields.io/npm/v/@safeguards/safeguards.svg)](https://npmjs.org/package/@safeguards/safeguards)
[![Downloads/week](https://img.shields.io/npm/dw/@safeguards/safeguards.svg)](https://npmjs.org/package/@safeguards/safeguards)
[![License](https://img.shields.io/npm/l/@safeguards/safeguards.svg)](https://github.com/safeguards-io/safeguards/blob/master/package.json)
[![Known Vulnerabilities](https://snyk.io/test/github/safeguards-io/safeguards/badge.svg?targetFile=package.json)](https://snyk.io/test/github/safeguards-io/safeguards?targetFile=package.json)

## Getting Started

### Install

Install safeguards using NPM. We'll support binary installations soon.

```
$ npm install @safeguards/safeguards --global
```

### Create a JSON Terraform Plan

In your Terraform working directory use the `-out` option on `terraform plan` to generate a binary plan file. Use the `terraform show` command to convert the binary plan file to a JSON plan file.

```
$ terraform plan -out plan.tfplan
$ terraform show -json plan.tfplan > ../terraform_plan.json
```

### Define a Safeguard policy

A Safeguard Policy file is a YAML file containing your policies (rules). We'll be using this file to ensure that the generated Terraform plan complies with these policies.

**safeguards.yml**
```yaml
- name: Terraform Version must be 0.12.0 beta or higher
  source:  "@safeguards/safeguards-terraform"
  safeguard: version
  settings: "^0.12.0-beta"
```

This safeguards.yml policy file contains just one policy which uses the `version` safeguard from `@safeguards/safeguards-terraform`. The `version` safeguard inspects the Terraform plan file to ensure it uses only allowed versions of Terraform. In this case we configure the safeguard with the settings `^0.12.0-beta`.

This is just one policy using one safeguard with a very simple setting. Later we'll look at more advanced configurations and more available safeguards.

### Check the policies

Now the magic. Now we run the `safeguard` command to validate that the `terraform_plan.json` complies with the policies we defined in the `safeguards.yml` file.

```
$ safeguard --terraform.plan ./terraform_plan.json
```
