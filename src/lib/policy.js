const color = require('chalk');

const stateColor = {
  pass: color.green,
  fail: color.red,
  warn: color.yellow,
};

/* eslint no-console: ["error", { allow: ["log"] }] */
const policyDetails = (result, i) => {
  console.log(`\n${i + 1}) ${result.policy.name}`);
  if (result.message) {
    console.log(`${result.message ? `   ${stateColor[result.state](result.message)}` : ''}`);
  }
  console.log(`   ${color.grey(`safeguard: ${result.policy.safeguard.id}`)}`);
};

const loadPolicyPlan = (config, data) => config.map((policySource) => {
  let policyModule;

  try {
    /* eslint-disable import/no-dynamic-require, global-require */
    policyModule = require(`../safeguards/${policySource.safeguard}`);
  } catch (ex) {
    throw new Error(`Could not find safeguard ${policySource.safeguard}`);
  }

  const policy = {
    name: policySource.name,
    settings: policySource.settings,
    enforcement: policySource.enforcement || 'warning',
    provisioner: policyModule.provisioner,
    data: data[policyModule.provisioner],
    safeguard: {
      id: policySource.safeguard,
      function: policyModule.check,
    },
  };

  return policy;
});

/* eslint no-console: ["error", { allow: ["log"] }] */
const checkPolicies = (policies) => {
  const results = [];

  console.log(`${color.bold('RESULTS')}---------------------\n`);

  policies.forEach((policy) => {
    const result = { policy };
    try {
      if (policy.safeguard.function(policy.data, policy.settings) === true) {
        result.state = 'pass';
      } else {
        result.state = 'fail';
        result.message = 'Safeguard did not respond with pass status. Contact safeguard developer.';
      }
    } catch (ex) {
      result.state = policy.enforcement === 'error' ? 'fail' : 'warn';
      result.message = ex.message;
    }
    results.push(result);

    console.log(`  ${stateColor[result.state]('passed')}: ${policy.name}`);
  });

  const failedResults = results.filter(x => x.state === 'fail');
  const warnedResults = results.filter(x => x.state === 'warn');

  const totalCount = results.length;
  const failedCount = failedResults.length;
  const warnedCount = warnedResults.length;
  const passedCount = totalCount - failedCount - warnedCount;

  if (warnedCount > 0) {
    console.log(`\n${color.bold('WARNINGS')}--------------------`);
    warnedResults.forEach((result, i) => policyDetails(result, i));
  }

  if (failedCount > 0) {
    console.log(`\n${color.bold('ERRORS')}----------------------`);
    failedResults.forEach((result, i) => policyDetails(result, i));
  }

  console.log(`\n${color.bold('SUMMARY')}: ${totalCount} policies checked, ${color.red(`${failedCount} failures`)}, ${color.yellow(`${warnedCount} warnings`)}, ${color.green(`${passedCount} passed`)}`);

  return results;
};

module.exports = {
  loadPolicyPlan,
  checkPolicies,
};
