// jest.global-teardown.ts

module.exports = async () => {
  console.log('Global Teardown: This runs once after all test suites.');
  // e.g., stop a test server, disconnect from a database
};