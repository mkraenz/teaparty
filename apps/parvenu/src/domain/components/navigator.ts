import { City } from '../city';
import { Vec2 } from '../mymath';
import { Point } from '../types';

type Agent = {
  pos: Point;
  speedInKnots: number;
  dock(target: { port: { dock: (convoy: any) => void } }): void;
};

export class Navigator {
  agent!: Agent;
  target: { pos: Point } | null = null;

  setAgent(agent: Agent) {
    this.agent = agent;
  }

  setTarget(target: { pos: Point } | null) {
    this.target = target;
  }

  move(delta: number) {
    const target = this.target;
    if (target) {
      // TODO consider moving moving to target into a component
      const targetPos = Vec2.fromPoint(target.pos);
      const pos = Vec2.fromPoint(this.agent.pos);
      const dir = Vec2.fromPoint(targetPos.sub(pos)).normalize();
      const diff = dir.mult((this.agent.speedInKnots * delta) / 100); // what is this random divison by 100?
      const veryCloseToTarget = pos.aboutEquals(targetPos, 2); // random distance of 2? what's the best number to use here? what does it mean to be '2' close?

      if (veryCloseToTarget) {
        this.agent.pos = targetPos;
        this.target = null;
        if (target instanceof City) {
          this.agent.dock(target);
        }
        return;
      }

      const resultingPos = pos.add(diff);
      this.agent.pos = resultingPos;
    }
  }
}
