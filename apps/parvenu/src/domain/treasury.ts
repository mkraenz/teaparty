export class InsufficientFundsError extends Error {
  constructor() {
    super('InsufficientFundsError');
  }
}

export class Treasury {
  private balance = 0;

  take(amount: number) {
    if (this.balance < amount) throw new InsufficientFundsError();

    this.balance -= amount;
  }

  give(amount: number) {
    this.balance += amount;
  }
}
