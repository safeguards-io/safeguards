const fs = require('fs');

const DEFAULT_TEMPLATE = `- name: Terraform Version must be 0.12.0 beta or higher
  safeguard: terraform/version
  settings: "^0.12.0-beta"
`;

const init = async (path) => {
  try {
    fs.writeFileSync(path, DEFAULT_TEMPLATE);
  } catch (ex) {
    throw new Error('Error creating the safeguards.yml file for unexpected reasons.');
  }
};

module.exports = { init };
