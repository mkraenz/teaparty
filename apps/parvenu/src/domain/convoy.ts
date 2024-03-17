import { v4 } from 'uuid';
import { Vec2 } from './mymath';
import { Storage } from './storage';
import { Point } from './types';

type Ship = {
  upkeep: number;
  maxSpeed: number;
};

export class Convoy {
  id: string;
  label: string;
  pos: Point;
  readonly storage: Storage;
  ships: Ship[] = []; // TODO

  get upkeep() {
    return this.ships.reduce((acc, ship) => acc + ship.upkeep, 0);
  }

  /** 1 knot = 1,852 km per hour = 1 nautical mile per hour
   * @see http://www.shiptraffic.net/2001/05/sea-distances-calculator.html
   * cf. one-mast Cog (ger: Kogge) with good wind: 5 to 8 knots
   */
  get speedInKnots() {
    // TIL: Math.max() returns -Infinity for an empty array
    const speed = Math.max(...this.ships.map((s) => s.maxSpeed));
    return 5;
  }

  constructor(params: {
    id?: string;
    label: string;
    pos: Point;
    storage: Storage;
  }) {
    this.id = params.id ?? v4(); // Note: since we want to be independent of the environment (js vs node), we're not using window.crypto here.
    this.label = params.label;
    this.pos = params.pos;
    this.storage = params.storage;
  }

  passTime(delta: number) {
    // per 1000 delta, move 100 units of length
    const target2 = { x: 115, y: 700 };
    const target = Vec2.fromPoint(target2);
    const pos = Vec2.fromPoint(this.pos);
    const dir = Vec2.fromPoint(target.sub(pos)).normalize();
    const diff = dir.mult((this.speedInKnots * delta) / 1000);
    const veryCloseToTarget = pos.aboutEquals(target, 1);

    if (veryCloseToTarget) {
      this.pos = target2;
      return;
    }

    const resultingPos = pos.add(diff);
    this.pos = resultingPos;
  }
}
