import {
  Button,
  HStack,
  Heading,
  IconButton,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useReducer, useRef, useState } from 'react';
import {
  FiTrash,
  FiUserCheck,
  FiUserMinus,
  FiUserPlus,
  FiUserX,
} from 'react-icons/fi';
import { Brewery } from '../domain/buildings/brewery';
import { GrainFarm, PGrainFarm } from '../domain/buildings/grain-farm';
import { productionBuildings } from '../domain/buildings/production-buildings.data';
import { ProductionSystem } from '../domain/buildings/production.system';
import { WithProductionSystem } from '../domain/buildings/with-production-system.mixin';
import { Woodcutter } from '../domain/buildings/woodcutter';
import { builder } from '../domain/main';
import { Workforce } from '../domain/workforce';

const handleKeyPress =
  (setSpeed: (value: number) => void) => (event: KeyboardEvent) => {
    if (event.key === '1') setSpeed(0);
    if (event.key === '2') setSpeed(0.1);
    if (event.key === '3') setSpeed(1);
    if (event.key === '4') setSpeed(2);
    if (event.key === '5') setSpeed(3);
    if (event.key === '6') setSpeed(10);
    if (event.key === '7') setSpeed(100);
  };

export const App = () => {
  const [time, setTime] = useState(0);
  const [, forceRerender] = useReducer((x) => x + 1, 0);
  const timeRef = useRef(time);
  const mapRef = useRef(builder());
  const [gamespeed, setGamespeed] = useState(1); // 0 = paused, 0.1, 1 = 1 day per second, 2, 3, 10
  useEffect(() => {
    const interval =
      gamespeed === 0
        ? 0
        : window.setInterval(() => {
            timeRef.current += 1; // i didn't find a better way to ensure access to the up-to-date time without rerunning useEffect
            setTime(timeRef.current);
            mapRef.current.city.passDay(timeRef.current);
          }, 1000 / gamespeed);
    return () => window.clearInterval(interval);
  }, [gamespeed]);
  useEffect(() => {
    const listener = handleKeyPress(setGamespeed);
    window.addEventListener('keydown', listener, false);
    return () => document.removeEventListener('keydown', listener);
  }, [setGamespeed]);
  const wares = mapRef.current.cityStorage.wares;
  const playerWares = mapRef.current.playerStorage.wares;
  const city = mapRef.current.city;
  const buildings = city.buildingsList;
  const { citizens, tradingPost } = city;
  const playerTreasury = mapRef.current.playerTreasury;

  const canBuild = (type: keyof typeof productionBuildings) =>
    city.storage.hasResources(
      productionBuildings[type].constructionCosts.needs
    ) &&
    playerTreasury.hasEnough(productionBuildings[type].constructionCosts.money);
  const makeProductionSystem = () =>
    new ProductionSystem({
      cityTreasury: city.treasury,
      storage: city.storage,
      treasury: playerTreasury,
      workforce: new Workforce({
        citizens: city.citizens,
        maxWorkers: 100,
        workers: 0,
      }),
    });
  const addBrewery = () => {
    const ProductionBuilding = Brewery;
    const costs = productionBuildings.brewery.constructionCosts;

    if (!city.storage.hasResources(costs.needs))
      return console.log('not enough resources to build');
    if (!playerTreasury.hasEnough(costs.money))
      return console.log('not enough money to build');

    city.storage.consume(costs.needs);
    playerTreasury.credit(costs.money);

    const productionSystem = makeProductionSystem();
    const ActualBuilding = WithProductionSystem(ProductionBuilding);
    const building = new ActualBuilding({
      owner: 'city',
      productionSystem,
    });
    city.build(building);
    forceRerender();
  };
  const addGrainFarm = () => {
    const ProductionBuilding = GrainFarm;
    const costs = productionBuildings.grainFarm.constructionCosts;

    if (!city.storage.hasResources(costs.needs))
      return console.log('not enough resources to build');
    if (!playerTreasury.hasEnough(costs.money))
      return console.log('not enough money to build');

    city.storage.consume(costs.needs);
    playerTreasury.credit(costs.money);

    const productionSystem = makeProductionSystem();
    const ActualBuilding = WithProductionSystem(ProductionBuilding);
    const building = new ActualBuilding({
      owner: 'city',
      productionSystem,
    });
    city.build(building);
    forceRerender();
  };
  const addWoodcutter = () => {
    const ProductionBuilding = Woodcutter;
    const costs = productionBuildings.woodcutter.constructionCosts;

    if (!city.storage.hasResources(costs.needs))
      return console.log('not enough resources to build');
    if (!playerTreasury.hasEnough(costs.money))
      return console.log('not enough money to build');

    city.storage.consume(costs.needs);
    playerTreasury.credit(costs.money);

    const productionSystem = makeProductionSystem();
    const ActualBuilding = WithProductionSystem(ProductionBuilding);
    const building = new ActualBuilding({
      owner: 'city',
      productionSystem,
    });
    city.build(building);
    forceRerender();
  };

  return (
    <div>
      <Heading as="h2">
        Day {time} {time !== 0 && time % 7 === 0 ? '(Payday)' : ''}
      </Heading>
      <RadioGroup
        onChange={(x) => setGamespeed(parseFloat(x))}
        value={gamespeed.toString()}
      >
        <HStack>
          <Radio value={'0'}>0x</Radio>
          <Radio value={'0.1'}>0.1x</Radio>
          <Radio value={'1'}>1x</Radio>
          <Radio value={'2'}>2x</Radio>
          <Radio value={'3'}>3x</Radio>
          <Radio value={'10'}>10x</Radio>
          <Radio value={'100'}>100x</Radio>
        </HStack>
      </RadioGroup>

      <Heading as="h2">Player</Heading>
      <List>
        <ListItem>Treasury: {playerTreasury.balance}</ListItem>
      </List>

      <Heading as="h2">City & Citizens</Heading>
      <List>
        <ListItem>Beggars: {citizens.beggars}</ListItem>
        <ListItem>Poor: {citizens.poor}</ListItem>
        <ListItem>Middle: {citizens.middle}</ListItem>
        <ListItem>Rich: {citizens.rich}</ListItem>
        <ListItem>Treasury: {city.treasury.balance}</ListItem>
      </List>
      <Heading as="h2">Storage</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Goods</Th>
            <Th>Town</Th>
            <Th>Buy</Th>
            <Th>Sell</Th>
            <Th>You</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(wares).map((ware) => (
            <Tr key={ware}>
              <Td>{ware}</Td>
              <Td>{wares[ware]}</Td>
              <Td>
                <Button
                  onClick={() => {
                    tradingPost.sellToMerchant(ware);
                    forceRerender();
                  }}
                  isDisabled={!tradingPost.canSellToMerchant(ware)}
                >
                  {tradingPost.getQuoteForSellingToMerchant(ware)}
                </Button>
              </Td>
              <Td>
                <Button
                  onClick={() => {
                    tradingPost.buyFromMerchant(ware);
                    forceRerender();
                  }}
                  isDisabled={!tradingPost.canBuyFromMerchant(ware)}
                >
                  {tradingPost.getQuoteForBuyingFromMerchant(ware)}
                </Button>
              </Td>
              <Td>{playerWares[ware]}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Heading as="h2">Buildings</Heading>
      <List>
        {buildings.map((building) => (
          <ListItem display={'flex'} gap={10} key={building.id}>
            {building.id}:{' '}
            {(building as PGrainFarm).productionSystem.workforce.workers}{' '}
            workers of{' '}
            {(building as PGrainFarm).productionSystem.desiredWorkers} desired
            <IconButton
              color="red.500"
              icon={<FiUserX />}
              aria-label="Fire all workers"
              onClick={() => {
                (building as PGrainFarm).setDesiredWorkers(0);
                forceRerender();
              }}
            />
            <IconButton
              color="red.300"
              icon={<FiUserMinus />}
              aria-label="Fire one worker"
              onClick={() => {
                (building as PGrainFarm).decrementDesiredWorkers(5);
                forceRerender();
              }}
            />
            <IconButton
              color="green.300"
              icon={<FiUserPlus />}
              aria-label="Add one workers"
              onClick={() => {
                (building as PGrainFarm).incrementDesiredWorkers(5);
                forceRerender();
              }}
            />
            <IconButton
              color="green.500"
              icon={<FiUserCheck />}
              aria-label="Max workers"
              onClick={() => {
                (building as PGrainFarm).setDesiredWorkers(100);
                forceRerender();
              }}
            />
            <IconButton
              colorScheme="red"
              icon={<FiTrash />}
              aria-label="Destroy building"
              onClick={() => {
                city.destroyBuilding(building.id);
                forceRerender();
              }}
            />
          </ListItem>
        ))}
      </List>

      <Button onClick={addWoodcutter} isDisabled={!canBuild('woodcutter')}>
        Build woodcutter
      </Button>
      <Button onClick={addGrainFarm} isDisabled={!canBuild('grainFarm')}>
        Build grain farm
      </Button>
      <Button onClick={addBrewery} isDisabled={!canBuild('brewery')}>
        Build brewery
      </Button>
    </div>
  );
};

export default App;
