// jest.global-setup.ts

module.exports = async () => {
  console.log('Global Setup: This runs once before all test suites.');
  // e.g., start a test server, connect to a database
};