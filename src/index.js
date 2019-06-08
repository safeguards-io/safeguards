const path = require('path');

const { Command, flags } = require('@oclif/command');
const color = require('chalk');
const { cli } = require('cli-ux');
const { loadConfig } = require('./lib/config');
const terraform = require('./provisioners/terraform');
const { loadPolicyPlan, checkPolicies } = require('./lib/policy');
const composer = require('./lib/composer');


class CheckCommand extends Command {
  async run() {
    const parsedCommand = this.parse(CheckCommand);
    const configFile = path.resolve(process.cwd(), parsedCommand.flags.config);
    const workingDir = path.dirname(configFile);
    let config;


    try {
      cli.action.start('Checking terraform version');
      terraform.checkDependencies();
      cli.action.stop(color.green('ready'));
      cli.action.start('Checking terraform state');
      terraform.checkProjectDependencies(workingDir);
      cli.action.stop(color.green('ready'));
    } catch (ex) {
      this.error(ex.message);
    }
    cli.action.stop(color.green('ready'));

    cli.action.start('Checking safeguards.yml configuration');
    try {
      config = loadConfig(configFile);
      cli.action.stop(color.green('ready'));
    } catch (ex) {
      cli.action.stop(color.yellow('not found - going to create a new safeguards.yml file'));
    }

    if (!config) {
      cli.action.start('Creating safeguards.yml');
      try {
        composer.init(configFile);
      } catch (ex) {
        this.error(ex.message);
      }
      cli.action.stop(color.green('ready'));

      config = loadConfig(configFile);
    }

    if (config) {
      try {
        cli.action.start('Generating the terraform state');
        const data = { terraform: terraform.load(workingDir, parsedCommand.flags) };
        const policies = loadPolicyPlan(config, data);
        cli.action.stop(color.green('ready'));

        this.log(color.bold('\nCHECKING SAFEGUARD POLICIES\n'));
        checkPolicies(policies);
      } catch (ex) {
        this.error(ex.message);
      }
    }
  }
}

CheckCommand.description = `Describe the command here
...
Extra documentation goes here
`;

CheckCommand.flags = {
  config: flags.string({
    char: 'c',
    description: 'Use a config file other than the default safeguards.yml',
    default: 'safeguards.yml',
  }),
  ...terraform.commandOptions,
};

module.exports = CheckCommand;
