import { Need } from './types';

const initialWares: Record<string, number> = {
  beer: 12,
  grain: 0,
  fabric: 15,
  furs: 3,
  wine: 5,
};

export class Storage {
  /** IMPORTANT: The amount of wares can be floating point numbers. But whenever we show it to the user, we typically display integers for simplicity. */
  wares = { ...initialWares };

  get waresList() {
    return Object.entries(this.wares).map(([ware, amount]) => ({
      type: ware,
      amount,
    }));
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
}
