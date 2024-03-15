import { Storage } from './storage';
import { Point } from './types';

type Ship = {
  upkeep: number;
};

export class Convoy {
  name: string;
  position: Point;
  readonly storage: Storage;
  ships: Ship[] = []; // TODO

  get upkeep() {
    return this.ships.reduce((acc, ship) => acc + ship.upkeep, 0);
  }

  constructor(params: { name: string; position: Point; storage: Storage }) {
    this.name = params.name;
    this.position = params.position;
    this.storage = params.storage;
  }
}
