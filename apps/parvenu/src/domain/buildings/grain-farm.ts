import { Building } from './building';
import { productionBuildings } from './production-buildings.data';
import { ProductionSystem } from './production.system';

export class GrainFarm extends Building {
  readonly productionSystem: ProductionSystem;

  constructor(params: { owner: string; productionSystem: ProductionSystem }) {
    super({
      owner: params.owner,
      type: productionBuildings.grainFarm.type,
    });
    this.productionSystem = params.productionSystem;

    this.productionSystem.init(productionBuildings.grainFarm);
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

export interface PGrainFarm extends GrainFarm, ProductionSystem {}
