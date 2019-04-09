const {Command, flags} = require('@oclif/command')
const {loadConfig} = require('../lib/config')

class CheckCommand extends Command {
  async run() {
    const {flags} = this.parse(CheckCommand)
    const configFile = flags.config
    let config

    try {
      config = loadConfig(configFile)
    } catch(ex) {
      this.error(ex.message)
    }

    this.log(config)
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
    default: './safeguards.yml'
  })
}

module.exports = CheckCommand
