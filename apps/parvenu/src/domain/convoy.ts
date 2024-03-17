import { v4 } from 'uuid';
import { Vec2 } from './mymath';
import { Storage } from './storage';
import { Point } from './types';

type Ship = {
  upkeep: number;
  maxSpeed: number;
};

export class InvalidConvoyError extends Error {
  constructor(message: string, convoy: { id: string; label: string }) {
    super(`convoy id ${convoy.id}, label ${convoy.label}: ${message}`);
    this.name = 'InvalidConvoyError';
  }
}

export class Convoy {
  id: string;
  label: string;
  pos: Point;
  readonly storage: Storage;
  ships: Ship[];

  target: Point | null = null;

  get upkeep() {
    return this.ships.reduce((acc, ship) => acc + ship.upkeep, 0);
  }

  /** 1 knot = 1,852 km per hour = 1 nautical mile per hour
   * @see http://www.shiptraffic.net/2001/05/sea-distances-calculator.html
   * cf. one-mast Cog (ger: Kogge) with good wind: 5 to 8 knots
   */
  get speedInKnots() {
    return Math.max(...this.ships.map((s) => s.maxSpeed));
  }

  constructor(params: {
    id?: string;
    label: string;
    pos: Point;
    storage: Storage;
    ships: Ship[];
  }) {
    this.id = params.id ?? v4(); // Note: since we want to be independent of the environment (js vs node), we're not using window.crypto here.
    this.label = params.label;
    this.pos = params.pos;
    this.storage = params.storage;
    this.ships = params.ships;
    if (params.ships.length === 0) {
      throw new InvalidConvoyError('Convoy must have at least one ship', this);
    }
  }

  passTime(delta: number) {
    this.move(delta);
  }

  setTarget(target: Point | null = { x: 115, y: 700 }) {
    this.target = target;
  }

  move(delta: number) {
    if (this.target) {
      // TODO consider moving moving to target into a component
      const target = Vec2.fromPoint(this.target);
      const pos = Vec2.fromPoint(this.pos);
      const dir = Vec2.fromPoint(target.sub(pos)).normalize();
      const diff = dir.mult((this.speedInKnots * delta) / 100);
      const veryCloseToTarget = pos.aboutEquals(target, 2);

      if (veryCloseToTarget) {
        this.pos = target;
        this.target = null;
        return;
      }

      const resultingPos = pos.add(diff);
      this.pos = resultingPos;
    }
  }
}
