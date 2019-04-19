const { expect } = require('chai');
const path = require('path');
const provider = require('../../src/providers/default/terraform');

describe('providers', () => {
  describe('terraform', () => {
    it('can load a plan file', () => {
      const planFilePath = path.resolve(__dirname, '../policies/fixtures/terraform-aws-ec2.json');
      const settings = { plan: planFilePath };
      const plan = provider(__dirname, settings);

      expect(plan).to.be.an('object');
    });
  });
});
