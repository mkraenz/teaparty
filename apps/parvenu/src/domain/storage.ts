import { Need } from './types';

const initialWares: Record<string, number> = {
  beer: 60,
  fabric: 60,
  furs: 60,
  grain: 60,
  wine: 60,
  wood: 60,
};

export class Storage {
  owner: string = '';
  /** IMPORTANT: The amount of wares can be floating point numbers. But whenever we show it to the user, we typically display integers for simplicity. */
  wares = { ...initialWares };

  get waresList() {
    return Object.entries(this.wares).map(([ware, amount]) => ({
      type: ware,
      amount,
    }));
  }

  getStock(ware: string) {
    return this.wares[ware];
  }

  empty() {
    Object.keys(this.wares).forEach((ware) => {
      this.wares[ware] = 0;
    });
  }

  add(ware: string, amount: number) {
    this.wares[ware] += amount;
    this.wares[ware] = Math.max(this.wares[ware], 0);
  }

  remove(ware: string, amount: number) {
    this.wares[ware] -= amount;
    this.wares[ware] = Math.max(this.wares[ware], 0);
  }

  hasResources(needs: Need[]) {
    return needs.every((need) => this.wares[need.ware] >= need.amount);
  }

  log() {
    console.log(this.wares);
  }

  consume(needs: { ware: string; amount: number }[]) {
    needs.forEach((need) => this.remove(need.ware, need.amount));
  }
}
