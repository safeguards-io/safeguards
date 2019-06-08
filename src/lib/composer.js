const request = require('request-promise');
const fs = require('fs');

const defaultDownloadUrl = 'https://github.com/safeguards-io/templates/raw/master/default.safeguards.yml';

const init = async (path) => {
  let content;
  try {
    content = await request(defaultDownloadUrl);
  } catch (ex) {
    throw new Error(`Couldn't find or download template from '${defaultDownloadUrl}'`);
  }

  try {
    fs.writeFileSync(path, content.toString());
  } catch (ex) {
    throw new Error('Error creating the safeguards.yml file for unexpected reasons.');
  }
};

module.exports = { init };
