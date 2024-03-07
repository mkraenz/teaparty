import { Building } from './building';
import { productionBuildings } from './production-buildings.data';
import { ProductionSystem } from './production.system';

export class Brewery extends Building {
  public readonly productionSystem: ProductionSystem;

  constructor(params: { owner: string; productionSystem: ProductionSystem }) {
    super({
      owner: params.owner,
      type: productionBuildings.brewery.type,
    });
    this.productionSystem = params.productionSystem;

    this.productionSystem.init(productionBuildings.brewery);
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
