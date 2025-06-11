// jest.setup.ts

let consoleLogSpy: jest.SpyInstance;
let consoleErrorSpy: jest.SpyInstance;

beforeAll(() => {
  console.log('setup beforeAll: Initializing test environment...');
});

afterAll(() => {
  console.log('setup afterAll: Cleaning up test environment...');
});

beforeEach(() => {
  console.log('setup beforeEach: Preparing for a test...');
});

afterEach(() => {
  console.log('setup afterEach: Cleaning up after a test...');
});