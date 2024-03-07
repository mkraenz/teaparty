import { Storage } from '../storage';
import { Treasury } from '../treasury';
import { Need, Product } from '../types';
import { Workforce } from '../workforce';

export class ProductionSystem {
  upkeepCost: number = 0;
  wagesPerWorkerPerDay: number = 0;
  needs: Need[] = [];
  products: Product[] = [];
  desiredWorkers: number;
  readonly workforce: Workforce;
  private readonly storage: Storage;
  private readonly treasury: Treasury;
  /** for paying taxes/upkeep */
  private readonly cityTreasury: Treasury;

  /** @param storage Input resources will be taken from this storage and output products will be delivered to it. */
  constructor(params: {
    storage: Storage;
    workforce: Workforce;
    treasury: Treasury;
    cityTreasury: Treasury;
  }) {
    this.storage = params.storage;
    this.workforce = params.workforce;
    this.treasury = params.treasury;
    this.cityTreasury = params.cityTreasury;
    this.desiredWorkers = this.workforce.maxWorkers;
  }

  init(params: {
    products: Product[];
    needs: Need[];
    wagesPerWorkerPerDay: number;
    upkeepCost: number;
  }) {
    this.products = params.products;
    this.needs = params.needs;
    this.wagesPerWorkerPerDay = params.wagesPerWorkerPerDay;
    this.upkeepCost = params.upkeepCost;
  }

  produce() {
    const productionFactor = this.workforce.productionFactor;
    const needsTimesFactor = this.needs.map((need) => ({
      ...need,
      amount: need.amount * productionFactor,
    }));
    const producable = this.storage.hasResources(needsTimesFactor);
    if (producable) {
      this.consumeInputs(productionFactor);
      this.outputProducts(productionFactor);
      return true;
    }
    return false;
  }

  payWorkers(days: number) {
    try {
      const wages = this.workforce.workers * this.wagesPerWorkerPerDay * days;
      this.treasury.take(wages);
      this.workforce.receiveWages(wages);
    } catch (error) {
      // this.workforce.strike() // maybe some day :)
    }
  }

  payUpkeep() {
    this.treasury.take(this.upkeepCost);
    this.cityTreasury.give(this.upkeepCost);
  }

  private consumeInputs(productionFactor: number) {
    this.needs.forEach((need) => {
      this.storage.remove(need.ware, need.amount * productionFactor);
    });
  }

  private outputProducts(productionFactor: number) {
    this.products.forEach((produce) => {
      this.storage.add(produce.ware, produce.amount * productionFactor);
    });
  }

  addWorkers(count: number) {
    this.workforce.addWorkers(count);
  }

  removeWorkers(count: number) {
    this.workforce.removeWorkers(count);
  }

  hireWorkers() {
    this.workforce.hire(this.desiredWorkers - this.workforce.workers);
  }

  setDesiredWorkers(amount: number) {
    this.desiredWorkers = Math.min(amount, this.workforce.maxWorkers);
    const tooManyWorkers = this.desiredWorkers < this.workforce.workers;
    if (tooManyWorkers) this.fireWorkers();
  }

  incrementDesiredWorkers(amount: number) {
    this.setDesiredWorkers(this.desiredWorkers + amount);
  }

  decrementDesiredWorkers(amount: number) {
    this.setDesiredWorkers(this.desiredWorkers - amount);
  }

  fireWorkers() {
    this.workforce.fire(this.workforce.workers - this.desiredWorkers);
  }

  destroy() {
    this.setDesiredWorkers(0);
  }
}
