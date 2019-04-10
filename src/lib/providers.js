const loadProvider = (source) => {
  return require(`../providers/${source}`)
}

const loadData = (workingDir, providerSettings) => {
  let data = {}

  for(const providerKey in providerSettings) {
    let settings = providerSettings[providerKey]
    let source = settings.source
    
    delete settings.source

    let provider = loadProvider(source)
    data[providerKey] = provider(workingDir, settings)
  }

  return data
}

module.exports = {
  loadData
}