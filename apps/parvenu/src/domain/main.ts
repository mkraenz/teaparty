import { Citizens } from './citizens';
import { City } from './city';
import { Storage } from './storage';
import { TradingPost } from './trading-post';
import { Treasury } from './treasury';

const main = () => {
  const { cityStorage: storage, city } = builder();

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
  const cityStorage = new Storage();
  // storage.empty();
  const citizens = new Citizens(cityStorage);
  citizens.beggars = 200;
  const cityTreasury = new Treasury();
  const playerStorage = new Storage();
  playerStorage.empty();
  const playerTreasury = new Treasury();
  playerTreasury.debit(10000);
  const tradingPost = new TradingPost({
    citizens,
    cityStorage: cityStorage,
    cityTreasury: cityTreasury,
  });
  const city = new City({
    citizens,
    storage: cityStorage,
    tradingPost,
    buildings: {},
    treasury: cityTreasury,
  });
  tradingPost.setMerchant({
    storage: playerStorage,
    treasury: playerTreasury,
  });
  return {
    cityStorage,
    city,
    playerTreasury: playerTreasury,
    playerStorage,
  };
};

// main();
