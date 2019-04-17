const { expect, test } = require('@oclif/test');

describe('help', () => {
  test
    .stdout()
    .command(['help'])
    .it('runs help', (ctx) => {
      expect(ctx.stdout).to.contain('VERSION');
      expect(ctx.stdout).to.contain('USAGE');
      expect(ctx.stdout).to.contain('COMMANDS');
    });
});
