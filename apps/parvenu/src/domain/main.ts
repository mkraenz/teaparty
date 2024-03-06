import { GrainFarm } from './buildings/grain-farm';
import { Citizens } from './citizens';
import { City } from './city';
import { Storage } from './storage';
import { Treasury } from './treasury';
import { Workforce } from './workforce';

const main = () => {
  const { storage, city, secondGrainFarm } = builder();

  storage.log();
  let totalTime = 0;
  setInterval(() => {
    totalTime += 1;
    if (totalTime === 10) {
      console.log('############# hiring workers for 2nd grain farm ##########');
      secondGrainFarm.hireWorkers();
    }
    console.log('time', totalTime);
    city.produce();
    city.consumeAllResources();
    storage.log();
  }, 1000);
};

function builder() {
  const storage = new Storage();
  storage.empty();
  const citizens = new Citizens(storage);
  citizens.beggars = 200;
  const workforce = new Workforce({
    citizens,
    workers: 0,
    maxWorkers: 100,
  });
  const cityTreasury = new Treasury();
  const treasury = new Treasury();
  const grainFarm = new GrainFarm({
    owner: 'city',
    storage,
    workforce,
    treasury,
    cityTreasury,
  });
  grainFarm.hireWorkers();

  const workforce2 = new Workforce({
    citizens,
    workers: 0,
    maxWorkers: 100,
  });
  const secondGrainFarm = new GrainFarm({
    owner: 'city',
    storage,
    workforce: workforce2,
    treasury,
    cityTreasury,
  });
  const city = new City({
    citizens,
    storage,
    buildings: {
      [grainFarm.id]: grainFarm,
      [secondGrainFarm.id]: secondGrainFarm,
    },
    treasury,
  });
  return { storage, city, secondGrainFarm };
}

main();
