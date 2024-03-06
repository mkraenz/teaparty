export class InsufficientFundsError extends Error {
  constructor() {
    super('InsufficientFundsError');
  }
}

export class Treasury {
  private _balance = 0;

  get balance() {
    return this._balance;
  }

  take(amount: number) {
    if (this._balance < amount) throw new InsufficientFundsError();

    this._balance -= amount;
  }

  give(amount: number) {
    this._balance += amount;
  }
}
