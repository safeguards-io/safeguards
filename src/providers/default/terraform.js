const path = require('path');
const fs = require('fs')

module.exports = (workingDir, settings) => {
  let planFilePath = path.resolve(workingDir, settings.plan)
  let rawdata = fs.readFileSync(planFilePath);  
  let plan = JSON.parse(rawdata);

  return plan
}