import { Building } from './building';
import { ProductionSystem } from './production.system';

export class Brewery extends Building {
  type = 'brewery';
  public readonly productionSystem: ProductionSystem;

  /** @param storage Input resources will be taken from this storage and output products will be delivered to it. */
  constructor(params: { owner: string; productionSystem: ProductionSystem }) {
    super();
    this.productionSystem = params.productionSystem;
    this.owner = params.owner;

    this.productionSystem.init({
      upkeepCost: 200,
      products: [{ ware: 'beer', amount: 8 }],
      needs: [{ ware: 'grain', amount: 0.2 }],
      wagesPerWorkerPerDay: 10,
    });
  }

  produce() {
    this.productionSystem.produce();
  }

  payWorkers(days: number) {
    this.productionSystem.payWorkers(days);
  }

  payUpkeep() {
    this.productionSystem.payUpkeep();
  }

  addWorkers(count: number) {
    this.productionSystem.addWorkers(count);
  }

  removeWorkers(count: number) {
    this.productionSystem.removeWorkers(count);
  }

  hireWorkers() {
    this.productionSystem.hireWorkers();
  }

  setDesiredWorkers(amount: number) {
    this.productionSystem.setDesiredWorkers(amount);
  }

  incrementDesiredWorkers(amount: number) {
    this.productionSystem.incrementDesiredWorkers(amount);
  }

  decrementDesiredWorkers(amount: number) {
    this.productionSystem.decrementDesiredWorkers(amount);
  }

  fireWorkers() {
    this.productionSystem.fireWorkers();
  }

  save() {
    return {
      type: this.type,
      idNumber: this.idNumber,
      owner: this.owner,
    };
  }

  destroy() {
    this.productionSystem.destroy();
  }
}
