const color = require('chalk');
const fs = require('fs');
const request = require('request-promise');
const { Command, flags } = require('@oclif/command');

class InitCommand extends Command {
  async run() {
    const parsedCommand = this.parse(InitCommand);
    const { template } = parsedCommand.flags;
    const downloadUrl = `https://github.com/safeguards-io/templates/raw/master/${template}.safeguards.yml`;

    let content;
    try {
      content = await request(downloadUrl);
    } catch (ex) {
      this.error(`Couldn't find or download template '${template}'`);
    }

    try {
      fs.writeFileSync('.safeguards.yml', content);
    } catch (ex) {
      this.error('Failed to write .safeguards.yml file, but download was successful');
    }

    this.log(color.green(`Successfully created .safeguards.yml from "${template}" template`));
  }
}

InitCommand.description = `
Run this command in your working directory for a Terraform, CloudFormation or Azure Resource Manager
project. This will generate a .safeguars.yml file in that directory which you should commit to your
VCS repo. You can use the default template, or select any one of the template from 
https://github.com/safeguards-io/templates.
`;

InitCommand.flags = {
  template: flags.string({
    char: 't',
    description: 'Select a template from https://github.com/safeguards-io/templates',
    default: 'default',
  }),
};

module.exports = InitCommand;
