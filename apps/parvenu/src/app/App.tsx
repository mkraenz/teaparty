import {
  Button,
  HStack,
  Heading,
  IconButton,
  List,
  ListItem,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
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
import { main } from '../domain/main';
import { Workforce } from '../domain/workforce';
import Settings from './Settings';
import useGameLoop from './hooks/useGameLoop';
import useGamespeed from './hooks/useGamespeed';

export const App = () => {
  useGameLoop();
  const [time, setTime] = useState(0);
  const mapRef = useRef(main());
  const { gamespeed, setGamespeed } = useGamespeed(
    time,
    setTime,
    mapRef.current.world
  );
  const wares = mapRef.current.cityStorage.wares;
  const player = mapRef.current.world.player;
  const playerStorage = player.storage;
  const playerTreasury = player.treasury;
  const playerWares = playerStorage.wares;
  const city = mapRef.current.city;
  const buildings = city.buildingsList;
  const { citizens, tradingPost } = city;

  const canBuild = (type: keyof typeof productionBuildings) =>
    playerStorage.hasResources(
      productionBuildings[type].constructionCosts.needs
    ) &&
    playerTreasury.hasEnough(productionBuildings[type].constructionCosts.money);
  const makeProductionSystem = () =>
    new ProductionSystem({
      cityTreasury: city.treasury,
      storage: playerStorage,
      treasury: playerTreasury,
      workforce: new Workforce({
        citizens: city.citizens,
        maxWorkers: 100,
        workers: 0,
      }),
    });
  const buildBrewery = () => {
    const ProductionBuilding = Brewery;
    const costs = productionBuildings.brewery.constructionCosts;

    if (!playerStorage.hasResources(costs.needs))
      return console.log('not enough resources to build');
    if (!playerTreasury.hasEnough(costs.money))
      return console.log('not enough money to build');

    playerStorage.consume(costs.needs);
    playerTreasury.credit(costs.money);

    const productionSystem = makeProductionSystem();
    const ActualBuilding = WithProductionSystem(ProductionBuilding);
    const building = new ActualBuilding({
      owner: 'player',
      productionSystem,
    });
    city.build(building);
  };
  const buildGrainFarm = () => {
    const ProductionBuilding = GrainFarm;
    const costs = productionBuildings.grainFarm.constructionCosts;

    if (!playerStorage.hasResources(costs.needs))
      return console.log('not enough resources to build');
    if (!playerTreasury.hasEnough(costs.money))
      return console.log('not enough money to build');

    playerStorage.consume(costs.needs);
    playerTreasury.credit(costs.money);

    const productionSystem = makeProductionSystem();
    const ActualBuilding = WithProductionSystem(ProductionBuilding);
    const building = new ActualBuilding({
      owner: 'player',
      productionSystem,
    });
    city.build(building);
  };
  const buildWoodcutter = () => {
    const ProductionBuilding = Woodcutter;
    const costs = productionBuildings.woodcutter.constructionCosts;

    if (!playerStorage.hasResources(costs.needs))
      return console.log('not enough resources to build');
    if (!playerTreasury.hasEnough(costs.money))
      return console.log('not enough money to build');

    playerStorage.consume(costs.needs);
    playerTreasury.credit(costs.money);

    const productionSystem = makeProductionSystem();
    const ActualBuilding = WithProductionSystem(ProductionBuilding);
    const building = new ActualBuilding({
      owner: 'player',
      productionSystem,
    });
    city.build(building);
  };

  return (
    <div>
      <Heading as="h2">
        Day {time} {time !== 0 && time % 7 === 0 ? '(Payday)' : ''}
      </Heading>
      <Settings gamespeed={gamespeed} setGamespeed={setGamespeed} />

      <HStack align={'flex-start'} justify={'space-between'} gap={20}>
        <VStack align={'flex-start'}>
          <Heading as="h2">City {city.name} and its Citizens</Heading>
          <List>
            <ListItem>Beggars: {citizens.beggars}</ListItem>
            <ListItem>Poor: {citizens.poor}</ListItem>
            <ListItem>Middle: {citizens.middle}</ListItem>
            <ListItem>Rich: {citizens.rich}</ListItem>
            <ListItem>{city.treasury.balance} Gold</ListItem>
          </List>
        </VStack>

        <VStack align="flex-end">
          <Heading as="h2">Player</Heading>
          <List>
            <ListItem>{playerTreasury.balance} Gold</ListItem>
          </List>
        </VStack>
      </HStack>
      <Heading as="h2">Trading Post</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Goods</Th>
            <Th>Town</Th>
            <Th>Buy 1</Th>
            <Th>Buy all</Th>
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
                  }}
                  isDisabled={!tradingPost.canSellToMerchant(ware)}
                  width={100}
                >
                  {tradingPost.getQuoteForSellingToMerchant(ware)}
                </Button>
              </Td>
              <Td>
                <Button
                  onClick={() => {
                    tradingPost.sellToMerchant(
                      ware,
                      city.storage.getStock(ware)
                    );
                  }}
                  isDisabled={
                    !tradingPost.canSellToMerchant(
                      ware,
                      city.storage.getStock(ware)
                    )
                  }
                  width={100}
                >
                  {tradingPost.getQuoteForSellingToMerchant(
                    ware,
                    city.storage.getStock(ware)
                  )}
                </Button>
              </Td>
              <Td>
                <Button
                  onClick={() => {
                    tradingPost.buyFromMerchant(ware);
                  }}
                  isDisabled={!tradingPost.canBuyFromMerchant(ware)}
                  width={100}
                >
                  {tradingPost.getQuoteForBuyingFromMerchant(ware)}
                </Button>
              </Td>
              <Td>
                <Button
                  onClick={() => {
                    tradingPost.buyFromMerchant(
                      ware,
                      playerStorage.getStock(ware)
                    );
                  }}
                  isDisabled={
                    !tradingPost.canBuyFromMerchant(
                      ware,
                      playerStorage.getStock(ware)
                    )
                  }
                  width={100}
                >
                  {tradingPost.getQuoteForBuyingFromMerchant(
                    ware,
                    playerStorage.getStock(ware)
                  )}
                </Button>
              </Td>
              <Td>{playerWares[ware]}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Heading as="h2">Buildings</Heading>

      <Button onClick={buildWoodcutter} isDisabled={!canBuild('woodcutter')}>
        Build woodcutter
      </Button>
      <Button onClick={buildGrainFarm} isDisabled={!canBuild('grainFarm')}>
        Build grain farm
      </Button>
      <Button onClick={buildBrewery} isDisabled={!canBuild('brewery')}>
        Build brewery
      </Button>
      <List>
        {buildings.map((building) => (
          <ListItem display={'flex'} gap={10} key={building.id}>
            {building.owner}'s {building.id}:{' '}
            {(building as PGrainFarm).productionSystem.workforce.workers}{' '}
            workers of{' '}
            {(building as PGrainFarm).productionSystem.desiredWorkers} desired
            <IconButton
              color="red.500"
              icon={<FiUserX />}
              aria-label="Fire all workers"
              onClick={() => {
                (building as PGrainFarm).setDesiredWorkers(0);
              }}
            />
            <IconButton
              color="red.300"
              icon={<FiUserMinus />}
              aria-label="Fire one worker"
              onClick={() => {
                (building as PGrainFarm).decrementDesiredWorkers(5);
              }}
            />
            <IconButton
              color="green.300"
              icon={<FiUserPlus />}
              aria-label="Add one workers"
              onClick={() => {
                (building as PGrainFarm).incrementDesiredWorkers(5);
              }}
            />
            <IconButton
              color="green.500"
              icon={<FiUserCheck />}
              aria-label="Max workers"
              onClick={() => {
                (building as PGrainFarm).setDesiredWorkers(100);
              }}
            />
            <IconButton
              colorScheme="red"
              icon={<FiTrash />}
              aria-label="Destroy building"
              onClick={() => {
                city.destroyBuilding(building.id);
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default App;
