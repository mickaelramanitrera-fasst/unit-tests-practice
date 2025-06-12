import { sum } from '../src/sum';

describe('sum', () => {
  it('should correctly add two positive numbers', () => {
    const result = sum(1, 2);
    expect(result).toBe(3);
  });

  it('should correctly add zero to zero', () => {
    const result = sum(0, 0);
    expect(result).toBe(0);
  });

  it('should correctly add two negative numbers', () => {
    const result = sum(-1, -1);
    expect(result).toBe(-2);
  });

  it('should correctly add a positive and a negative number', () => {
    const result = sum(5, -3);
    expect(result).toBe(2);
  });
});
