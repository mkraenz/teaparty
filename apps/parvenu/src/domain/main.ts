import { Citizens } from './citizens';
import { City } from './city';
import { Storage } from './storage';
import { Treasury } from './treasury';

const main = () => {
  const { storage, city } = builder();

  storage.log();
  let totalTime = 0;
  setInterval(() => {
    totalTime += 1;
    if (totalTime === 10) {
      console.log('############# hiring workers for 2nd grain farm ##########');
      // secondGrainFarm.hireWorkers();
    }
    console.log('time', totalTime);
    city.produce();
    city.consumeAllResources();
    storage.log();
  }, 1000);
};

export const builder = () => {
  const storage = new Storage();
  // storage.empty();
  const citizens = new Citizens(storage);
  citizens.beggars = 200;
  const cityTreasury = new Treasury();
  const treasury = new Treasury();
  treasury.give(10000);
  const city = new City({
    citizens,
    storage,
    buildings: {},
    treasury: cityTreasury,
  });
  return { storage, city, playerTreasury: treasury };
};

// main();
