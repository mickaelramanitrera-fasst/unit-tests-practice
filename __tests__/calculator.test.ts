import { Calculator } from '../src/calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it.each([
      [1, 2, 3],
      [0, 0, 0],
      [-1, -1, -2],
      [5, -3, 2],
    ])('should correctly add %d and %d to get %d', (a, b, expected) => {
      const result = calculator.add(a, b);
      expect(result).toBe(expected);
    });
  });

  describe('subtract', () => {
    it.each([
      [5, 2, 3],
      [5, 0, 5],
      [2, 5, -3],
      [-5, -2, -3],
    ])('should correctly subtract %d from %d to get %d', (a, b, expected) => {
      const result = calculator.subtract(a, b);
      expect(result).toBe(expected);
    });
  });

  describe('multiply', () => {
    it.each([
      [2, 3, 6],
      [5, 0, 0],
      [5, -2, -10],
      [-2, -3, 6],
    ])('should correctly multiply %d by %d to get %d', (a, b, expected) => {
      const result = calculator.multiply(a, b);
      expect(result).toBe(expected);
    });
  });

  describe('divide', () => {
    it.each([
      [6, 3, 2],
      [10, -2, -5],
      [7, 2, 3.5],
    ])('should correctly divide %d by %d to get %d', (a, b, expected) => {
      const result = calculator.divide(a, b);
      expect(result).toBe(expected);
    });

    it('should throw an error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });
});
