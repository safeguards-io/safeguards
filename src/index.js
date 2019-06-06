const path = require('path');
const { Command, flags } = require('@oclif/command');
const { loadConfig } = require('./lib/config');
const { loadData } = require('./lib/provisioners');
const { loadPolicyPlan, checkPolicies } = require('./lib/policy');


class CheckCommand extends Command {
  async run() {
    const parsedCommand = this.parse(CheckCommand);
    const configFile = path.resolve(process.cwd(), parsedCommand.flags.config);
    const workingDir = path.dirname(configFile);

    try {
      const config = loadConfig(configFile);
      const data = loadData(workingDir, { plan: parsedCommand.flags['terraform.plan'] });
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
  'terraform.plan': flags.string({
    description: 'Specify an existing Terraform state file instead of generating a new one',
  }),
};

module.exports = CheckCommand;
