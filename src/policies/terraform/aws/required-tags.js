module.exports = (data, settings) => {
  if(!settings || !settings.tags || typeof settings.tags != 'array' || settings.tags.length == 0) {
    throw new Error("This policy requires the 'tags' setting to be set")
  }
  const requiredTags = settings.tags || []
  const awsInstances = data.planned_values.root_module.resources.filter(x=>x.type=="aws_instance")

  for(const awsInstance of awsInstances) {
    let tagKeys = Object.keys(awsInstance.values.tags)
    let allKeysFound = requiredTags.every(requiredTag => tagKeys.includes(requiredTag))
    if(!allKeysFound){
      throw new Error(`${awsInstance.address} is missing one or more of the required tags, ${requiredTags.join(', ')}`)
    }
  }

  return true
}