import { CountingHouse } from './buildings/counting-house';
import { GrainFarm } from './buildings/grain-farm';
import { ProductionSystem } from './buildings/production.system';
import { WithProductionSystem } from './buildings/with-production-system.mixin';
import { Woodcutter } from './buildings/woodcutter';
import { Citizens } from './citizens';
import { City } from './city';
import { cityData } from './city.data';
import { Convoy } from './convoy';
import { FreightForwarder } from './freight-forwarder';
import { Player } from './player';
import { Storage } from './storage';
import { TradingPost } from './trading-post';
import { Treasury } from './treasury';
import { Point } from './types';
import { Workforce } from './workforce';
import { World } from './world';

const makeCity = (id: string, label: string, pos: Point, player: Player) => {
  const storage = new Storage();
  const citizens = new Citizens(storage);
  const treasury = new Treasury();
  const tradingPost = new TradingPost({
    citizens,
    cityStorage: storage,
    cityTreasury: treasury,
  });
  const city = new City({
    label: label,
    citizens,
    storage: storage,
    tradingPost,
    buildings: {},
    treasury: treasury,
    pos,
    id,
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

  const cities = Object.values(cityData).map((data) =>
    makeCity(data.id, data.label, data.pos, player)
  );

  const hamburg = cities.find((city) => city.city.id === 'hamburg')!;
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

  cities.forEach((city) => city.storage.debugFill());

  const countingHouse = new CountingHouse({
    storage: new Storage('counting house'),
    treasury: player.treasury,
    owner: 'player',
  });
  const convoy = new Convoy({
    label: 'Convoy 1',
    pos: { x: 500, y: 666 },
    storage: new Storage('Convoy 1'),
  });
  const convoys = [convoy];

  countingHouse.storage.debugFill();
  const freightForwarder = new FreightForwarder({
    targetStorage: countingHouse.storage,
    sourceStorage: convoy.storage,
  });
  freightForwarder.transferFrom('wood', 50);

  const world = new World({
    player,
    cities: cities.reduce(
      (acc, city) => ({ ...acc, [city.city.id]: city.city }),
      {}
    ),
    convoys: convoys.reduce(
      (acc, convoy) => ({ ...acc, [convoy.id]: convoy }),
      {}
    ),
  });
  return {
    world,
  };
};
