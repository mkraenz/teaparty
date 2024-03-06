import { Building } from './buildings/building';
import { Citizens } from './citizens';
import { Storage } from './storage';
import { Treasury } from './treasury';

export class City {
  public readonly citizens: Citizens;
  public readonly buildings: Record<string, Building>;
  public readonly storage: Storage;
  public readonly treasury: Treasury;

  get buildingsList() {
    return Object.values(this.buildings);
  }

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

  passDay() {
    this.receiveMigrants(1); // TODO should be a function of the city's prosperity / wealth / citizens happiness
    this.employMigrants();
    this.produce();
    this.consumeAllResources();
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

  employMigrants() {
    this.buildingsList.forEach((building) => {
      if (
        'hireWorkers' in building &&
        typeof building.hireWorkers === 'function'
      ) {
        building.hireWorkers();
      }
    });
  }

  build(building: Building) {
    this.buildings[building.id] = building;
  }

  receiveMigrants(count: number) {
    this.citizens.addMigrants(count);
  }
}
