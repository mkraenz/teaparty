import { Storage } from '../storage';
import { Treasury } from '../treasury';
import { Need, Product } from '../types';
import { Workforce } from '../workforce';
import { Building } from './building';

export class GrainFarm extends Building {
  type = 'grain-farm';
  upkeepCost = 500;
  private readonly wagePerWorkerPerDay = 10;
  private needs: Need[] = [];
  private products: Product[] = [{ ware: 'grain', amount: 16 }];
  private readonly workforce: Workforce;
  private readonly storage: Storage;
  private readonly treasury: Treasury;
  private readonly cityTreasury: Treasury;

  /** @param storage Input resources will be taken from this storage and output products will be delivered to it. */
  constructor(params: {
    storage: Storage;
    workforce: Workforce;
    owner: string;
    treasury: Treasury;
    cityTreasury: Treasury;
  }) {
    super();
    this.storage = params.storage;
    this.workforce = params.workforce;
    this.owner = params.owner;
    this.treasury = params.treasury;
    this.cityTreasury = params.cityTreasury;
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
      const wages = this.workforce.workers * this.wagePerWorkerPerDay * days;
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
    this.workforce.hire(100);
  }

  fireWorkers() {
    this.workforce.fire(100);
  }

  save() {
    return {
      type: this.type,
      idNumber: this.idNumber,
      owner: this.owner,
    };
  }
}
