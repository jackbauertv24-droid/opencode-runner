/**
 * Test suite for opencode-runner
 */

const { main } = require('../src/index');

describe('Main Module', () => {
  test('main function should be defined', () => {
    expect(main).toBeDefined();
  });
});
