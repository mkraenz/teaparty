import { City } from '../city';
import { Vec2 } from '../mymath';
import { Point } from '../types';

type Agent = {
  pos: Point;
  speedInKnots: number;
  dock(target: { port: { dock: (convoy: any) => void } }): void;
};

type PathPoint = {
  edgeToPrevPointLength: number;
  point: Point;
  totalLengthTravelledToPoint: number;
};

export class Navigator {
  agent!: Agent;
  target: { pos: Point } | null = null;
  path: {
    path: PathPoint[];
    length: number;
  } | null = null;
  /** between 0 and path.length */
  private lengthTravelled = 0;
  private nextPointIndexInPath = 0;

  setAgent(agent: Agent) {
    this.agent = agent;
  }

  setTarget(target: { pos: Point } | null) {
    this.target = target;
  }

  setPath(path: Point[] | null) {
    if (path === null) {
      this.path = null;
      return;
    }

    if (path.length < 2) throw new Error('Path must have at least two point');

    const internalPath = path
      .map((point, i) => {
        return {
          edgeToPrevPointLength:
            i === 0
              ? 0
              : Vec2.fromPoint(point).distance(Vec2.fromPoint(path[i - 1])),
          point,
        };
      })
      .reduce(
        (acc, point, i) => [
          ...acc,
          {
            ...point,
            totalLengthTravelledToPoint:
              i === 0
                ? 0
                : acc[i - 1].totalLengthTravelledToPoint +
                  point.edgeToPrevPointLength,
          },
        ],
        [] as PathPoint[]
      );
    this.path = {
      path: internalPath,
      length: Vec2.totalPathLength(path),
    };
    this.nextPointIndexInPath = 1;
  }

  /** linear interpolation along path */
  move(delta: number) {
    // TODO continue here: clicking a second time somewhere causes the convoy to randomly jump across the map
    const path = this.path;
    const target = this.target;
    if (
      target &&
      path &&
      this.nextPointIndexInPath > 0 &&
      this.nextPointIndexInPath < path.path.length
    ) {
      const lengthTravelledThisFrame = (this.agent.speedInKnots * delta) / 100; // divide by 1000 to convert from ms to seconds. still weird though

      const getNextTargetPointIndex = () => {
        for (let i = 1; i < path.path.length; i++) {
          if (path.path[i].totalLengthTravelledToPoint > this.lengthTravelled) {
            return i;
          }
        }
        return path.path.length - 1;
      };

      const nextTargetPointIndex = getNextTargetPointIndex();
      const nextTarget = path.path[nextTargetPointIndex];
      const prevTarget = path.path[nextTargetPointIndex - 1];
      const lambda =
        (this.lengthTravelled +
          lengthTravelledThisFrame -
          prevTarget.totalLengthTravelledToPoint) /
        nextTarget.edgeToPrevPointLength;

      const nextPos = Vec2.fromPoint(nextTarget.point).lerp(
        Vec2.fromPoint(prevTarget.point),
        lambda
      );
      this.lengthTravelled += Vec2.fromPoint(this.agent.pos).distance(nextPos);

      this.agent.pos = nextPos;

      // handle arrival
      const pos = Vec2.fromPoint(this.agent.pos);
      const targetPos = Vec2.fromPoint(target.pos);
      const veryCloseToTarget = pos.aboutEquals(targetPos, 2); // random distance of 2? what's the best number to use here? what does it mean to be '2' close?

      if (veryCloseToTarget) {
        this.agent.pos = targetPos;
        this.target = null;
        this.path = null;
        if (target instanceof City) {
          this.agent.dock(target);
        }
        return;
      }
    }
  }
}
