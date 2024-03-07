import { Storage } from './storage';

const WareConsumptionFactors: Record<
  string,
  { poor: number; middle: number; rich: number }
> = {
  wood: {
    poor: 0,
    middle: 0,
    rich: 0,
  },
  beer: {
    poor: 2,
    middle: 3,
    rich: 0.5,
  },
  grain: {
    poor: 3,
    middle: 5,
    rich: 0.5,
  },
  fabric: {
    poor: 0.2,
    middle: 1.8,
    rich: 0.7,
  },
  furs: {
    poor: 0.05,
    middle: 0.2,
    rich: 2,
  },
  wine: {
    poor: 0.05,
    middle: 0.3,
    rich: 3,
  },
};

export class Citizens {
  beggars = 0;
  poor = 600;
  middle = 350;
  rich = 50;

  constructor(private storage: Storage) {}

  get total() {
    return this.poor + this.middle + this.rich;
  }

  consumeResource(ware: string) {
    const factorsByPopulationType = WareConsumptionFactors[ware];
    const theoreticalConsumption =
      (this.poor * factorsByPopulationType.poor +
        this.middle * factorsByPopulationType.middle +
        this.rich * factorsByPopulationType.rich) /
      1000.0;
    const consumption = Math.ceil(theoreticalConsumption); // ceiling so that consumption >= 1
    this.storage.remove(ware, consumption);
  }

  consumeResources() {
    this.storage.waresList.forEach((ware) => this.consumeResource(ware.type));
  }

  hireWorkers(workers: number) {
    this.beggars -= workers;
    this.poor += workers;
  }

  fireWorkers(workersToFire: number) {
    this.poor -= workersToFire;
    this.beggars += workersToFire;
  }

  addMigrants(count: number) {
    this.beggars += count;
  }
}
