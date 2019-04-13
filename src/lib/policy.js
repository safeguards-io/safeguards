const color = require('chalk');

const stateColor = {
  pass: color.green,
  fail: color.red,
  warn: color.yellow
}

const policyDetails = (result, i) => {
  console.log(`\n${i+1}) ${result.policy.description}`)
  if(result.message) {
    console.log(`${result.message ? `   ${stateColor[result.state](result.message)}`: ""}`)
  }
  console.log(`   ${color.grey(`id: ${result.policy.id}`)}`)
  console.log(`   ${color.grey(`safeguard: ${result.policy.safeguard.id}`)}`) 
}

const loadPolicyPlan = (config, data) => {
  const policyConfig = config.policies
  return Array.from(Object.keys(policyConfig), x =>{
    let policySource = policyConfig[x]
    let policyFunction
    
    try {
      policyFunction = require(`../policies/${policySource.safeguard}`)
    } catch(ex) {
      throw new Error(`Could not find safeguard ${policySource.safeguard}`)
    }

    let providerId = policySource.provider || config.providers[0].as || config.providers[0].source

    let policy = {
      id: x,
      description: policySource.description || x,
      settings: policySource.settings,
      enforcement: policySource.enforcement || 'warning',
      provider: providerId,
      data: data[providerId],
      safeguard: {
        id: policySource.safeguard,
        function: policyFunction
      }
    }

    return policy
  })
}

const checkPolicies = (policies) => {
  let results = []

  console.log(`${color.bold("RESULTS")}---------------------\n`)

  for(const policy of policies) {
    let result = {policy}
    try{
      if(policy.safeguard.function(policy.data, policy.settings) === true) {
        result.state = 'pass'
      } else {
        result.state = 'fail'
        result.message = 'Safeguard did not respond with pass status. Contact safeguard developer.'
      }
    } catch (ex) {
      result.state = policy.enforcement == "error" ? "fail" : "warn"
      result.message = ex.message
    }
    results.push(result)
    
    console.log(`  ${stateColor[result.state]('passed')}: ${policy.description}`)
  }

  const failedResults = results.filter(x=>x.state=="fail")
  const warnedResults = results.filter(x=>x.state=="warn")

  const totalCount = results.length
  const failedCount = failedResults.length
  const warnedCount = warnedResults.length
  const passedCount = totalCount - failedCount - warnedCount

  if(warnedCount > 0) {
    console.log(`\n${color.bold("WARNINGS")}--------------------`)
    warnedResults.forEach((result, i) => policyDetails(result, i))
  }

  if(failedCount > 0) {
    console.log(`\n${color.bold("ERRORS")}----------------------`)
    failedResults.forEach((result, i) => policyDetails(result, i))
  }

  console.log(`\n${color.bold('SUMMARY')}: ${totalCount} policies checked, ${color.red(`${failedCount} failures`)}, ${color.yellow(`${warnedCount} warnings`)}, ${color.green(`${passedCount} passed`)}`)

  return results
}

module.exports = {
  loadPolicyPlan,
  checkPolicies
}