import { jest } from '@jest/globals';
import { Bank } from '../src/bank';
import { Calculator } from '../src/calculator';

describe('Bank', () => {
  let calculator: Calculator;
  let bank: Bank;
  let calculatorAddSpy: jest.SpiedFunction<(a: number, b: number) => number>;
  let calculatorSubtractSpy: jest.SpiedFunction<(a: number, b: number) => number>;

  beforeEach(() => {
    calculator = new Calculator();
    // Spy on calculator methods to ensure they are called correctly
    calculatorAddSpy = jest.spyOn(calculator, 'add');
    calculatorSubtractSpy = jest.spyOn(calculator, 'subtract');
    bank = new Bank(calculator);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createAccount', () => {
    it('should create a new account with a balance of 0', () => {
      const account = bank.createAccount('john.doe');
      expect(account).toEqual({ userName: 'john.doe', balance: 0 });
      expect(bank.getBalance('john.doe')).toBe(0);
    });

    it('should throw an error if account with username already exists', () => {
      bank.createAccount('jane.doe');
      expect(() => bank.createAccount('jane.doe')).toThrow('Account with username jane.doe already exists.');
    });
  });

  describe('deposit', () => {
    beforeEach(() => {
      bank.createAccount('john.doe');
    });

    it('should deposit money into an existing account', () => {
      const newBalance = bank.deposit('john.doe', 100);
      expect(newBalance).toBe(100);
      expect(bank.getBalance('john.doe')).toBe(100);
      expect(calculatorAddSpy).toHaveBeenCalledWith(0, 100);
    });

    it('should throw an error if account not found', () => {
      expect(() => bank.deposit('nonexistent.user', 50)).toThrow('Account with username nonexistent.user not found.');
    });

    it('should throw an error if deposit amount is zero or negative', () => {
      expect(() => bank.deposit('john.doe', 0)).toThrow('Deposit amount must be positive.');
      expect(() => bank.deposit('john.doe', -10)).toThrow('Deposit amount must be positive.');
    });
  });

  describe('withdraw', () => {
    beforeEach(() => {
      bank.createAccount('john.doe');
      bank.deposit('john.doe', 200);
    });

    it('should withdraw money from an existing account', () => {
      const newBalance = bank.withdraw('john.doe', 50);
      expect(newBalance).toBe(150);
      expect(bank.getBalance('john.doe')).toBe(150);
      expect(calculatorSubtractSpy).toHaveBeenCalledWith(200, 50);
    });

    it('should throw an error if account not found', () => {
      expect(() => bank.withdraw('nonexistent.user', 50)).toThrow('Account with username nonexistent.user not found.');
    });

    it('should throw an error if withdrawal amount is zero or negative', () => {
      expect(() => bank.withdraw('john.doe', 0)).toThrow('Withdrawal amount must be positive.');
      expect(() => bank.withdraw('john.doe', -10)).toThrow('Withdrawal amount must be positive.');
    });

    it('should throw an error if insufficient funds', () => {
      expect(() => bank.withdraw('john.doe', 300)).toThrow('Insufficient funds.');
    });
  });

  describe('getBalance', () => {
    beforeEach(() => {
      bank.createAccount('john.doe');
      bank.deposit('john.doe', 150);
    });

    it('should return the current balance of an account', () => {
      expect(bank.getBalance('john.doe')).toBe(150);
    });

    it('should throw an error if account not found', () => {
      expect(() => bank.getBalance('nonexistent.user')).toThrow('Account with username nonexistent.user not found.');
    });
  });

  describe('transferFunds', () => {
    beforeEach(() => {
      bank.createAccount('alice');
      bank.deposit('alice', 500);
      bank.createAccount('bob');
      bank.deposit('bob', 100);
    });

    it('should transfer funds between two existing accounts', () => {
      const { fromBalance, toBalance } = bank.transferFunds('alice', 'bob', 100);
      expect(fromBalance).toBe(400);
      expect(toBalance).toBe(200);
      expect(bank.getBalance('alice')).toBe(400);
      expect(bank.getBalance('bob')).toBe(200);
      expect(calculatorSubtractSpy).toHaveBeenCalledWith(500, 100);
      expect(calculatorAddSpy).toHaveBeenCalledWith(100, 100);
    });

    it('should throw an error if sender account not found', () => {
      expect(() => bank.transferFunds('nonexistent.sender', 'bob', 50)).toThrow('Account with username nonexistent.sender not found.');
    });

    it('should throw an error if receiver account not found', () => {
      expect(() => bank.transferFunds('alice', 'nonexistent.receiver', 50)).toThrow('Account with username nonexistent.receiver not found.');
    });

    it('should throw an error if transfer amount is zero or negative', () => {
      expect(() => bank.transferFunds('alice', 'bob', 0)).toThrow('Transfer amount must be positive.');
      expect(() => bank.transferFunds('alice', 'bob', -10)).toThrow('Transfer amount must be positive.');
    });

    it('should throw an error if insufficient funds for transfer', () => {
      expect(() => bank.transferFunds('alice', 'bob', 600)).toThrow('Insufficient funds for transfer.');
    });
  });

  describe('syncRecords', () => {
    const mockData = { data: [{ id: 1, name: 'Test User' }] };

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should fetch and return data from the API', async () => {
      const data = await bank.syncRecords();
      expect(data).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('https://fakerapi.it/api/v2/users?_quantity=1');
    });

    it('should throw an error if the fetch call fails', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(bank.syncRecords()).rejects.toThrow('HTTP error! status: 404');
    });

    it('should throw an error if there is a network error', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      await expect(bank.syncRecords()).rejects.toThrow('Network error');
    });
  });
});
