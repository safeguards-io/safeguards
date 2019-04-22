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

    describe('required-ec2-tags', () => {
      before(() => {
        this.safeguard = require('../../src/policies/terraform/aws/required-ec2-tags');
      });
      it('should fail if tag is missing', () => {
        const settings = { tags: ['foo'] };
        expect(() => this.safeguard(this.terraformState, settings)).to.throw('missing one or more of the required tags');
      });

      it('should pass if tag is present', () => {
        const settings = { tags: ['Name'] };
        expect(this.safeguard(this.terraformState, settings)).to.be.true;
      });
    });

    describe('allowed-ec2-instance-types', () => {
      before(() => {
        this.safeguard = require('../../src/policies/terraform/aws/allowed-ec2-instance-types');
      });
      it('should fail if tag is missing', () => {
        const settings = { allowed: ['a1.large'] };
        expect(() => this.safeguard(this.terraformState, settings)).to.throw('instance type which is not allowed');
      });

      it('should pass if tag is present', () => {
        const settings = { allowed: ['t2.micro'] };
        expect(this.safeguard(this.terraformState, settings)).to.be.true;
      });
    });

    describe('allowed-ec2-availability-zones', () => {
      before(() => {
        this.safeguard = require('../../src/policies/terraform/aws/allowed-ec2-availability-zones');
      });

      it('should pass if in AZ', () => {
        const settings = { allowed: ['us-west-2a', 'us-west-2b'] };
        expect(this.safeguard(this.terraformState, settings)).to.be.true;
      });

      it('should fail if not in AZ', () => {
        const settings = { allowed: ['us-west-2c'] };
        expect(() => this.safeguard(this.terraformState, settings)).to.throw('availability zone which is not allowed');
      });
    });
  });
});
