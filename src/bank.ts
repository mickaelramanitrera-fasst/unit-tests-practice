import { Calculator } from './calculator';

interface Account {
  userName: string;
  balance: number;
}

type Record = {
  id: string
}

export class Bank {
  private accounts: Map<string, Account>;
  private calculator: Calculator;

  constructor(calculator: Calculator) {
    this.accounts = new Map<string, Account>();
    this.calculator = calculator;
  }

  createAccount(userName: string): Account {
    if (this.accounts.has(userName)) {
      throw new Error(`Account with username ${userName} already exists.`);
    }
    const newAccount: Account = { userName, balance: 0 };
    this.accounts.set(userName, newAccount);
    return newAccount;
  }

  deposit(userName: string, amount: number): number {
    const account = this.accounts.get(userName);
    if (!account) {
      throw new Error(`Account with username ${userName} not found.`);
    }
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive.');
    }
    account.balance = this.calculator.add(account.balance, amount);
    return account.balance;
  }

  withdraw(userName: string, amount: number): number {
    const account = this.accounts.get(userName);
    if (!account) {
      throw new Error(`Account with username ${userName} not found.`);
    }
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive.');
    }
    if (this.calculator.subtract(account.balance, amount) < 0) {
      throw new Error('Insufficient funds.');
    }
    account.balance = this.calculator.subtract(account.balance, amount);
    return account.balance;
  }

  getBalance(userName: string): number {
    const account = this.accounts.get(userName);
    if (!account) {
      throw new Error(`Account with username ${userName} not found.`);
    }
    return account.balance;
  }

  transferFunds(
    fromUserName: string,
    toUserName: string,
    amount: number
  ): { fromBalance: number; toBalance: number } {
    const fromAccount = this.accounts.get(fromUserName);
    const toAccount = this.accounts.get(toUserName);

    if (!fromAccount) {
      throw new Error(`Account with username ${fromUserName} not found.`);
    }
    if (!toAccount) {
      throw new Error(`Account with username ${toUserName} not found.`);
    }
    if (amount <= 0) {
      throw new Error('Transfer amount must be positive.');
    }
    if (this.calculator.subtract(fromAccount.balance, amount) < 0) {
      throw new Error('Insufficient funds for transfer.');
    }

    fromAccount.balance = this.calculator.subtract(fromAccount.balance, amount);
    toAccount.balance = this.calculator.add(toAccount.balance, amount);

    return { fromBalance: fromAccount.balance, toBalance: toAccount.balance };
  }

  async syncRecords(): Promise<Record> {
    try {
      const response = await fetch('https://fakerapi.it/api/v2/users?_quantity=1');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Synced records:', data);
      return data;
    } catch (error) {
      console.error('Error syncing records:', error);
      throw error;
    }
  }
}
