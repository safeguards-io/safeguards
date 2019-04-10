const {Command, flags} = require('@oclif/command')
const {loadConfig} = require('../lib/config')
const {loadData} = require('../lib/providers')
const path = require('path');

class CheckCommand extends Command {
  async run() {
    const {flags} = this.parse(CheckCommand)
    const configFile = path.resolve(process.cwd(), flags.config)
    const workingDir = path.dirname(configFile)
    let config, data

    try {
      config = loadConfig(configFile)
      data = loadData(workingDir, config.providers)
    } catch(ex) {
      this.error(ex.message)
    }
  }
}

CheckCommand.description = `Describe the command here
...
Extra documentation goes here
`

CheckCommand.flags = {
  config: flags.string({
    char: 'c',
    description: 'Use a config file other than the default ./safeguards.yml',
    default: '.safeguards.yml'
  })
}

module.exports = CheckCommand
