const path = require('path');
const fs = require('fs');

const getTerraform = (name) => {
  const planFilePath = path.resolve(__dirname, `./fixtures/${name}.json`);
  const rawdata = fs.readFileSync(planFilePath);
  return JSON.parse(rawdata);
};


module.exports = getTerraform;
