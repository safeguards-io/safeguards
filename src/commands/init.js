const fs = require('fs')
const request = require('request-promise')
const {Command, flags} = require('@oclif/command')

class InitCommand extends Command {
  async run() {
    const {flags} = this.parse(InitCommand)
    const template = flags.template
    const downloadUrl = `https://github.com/safeguards-io/templates/raw/master/${template}.safeguards.yml`

    let content
    try {
      content = await request(downloadUrl)
    } catch(ex) {
      this.error(`Couldn't find or download template '${template}'`)
    }

    try {
      fs.writeFileSync(".safeguards.yml", content)
    } catch(ex) {
      this.error("Successfully downloaded, but failed to write .safeguards.yml file")
    }
  }
}

InitCommand.description = `Describe the command here
...
Extra documentation goes here
`

InitCommand.flags = {
  template: flags.string({
    char: 't',
    description: '',
    default: 'default'
  })
}

module.exports = InitCommand
