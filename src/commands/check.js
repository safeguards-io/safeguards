const {Command, flags} = require('@oclif/command')
const {loadConfig} = require('../lib/config')
const {loadData} = require('../lib/providers')
const {loadPolicyPlan, checkPolicies} = require('../lib/policy')
const path = require('path');

class CheckCommand extends Command {
  async run() {
    const {flags} = this.parse(CheckCommand)
    const configFile = path.resolve(process.cwd(), flags.config)
    const workingDir = path.dirname(configFile)

    // try {
      let config = loadConfig(configFile)
      let data = loadData(workingDir, config.providers)
      let policies = loadPolicyPlan(config.policies, data)
      let results = checkPolicies(policies)
      // console.log(policies)
    // } catch(ex) {
    //   this.error(ex.message)
    // }
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
