![Safeguards](https://raw.githubusercontent.com/safeguards-io/safeguards/master/banner.png)

**Safeguards** is a CLI tool for testing Terraform state and plan for security and opertional policy compliance.

[![Build Status](https://img.shields.io/travis/safeguards-io/safeguards/master)](https://travis-ci.org/safeguards-io/safeguards)
[![Coverage Status](https://img.shields.io/coveralls/safeguards-io/safeguards/master)](https://coveralls.io/github/safeguards-io/safeguards?branch=master)
[![Version](https://img.shields.io/npm/v/@safeguards/safeguards.svg)](https://npmjs.org/package/@safeguards/safeguards)
[![Downloads/week](https://img.shields.io/npm/dw/@safeguards/safeguards.svg)](https://npmjs.org/package/@safeguards/safeguards)
[![License](https://img.shields.io/npm/l/@safeguards/safeguards)](https://github.com/safeguards-io/safeguards/blob/master/package.json)
[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@safeguards/safeguards)](https://snyk.io/test/github/safeguards-io/safeguards?targetFile=package.json)

## Getting Started

### 1. Install

Install safeguards using NPM. We'll support binary installations soon.

```
$ npm install @safeguards/safeguards --global
```

### 2. Create a Terraform plan

In your Terraform working directory use the `-out` option on `terraform plan` to generate a binary plan file. Use the `terraform show` command to convert the binary plan file to a JSON plan file.

```
$ terraform plan -out plan.tfplan
$ terraform show -json plan.tfplan > ../terraform_plan.json
```

### 3. Define a policy file

A Safeguard policy file is a YAML file containing a list of policies. Each policy specifies a safeguard to use and the settings to pass into that safeguard. We'll be using this file to ensure that the generated Terraform plan complies with these policies.

**safeguards.yml**
```yaml
- name: Terraform Version must be 0.12.0 beta or higher
  source:  "@safeguards/safeguards-terraform"
  safeguard: version
  settings: "^0.12.0-beta"
```

This safeguards.yml policy file contains just one policy which uses the `version` safeguard from `@safeguards/safeguards-terraform`. The `version` safeguard inspects the Terraform plan file to ensure it uses only allowed versions of Terraform. In this case we configure the safeguard with the settings `^0.12.0-beta`.

This is just one policy using one safeguard with a very simple setting. Later we'll look at more advanced configurations and more available safeguards.

### 4. Check the Terraform plan with the policy

Now the magic. Now we run the `safeguard` command to validate that the `terraform_plan.json` complies with the policies we defined in the `safeguards.yml` file.

```
$ safeguard --terraform.plan ./terraform_plan.json
```
