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

const makeCity = (name: string, player: Player) => {
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

  tradingPost.setMerchant(player);

  return {
    storage,
    citizens,
    treasury,
    tradingPost,
    city,
  };
};

export const builder = () => {
  const playerStorage = new Storage();
  playerStorage.empty();
  const playerTreasury = new Treasury();
  playerTreasury.debit(10000);
  const player = new Player({
    storage: playerStorage,
    treasury: playerTreasury,
  });

  const gdanks = makeCity('Gdansk', player);
  const stockholm = makeCity('Stockholm', player);
  const edinburgh = makeCity('Edinburgh', player);

  const hamburg = makeCity('Hamburg', player);
  hamburg.city.citizens.beggars = 200;

  const PWoodCutter = WithProductionSystem(Woodcutter);
  const PGrainFarm = WithProductionSystem(GrainFarm);
  const makeCityProductionSystem = () =>
    new ProductionSystem({
      cityTreasury: hamburg.city.treasury,
      storage: hamburg.city.storage,
      treasury: hamburg.city.treasury,
      workforce: new Workforce({
        citizens: hamburg.city.citizens,
        maxWorkers: 100,
        workers: 0,
      }),
      upkeepExempt: true,
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

  const world = new World({
    cities: {
      [hamburg.city.name]: hamburg.city,
      [gdanks.city.name]: gdanks.city,
      [stockholm.city.name]: stockholm.city,
      [edinburgh.city.name]: edinburgh.city,
    },
    player,
  });
  return {
    world,
  };
};
