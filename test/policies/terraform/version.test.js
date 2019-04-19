const { expect } = require('chai');
const fixture = require('./fixture');
const safeguard = require('../../../src/policies/terraform/version');

describe('terraform', () => {
  before(() => {
    this.terraformState = fixture('aws-ec2');
  });

  describe('version', () => {
    it('should pass if range requirement is met', () => {
      const settings = { range: '^0.12.0-beta1' };
      expect(safeguard(this.terraformState, settings)).to.be.true;
    });

    it('should fail if range requirement is not met', () => {
      const settings = { range: '>=0.13.0' };
      expect(() => safeguard(this.terraformState, settings)).to.throw();
    });
  });
});
