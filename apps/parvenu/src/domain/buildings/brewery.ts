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