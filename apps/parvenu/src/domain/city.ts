import { Building } from './buildings/building';
import { Citizens } from './citizens';
import { Storage } from './storage';
import { Treasury } from './treasury';

export class City {
  private citizens: Citizens;
  private buildings: Record<string, Building>;
  private readonly storage: Storage;
  private readonly treasury: Treasury;

  constructor(params: {
    citizens: Citizens;
    buildings: Record<string, Building>;
    storage: Storage;
    treasury: Treasury;
  }) {
    this.citizens = params.citizens;
    this.buildings = params.buildings;
    this.storage = params.storage;
    this.treasury = params.treasury;
  }

  consumeResource(ware: string) {
    this.citizens.consumeResource(ware);
  }

  consumeAllResources() {
    this.citizens.consumeResources();
  }

  produce() {
    Object.values(this.buildings).forEach((building) => {
      if ('produce' in building && typeof building.produce === 'function') {
        building.produce();
      }
    });
  }
}
