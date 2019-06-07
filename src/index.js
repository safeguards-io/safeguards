const path = require('path');
const { Command, flags } = require('@oclif/command');
const { loadConfig } = require('./lib/config');
const terraform = require('./provisioners/terraform');
const { loadPolicyPlan, checkPolicies } = require('./lib/policy');


class CheckCommand extends Command {
  async run() {
    const parsedCommand = this.parse(CheckCommand);
    const configFile = path.resolve(process.cwd(), parsedCommand.flags.config);
    const workingDir = path.dirname(configFile);

    try {
      terraform.checkDependencies();
      terraform.checkProjectDependencies(workingDir);
    } catch (ex) {
      this.error(ex.message);
    }

    try {
      const config = loadConfig(configFile);
      const data = { terraform: terraform.load(workingDir, parsedCommand.flags) };
      const policies = loadPolicyPlan(config, data);
      checkPolicies(policies);
    } catch (ex) {
      this.error(ex.message);
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
    description: 'Use a config file other than the default .safeguards.yml',
    default: '.safeguards.yml',
  }),
  ...terraform.commandOptions,
};

module.exports = CheckCommand;
