const loadProvider = (source) => {
  return require(`../providers/${source}`)
}

const loadData = (workingDir, providerSettings) => {
  let data = {}

  for(const settings of providerSettings) {

    const source = settings.source
    const id = settings.as || settings.source

    // Creates a copy of settings without `source` or `as`
    const providerSettings = {...settings}
    delete providerSettings.source
    delete providerSettings.as

    let provider = loadProvider(source)
    
    data[id] = provider(workingDir, providerSettings)
  }

  return data
}

module.exports = {
  loadData
}