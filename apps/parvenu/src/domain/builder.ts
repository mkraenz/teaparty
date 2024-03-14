import { GrainFarm } from './buildings/grain-farm';
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

const makeCity = (name: string) => {
  const storage = new Storage();
  const citizens = new Citizens(storage);
  const treasury = new Treasury();
  const tradingPost = new TradingPost({
    citizens,
    cityStorage: storage,
    cityTreasury: treasury,
  });
  const city = new City({
    name: name,
    citizens,
    storage: storage,
    tradingPost,
    buildings: {},
    treasury: treasury,
  });
  return {
    storage,
    citizens,
    treasury,
    tradingPost,
    city,
  };
};

export const builder = () => {
  const cityTreasury = new Treasury();
  const playerStorage = new Storage();
  playerStorage.empty();
  const playerTreasury = new Treasury();
  playerTreasury.debit(10000);
  const hamburg = makeCity('Hamburg');
  hamburg.city.citizens.beggars = 200;

  const gdanks = makeCity('Gdansk');

  const PWoodCutter = WithProductionSystem(Woodcutter);
  const PGrainFarm = WithProductionSystem(GrainFarm);
  const makeCityProductionSystem = () =>
    new ProductionSystem({
      cityTreasury: hamburg.city.treasury,
      storage: hamburg.city.storage,
      treasury: cityTreasury,
      workforce: new Workforce({
        citizens: hamburg.city.citizens,
        maxWorkers: 100,
        workers: 0,
      }),
    });
  const productionSystem = makeCityProductionSystem();
  const woodcutter = new PWoodCutter({
    owner: 'Hamburg',
    productionSystem,
  });
  const farm = new PGrainFarm({
    owner: 'Hamburg',
    productionSystem,
  });
  hamburg.city.build(woodcutter);
  hamburg.city.build(farm);

  const player = new Player({
    storage: playerStorage,
    treasury: playerTreasury,
  });
  hamburg.city.tradingPost.setMerchant(player);
  gdanks.city.tradingPost.setMerchant(player);

  const world = new World({
    cities: {
      [hamburg.city.name]: hamburg.city,
      [gdanks.city.name]: gdanks.city,
    },
    player,
  });
  return {
    world,
  };
};
