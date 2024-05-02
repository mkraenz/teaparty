import { assert } from '../../utils/utils';
import { City } from '../city';
import { Navigator } from '../components/navigator';
import { Convoy } from '../convoy';
import { Ship } from '../ship';
import { shipData } from '../ship.data';
import { Storage } from '../storage';
import { Treasury } from '../treasury';
import { IShip, Need } from '../types';
import { Building } from './building';
import { CountingHouse } from './counting-house';

type Merchant = {
  treasury: Treasury;
  name: string;
};

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

function assertMerchantDefined(
  merchant: Merchant | null
): asserts merchant is Merchant {
  if (!merchant) throw new Error('Merchant must be set on the shipyard');
}

export class Shipyard extends Building {
  private readonly city: City;
  private merchant: Merchant | null = null;

  constructor(params: { owner: string; city: City }) {
    super({ type: 'shipyard', owner: params.owner });
    this.city = params.city;
  }

  setMerchant(merchant: Merchant) {
    this.merchant = merchant;
  }

  clearMerchant() {
    this.merchant = null;
  }

  destroy() {
    // do nothing for now
  }

  buildShip(shipType: string, name: string) {
    const { merchant } = this;
    assertMerchantDefined(merchant);
    const data = shipData[shipType];
    if (this._canBuild(data)) {
      merchant.treasury.credit(data.constructionCosts.money);
      // construction costs get handed to the citizens, so not debiting the city treasury
      this.takeResources(data.constructionCosts.needs);
      const ship = this.makeShip(data);
      const convoy = this.makeConvoy(ship, name); // FUTURE: this should return a ship first, and then it can be turned into a convoy
      convoy.dock(this.city);
      // world.addConvoy(convoy); // TODO
      return convoy;
    }
  }

  makeConvoy(ship: Ship, name: string) {
    const { merchant } = this;
    assertMerchantDefined(merchant);

    const navigator = new Navigator();
    const convoy = new Convoy({
      owner: merchant.name,
      label: name,
      pos: this.city.pos,
      storage: new Storage(name),
      treasury: merchant.treasury,
      ships: [ship],
      navigator,
    });
    navigator.setAgent(convoy);
    return convoy;
  }

  makeShip(data: IShip) {
    const { merchant } = this;
    assertMerchantDefined(merchant);

    const ship = new Ship({
      ...data,
      owner: merchant.name,
    });
    return ship;
  }

  private takeResources(needs: Need[]) {
    const { merchant } = this;
    assertMerchantDefined(merchant);

    const convoys = this.city.port.convoys;
    const playerOwned = Object.values(convoys).filter(
      (convoy) => convoy.owner === merchant.name
    );
    const countingHouse = this.city.getCountingHouse(merchant.name);

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
    const data = shipData[buildingType];
    return this._canBuild(data);
  }

  private _canBuild(data: IShip) {
    const merchant = this.merchant;
    assertMerchantDefined(merchant);

    if (!merchant.treasury.hasEnough(data.constructionCosts.money))
      return false;

    const convoys = this.city.port.convoys;
    const playerOwnedConvoys = Object.values(convoys).filter(
      (convoy) => convoy.owner === merchant.name
    );
    const needs = data.constructionCosts.needs;
    const countingHouse = this.city.buildingsList.filter(
      (building) =>
        building.type === 'countingHouse' && building.owner === merchant.name
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
}

export function isShipyard(building: unknown): building is Shipyard {
  return (
    typeof building === 'object' &&
    building !== null &&
    'type' in building &&
    building.type === 'shipyard'
  );
}
