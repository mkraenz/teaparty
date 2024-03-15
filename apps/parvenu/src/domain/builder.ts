import { CountingHouse } from './buildings/counting-house';
import { GrainFarm } from './buildings/grain-farm';
import { ProductionSystem } from './buildings/production.system';
import { WithProductionSystem } from './buildings/with-production-system.mixin';
import { Woodcutter } from './buildings/woodcutter';
import { Citizens } from './citizens';
import { City } from './city';
import { FreightForwarder } from './freight-forwarder';
import { Player } from './player';
import { Storage } from './storage';
import { TradingPost } from './trading-post';
import { Treasury } from './treasury';
import { Point } from './types';
import { Workforce } from './workforce';
import { World } from './world';

const makeCity = (name: string, position: Point, player: Player) => {
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
    position,
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
  const playerStorage = new Storage('player');
  // playerStorage.empty();
  const playerTreasury = new Treasury();
  playerTreasury.debit(10000);
  const player = new Player({
    storage: playerStorage,
    treasury: playerTreasury,
  });

  const gdanks = makeCity('Gdansk', { x: 1000, y: 800 }, player);
  const stockholm = makeCity('Stockholm', { x: 1000, y: 120 }, player);
  const edinburgh = makeCity('Edinburgh', { x: 100, y: 130 }, player);

  const hamburg = makeCity('Hamburg', { x: 500, y: 850 }, player);
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
  const woodcutter = new PWoodCutter({
    owner: 'Hamburg',
    productionSystem: makeCityProductionSystem(),
  });
  const farm = new PGrainFarm({
    owner: 'Hamburg',
    productionSystem: makeCityProductionSystem(),
  });
  hamburg.city.build(woodcutter);
  hamburg.city.build(farm);

  const countingHouse = new CountingHouse({
    storage: new Storage('counting house'),
    treasury: player.treasury,
    owner: 'player',
  });
  const freightForwarder = new FreightForwarder({
    targetStorage: countingHouse.storage,
    sourceStorage: player.storage,
  });

  freightForwarder.transferInto('wood', 50);

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
