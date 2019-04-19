const { expect } = require('chai');
const versionPolicy = require('../../../src/policies/terraform/version');

describe('terraform', () => {
  describe('version', () => {
    it('should pass if range requirement is met', () => {
      const terraformState = { terraform_version: '0.12.0-beta1' };
      const settings = { range: '^0.12.0-beta1' };
      expect(versionPolicy(terraformState, settings)).to.be.true;
    });

    it('should fail if range requirement is not met', () => {
      const terraformState = { terraform_version: '0.12.0' };
      const settings = { range: '>=0.13.0' };
      expect(() => versionPolicy(terraformState, settings)).to.throw();
    });
  });
});
