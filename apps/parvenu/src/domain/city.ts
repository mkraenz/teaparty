import { Building } from './buildings/building';
import { Citizens } from './citizens';
import { Storage } from './storage';
import { TradingPost } from './trading-post';
import { Treasury } from './treasury';

export class City {
  readonly citizens: Citizens;
  readonly buildings: Record<string, Building>;
  readonly storage: Storage;
  readonly treasury: Treasury;
  readonly tradingPost: TradingPost;
  readonly name: string;

  get buildingsList() {
    return Object.values(this.buildings);
  }

  constructor(params: {
    citizens: Citizens;
    buildings: Record<string, Building>;
    storage: Storage;
    treasury: Treasury;
    tradingPost: TradingPost;
    name: string;
  }) {
    this.citizens = params.citizens;
    this.buildings = params.buildings;
    this.storage = params.storage;
    this.treasury = params.treasury;
    this.tradingPost = params.tradingPost;
    this.name = params.name;
  }

  passDay(currentDay: number) {
    this.receiveMigrants(1); // TODO should be a function of the city's prosperity / wealth / citizens happiness
    this.employMigrants();
    this.produce();
    this.consumeAllResources();
    const weekPassed = currentDay % 7 === 0;
    if (weekPassed) {
      this.collectUpkeep();
    }
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

  collectUpkeep() {
    Object.values(this.buildings).forEach((building) => {
      if ('payUpkeep' in building && typeof building.payUpkeep === 'function') {
        building.payUpkeep();
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

  destroyBuilding(buildingId: string) {
    const building = this.buildings[buildingId];
    building.destroy();
    delete this.buildings[building.id];
  }

  receiveMigrants(count: number) {
    this.citizens.addMigrants(count);
  }
}
