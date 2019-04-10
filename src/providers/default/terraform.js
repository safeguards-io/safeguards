const path = require('path');
const fs = require('fs')

module.exports = (workingDir, settings) => {
  let stateFilePath = path.resolve(workingDir, settings.state)
  let rawdata = fs.readFileSync(stateFilePath);  
  let state = JSON.parse(rawdata);

  return state
}