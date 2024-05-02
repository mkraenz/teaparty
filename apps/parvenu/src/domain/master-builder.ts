import { assert } from '../utils/utils';
import { Brewery } from './buildings/brewery';
import { buildingData } from './buildings/building.data';
import { CountingHouse } from './buildings/counting-house';
import { GrainFarm } from './buildings/grain-farm';
import { ProductionSystem } from './buildings/production.system';
import { WithProductionSystem } from './buildings/with-production-system.mixin';
import { Woodcutter } from './buildings/woodcutter';
import { City } from './city';
import { Storage } from './storage';
import { Treasury } from './treasury';
import { IBuilding, Need } from './types';
import { Workforce } from './workforce';

const subtractNeedsOrZero = (baseNeeds: Need[], subtractedNeeds: Need[]) => {
  // WARNING: assumes that both arrays are in the same order
  return baseNeeds.map((need, index) => {
    assert(need.ware === subtractedNeeds[index].ware, 'Ware mismatch');
    return {
      ...need,
      amount: Math.max(need.amount - subtractedNeeds[index].amount, 0),
    };
  });
};

const buildingTypeToClass = {
  brewery: Brewery,
  grainFarm: GrainFarm,
  woodcutter: Woodcutter,
};

export class MasterBuilder {
  private readonly city: City;
  private merchant: {
    treasury: Treasury;
    name: string;
  };

  constructor(params: {
    city: City;
    merchant: { treasury: Treasury; name: string };
  }) {
    this.city = params.city;
    this.merchant = params.merchant;
  }

  build(buildingType: string) {
    const data = buildingData[buildingType];
    if (this._canBuild(data)) {
      this.merchant.treasury.credit(data.constructionCosts.money);
      // construction costs get handed to the citizens, so not debiting the city treasury
      this.takeResources(data.constructionCosts.needs);
      const building = this.makeBuilding(data);
      this.city.build(building);
    }
  }

  private takeResources(needs: Need[]) {
    const convoys = this.city.port.convoys;
    const playerOwned = Object.values(convoys).filter(
      (convoy) => convoy.owner === this.merchant.name
    );
    const countingHouse = this.city.getCountingHouse(this.merchant.name);

    const resourcesInCountingHouse =
      countingHouse?.storage.getAsAvailable(needs);
    if (resourcesInCountingHouse)
      countingHouse?.storage.consume(resourcesInCountingHouse);
    let remainingNeeds = resourcesInCountingHouse
      ? subtractNeedsOrZero(needs, resourcesInCountingHouse)
      : needs;
    for (const convoy of playerOwned) {
      const resourcesInConvoy = convoy.storage.getAsAvailable(remainingNeeds);
      convoy.storage.consume(resourcesInConvoy);
      remainingNeeds = subtractNeedsOrZero(remainingNeeds, resourcesInConvoy);
    }
  }

  canBuild(buildingType: string) {
    const data = buildingData[buildingType];
    return this._canBuild(data);
  }

  private _canBuild(data: IBuilding) {
    if (!this.merchant.treasury.hasEnough(data.constructionCosts.money))
      return false;

    const buildingAlreadyExists = this.city.buildingsList.some(
      (building) =>
        building.type === data.type && building.ownedBy(this.merchant.name)
    );
    if (data.unique === 'per-city-per-merchant' && buildingAlreadyExists)
      return false;

    // TODO handle unique === 'per-city'

    const convoys = this.city.port.convoys;
    const playerOwnedConvoys = Object.values(convoys).filter(
      (convoy) => convoy.owner === this.merchant.name
    );
    const needs = data.constructionCosts.needs;
    const countingHouse = this.city.buildingsList.filter(
      (building) =>
        building.type === 'countingHouse' &&
        building.owner === this.merchant.name
    )[0] as CountingHouse | undefined;

    const resourcesInCountingHouse =
      countingHouse?.storage.getAsAvailable(needs);
    let remainingNeeds = resourcesInCountingHouse
      ? subtractNeedsOrZero(needs, resourcesInCountingHouse)
      : needs;
    for (const convoy of playerOwnedConvoys) {
      const resourcesInConvoy = convoy.storage.getAsAvailable(remainingNeeds);
      remainingNeeds = subtractNeedsOrZero(remainingNeeds, resourcesInConvoy);
    }
    const allResourceNeedsFulfilled = remainingNeeds.every(
      (need) => need.amount === 0
    );
    return allResourceNeedsFulfilled;
  }

  private makeBuilding(data: IBuilding) {
    const type = data.type;
    if (data.category === 'production' && type in buildingTypeToClass) {
      const countingHouse = this.city.getCountingHouse(this.merchant.name);
      if (!countingHouse)
        throw new Error(
          'No counting house found. You need a counting house to build production buildings. There must be a bug that allows to bypass this restriction.'
        );
      const productionSystem = new ProductionSystem({
        cityTreasury: this.city.treasury,
        storage: countingHouse.storage,
        treasury: this.merchant.treasury,
        workforce: new Workforce({
          citizens: this.city.citizens,
          maxWorkers: 100,
          workers: 0,
        }),
      });
      const ProductionBuilding =
        buildingTypeToClass[type as keyof typeof buildingTypeToClass];
      const ActualBuilding = WithProductionSystem(ProductionBuilding);
      const building = new ActualBuilding({
        owner: 'player',
        productionSystem,
      });
      return building;
    }

    if (data.type === 'countingHouse') {
      return new CountingHouse({
        owner: this.merchant.name,
        treasury: this.merchant.treasury,
        storage: new Storage(this.merchant.name),
      });
    }

    throw new Error(`Building type not implemented. Found ${type}`);
  }
}
