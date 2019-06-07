const { expect } = require('chai');
const path = require('path');
const terraform = require('../../src/provisioners/terraform');

describe('provisioners', () => {
  describe('terraform', () => {
    it('can load a plan file', () => {
      const planFilePath = path.resolve(__dirname, '../safeguards/fixtures/terraform-aws-ec2.json');
      const settings = { 'terraform.plan': planFilePath };
      const plan = terraform.load(__dirname, settings);

      expect(plan).to.be.an('object');
    });
  });
});
