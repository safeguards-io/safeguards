const color = require('chalk');


const stateLog = {
  pass: color.green("passed"),
  fail: color.red("failed"),
  warn: color.yellow("warned")
}

const loadPolicyPlan = (policyConfig, data) => {
  return Array.from(Object.keys(policyConfig), x =>{
    let policySource = policyConfig[x]
    let policyFunction
    
    try {
      policyFunction = require(`../policies/${policySource.safeguard}`)
    } catch(ex) {
      throw new Error(`Could not find safeguard ${policySource.safeguard}`)
    }

    let policy = {
      id: x,
      settings: policySource.settings,
      enforcement: policySource.enforcement,
      provider: {
        id: policySource.provider,
      },
      data: data[policySource.provider],
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
      }
    } catch (ex) {
      result.state = policy.enforcement == "error" ? "fail" : "warn"
      result.message = ex.message
    }
    results.push(result)
    
    console.log(`  ${stateLog[result.state]}: ${policy.id}`)
  }

  const failedResults = results.filter(x=>x.state=="fail")
  const warnedResults = results.filter(x=>x.state=="warn")

  const totalCount = results.length
  const failedCount = failedResults.length
  const warnedCount = warnedResults.length
  const passedCount = totalCount - failedCount - warnedCount

  if(warnedCount > 0) {
    console.log(`\n${color.bold("WARNINGS")}--------------------`)

    warnedResults.forEach((result, i) => {
      if(!result.pass){
        console.log(`\n${i+1}) ${result.policy.id} ${result.message ? `\n   ${color.yellow(result.message)}`: ""}`)
      }
    })
  }

  if(failedCount > 0) {
    console.log(`\n${color.bold("ERRORS")}----------------------`)

    failedResults.forEach((result, i) => {
      if(!result.pass){
        console.log(`\n${i+1}) ${result.policy.id} ${result.message ? `\n   ${color.red(result.message)}`: ""}`)
      }
    })
  }

  console.log(`\n${color.bold('SUMMARY')}: ${totalCount} policies checked, ${color.red(`${failedCount} failures`)}, ${color.yellow(`${warnedCount} warnings`)}, ${color.green(`${passedCount} passed`)}`)

  return results
}

module.exports = {
  loadPolicyPlan,
  checkPolicies
}