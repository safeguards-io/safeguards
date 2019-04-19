const { expect } = require('chai');
const fixture = require('./fixture');
const safeguard = require('../../../src/policies/terraform/aws/required-tags');

describe('terraform', () => {
  before(() => {
    this.terraformState = fixture('aws-ec2');
  });

  describe('aws', () => {
    describe('required-tags', () => {
      it('should fail if tag is missing', () => {
        const settings = { tags: ['foo'] };
        expect(() => safeguard(this.terraformState, settings)).to.throw();
      });

      it('should pass if tag is present', () => {
        const settings = { tags: ['Name'] };
        expect(safeguard(this.terraformState, settings)).to.be.true;
      });
    });
  });
});
