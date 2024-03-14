import { Building } from './building';
import { productionBuildings } from './production-buildings.data';
import { ProductionSystem } from './production.system';

export class Woodcutter extends Building {
  readonly productionSystem: ProductionSystem;

  constructor(params: { owner: string; productionSystem: ProductionSystem }) {
    super({
      owner: params.owner,
      type: productionBuildings.woodcutter.type,
    });
    this.productionSystem = params.productionSystem;

    this.productionSystem.init(productionBuildings.woodcutter);
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
