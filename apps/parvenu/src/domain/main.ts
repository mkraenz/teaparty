import { ProductionSystem } from './buildings/production.system';
import { WithProductionSystem } from './buildings/with-production-system.mixin';
import { Woodcutter } from './buildings/woodcutter';
import { Citizens } from './citizens';
import { City } from './city';
import { Player } from './player';
import { Storage } from './storage';
import { TradingPost } from './trading-post';
import { Treasury } from './treasury';
import { Workforce } from './workforce';
import { World } from './world';

export const main = () => {
  const cityStorage = new Storage();
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
    name: 'Hamburg',
    citizens,
    storage: cityStorage,
    tradingPost,
    buildings: {},
    treasury: cityTreasury,
  });

  const PWoodCutter = WithProductionSystem(Woodcutter);
  const makeCityProductionSystem = () =>
    new ProductionSystem({
      cityTreasury: city.treasury,
      storage: cityStorage,
      treasury: cityTreasury,
      workforce: new Workforce({
        citizens: city.citizens,
        maxWorkers: 100,
        workers: 0,
      }),
    });
  const productionSystem = makeCityProductionSystem();
  const building = new PWoodCutter({
    owner: 'city',
    productionSystem,
  });
  city.build(building);

  tradingPost.setMerchant({
    storage: playerStorage,
    treasury: playerTreasury,
  });
  const player = new Player({
    storage: playerStorage,
    treasury: playerTreasury,
  });
  const world = new World({
    cities: { [city.name]: city },
    player,
  });
  return {
    cityStorage,
    city,
    playerTreasury: playerTreasury,
    playerStorage,
    world,
  };
};
