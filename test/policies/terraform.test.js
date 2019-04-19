const { expect } = require('chai');
const path = require('path');
const fs = require('fs');


describe('policies', () => {
  describe('terraform', () => {
    before(() => {
      const planFilePath = path.resolve(__dirname, './fixtures/terraform-aws-ec2.json');
      const rawdata = fs.readFileSync(planFilePath);
      this.terraformState = JSON.parse(rawdata);
    });

    describe('version', () => {
      before(() => {
        this.safeguard = require('../../src/policies/terraform/version');
      });

      it('should pass if range requirement is met', () => {
        const settings = { range: '^0.12.0-beta1' };
        expect(this.safeguard(this.terraformState, settings)).to.be.true;
      });

      it('should fail if range requirement is not met', () => {
        const settings = { range: '>=0.13.0' };
        expect(() => this.safeguard(this.terraformState, settings)).to.throw();
      });
    });

    describe('required-tags', () => {
      before(() => {
        this.safeguard = require('../../src/policies/terraform/aws/required-tags');
      });
      it('should fail if tag is missing', () => {
        const settings = { tags: ['foo'] };
        expect(() => this.safeguard(this.terraformState, settings)).to.throw();
      });

      it('should pass if tag is present', () => {
        const settings = { tags: ['Name'] };
        expect(this.safeguard(this.terraformState, settings)).to.be.true;
      });
    });
  });
});
