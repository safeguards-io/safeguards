const path = require('path');
const { Command, flags } = require('@oclif/command');
const color = require('chalk');
const { cli } = require('cli-ux');
const { loadConfig } = require('./lib/config');
const terraform = require('./provisioners/terraform');
const { checkPolicies } = require('./lib/policy_handler');
const composer = require('./lib/composer');

class CheckCommand extends Command {
  async run() {
    const parsedCommand = this.parse(CheckCommand);
    const configFile = path.resolve(process.cwd(), parsedCommand.flags.config);
    let config;
    let firstTime = false;

    cli.action.start('Initializing');

    try {
      terraform.checkDependencies();
    } catch (ex) {
      this.error(ex.message);
    }

    try {
      config = await loadConfig(configFile);
    } catch (ex) {
      config = false;
    }

    if (!config) {
      try {
        composer.init(configFile);
      } catch (ex) {
        this.error(ex.message);
      }

      config = await loadConfig(configFile);
      firstTime = true;
    }

    cli.action.stop(color.green('ready'));

    try {
      cli.action.start('Loading terraform plan and state');
      const data = { terraform: terraform.load(parsedCommand.flags) };
      // const policies = await loadPolicyPlan(config, data);
      cli.action.stop(color.green('ready'));

      this.log(color.bold('\nCHECKING SAFEGUARD POLICIES\n'));
      // await checkPolicies(policies);
      await checkPolicies(config, data);
    } catch (ex) {
      this.error(ex.message);
    }

    if (firstTime) {
      this.log('\n----------------------------');
      this.log(`\n${color.green(`${color.bold('Success!')} You just completed your first safeguard policy check!`)}`);
      this.log('\nNext steps:');
      this.log('- Customize your policies in the `safeguards.yml` file. You can find more policies at https://registry.safeguards.io/');
      this.log("- Run 'safeguards' again to test your new policies");
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
