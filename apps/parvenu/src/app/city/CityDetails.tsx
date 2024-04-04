import {
  Button,
  HStack,
  Heading,
  IconButton,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { isEmpty, toInteger } from 'lodash';
import { FC, useEffect, useState } from 'react';
import {
  FiTrash,
  FiUserCheck,
  FiUserMinus,
  FiUserPlus,
  FiUserX,
} from 'react-icons/fi';
import { Navigate, useParams } from 'react-router-dom';
import { Brewery } from '../../domain/buildings/brewery';
import { buildingData } from '../../domain/buildings/building.data';
import { GrainFarm, PGrainFarm } from '../../domain/buildings/grain-farm';
import { ProductionSystem } from '../../domain/buildings/production.system';
import { WithProductionSystem } from '../../domain/buildings/with-production-system.mixin';
import { Woodcutter } from '../../domain/buildings/woodcutter';
import { City } from '../../domain/city';
import { Convoy } from '../../domain/convoy';
import { Workforce } from '../../domain/workforce';
import SpeedSettings from '../common/SpeedSettings';
import ToWorldmapButton from '../common/ToWorldmapButton';
import { useCity, useWorld } from '../general/GameProvider';

const CitizenDetails: FC<{ city: City }> = ({ city }) => {
  const citizens = city.citizens;
  return (
    <VStack align={'flex-start'}>
      <Heading as="h2">City {city.label} and its Citizens</Heading>
      <List>
        <ListItem>Beggars: {citizens.beggars}</ListItem>
        <ListItem>Poor: {citizens.poor}</ListItem>
        <ListItem>Middle: {citizens.middle}</ListItem>
        <ListItem>Rich: {citizens.rich}</ListItem>
        <ListItem>{city.treasury.balance} Gold</ListItem>
      </List>
    </VStack>
  );
};

const Port: FC<{ city: City }> = ({ city }) => {
  const hoverColor = useColorModeValue('gray.300', 'gray.700');
  const [selected, setSelected] = useState<Convoy | null>(null);
  const tradingPost = useDisclosure();
  return (
    <VStack align={'flex-start'}>
      <Heading as="h2">Port</Heading>
      <List width={'100%'}>
        {isEmpty(city.port.convoys) && <ListItem>No convoys docked.</ListItem>}
        {Object.values(city.port.convoys).map((convoy) => (
          <ListItem
            key={convoy.id}
            cursor={'pointer'}
            onClick={() => {
              setSelected(convoy);
              tradingPost.onOpen();
            }}
            _hover={{ backgroundColor: hoverColor }}
          >
            {convoy.label} - {convoy.usedCargoCapacity}
            {' / '}
            {convoy.totalCargoCapacity} cargo
          </ListItem>
        ))}
      </List>
      {selected && (
        <TradingPostOverlay
          city={city}
          convoy={selected}
          visible={tradingPost.isOpen}
          onClose={tradingPost.onClose}
        />
      )}
    </VStack>
  );
};

const TradingAmountSelector: FC<{
  setAmountTraded: (n: number) => void;
  amountTraded: number;
}> = ({ amountTraded, setAmountTraded }) => {
  return (
    <RadioGroup
      onChange={(n) => setAmountTraded(toInteger(n))}
      value={amountTraded.toString()}
    >
      <HStack>
        <Radio value={'1'}>1</Radio>
        <Radio value={'5'}>5</Radio>
        <Radio value={'50'}>50</Radio>
      </HStack>
    </RadioGroup>
  );
};

const TradingPostOverlay: FC<{
  city: City;
  convoy: Convoy;
  visible: boolean;
  onClose: VoidFunction;
}> = ({ visible, onClose, city, convoy }) => {
  const [amountTraded, setAmountTraded] = useState(1);
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={'95%'}>
        <ModalHeader>
          <VStack>
            <Text>
              {city.label} {city.storage.usedCapacity}
              {' <> '}
              {convoy.label} {convoy.usedCargoCapacity}
              {' / '}
              {convoy.totalCargoCapacity}
            </Text>

            <TradingAmountSelector
              amountTraded={amountTraded}
              setAmountTraded={setAmountTraded}
            />
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TradingPostTable
            city={city}
            convoy={convoy}
            amountTraded={amountTraded}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const TradingPostTable: FC<{
  city: City;
  convoy: Convoy;
  amountTraded: number;
}> = ({ city, convoy, amountTraded }) => {
  const { tradingPost } = city;
  const wares = city.storage.wares;
  useEffect(() => {
    tradingPost.setMerchant(convoy);
  }, []);
  const average = (a: number) => Math.round(a / amountTraded);
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Goods</Th>
          <Th>Town</Th>
          <Th>⌀ Buy</Th>
          <Th>⌀ Sell</Th>
          <Th>Ship</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.keys(wares).map((ware) => (
          <Tr key={ware}>
            <Td>{ware}</Td>
            <Td>{city.storage.getStock(ware)}</Td>
            <Td>
              <Tooltip
                label={tradingPost.getQuoteForSellingToMerchant(
                  ware,
                  amountTraded
                )}
              >
                <Button
                  onClick={() => {
                    tradingPost.sellToMerchant(ware, amountTraded);
                  }}
                  // FIXME: bad UX because you cant just select 50 and then buy the remaining 20 from the city
                  isDisabled={
                    !tradingPost.canSellToMerchant(ware, amountTraded)
                  }
                  width={40}
                >
                  {average(
                    tradingPost.getQuoteForSellingToMerchant(ware, amountTraded)
                  )}
                </Button>
              </Tooltip>
            </Td>
            <Td>
              <Tooltip
                placement="top"
                openDelay={1}
                closeDelay={1}
                label={tradingPost.getQuoteForBuyingFromMerchant(
                  ware,
                  amountTraded
                )}
              >
                <Button
                  onClick={() => {
                    tradingPost.buyFromMerchant(ware, amountTraded);
                  }}
                  isDisabled={
                    !tradingPost.canBuyFromMerchant(ware, amountTraded)
                  }
                  width={40}
                >
                  {average(
                    tradingPost.getQuoteForBuyingFromMerchant(
                      ware,
                      amountTraded
                    )
                  )}
                </Button>
              </Tooltip>
            </Td>
            <Td>{convoy.storage.getStock(ware)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export const CityDetails: FC = () => {
  const world = useWorld();
  const { id } = useParams<{ id: string }>();
  const city = useCity(id);

  if (!city) return <Navigate to="/" />;

  const player = world.player;
  const playerStorage = player.storage;
  const playerTreasury = player.treasury;
  const buildings = city.buildingsList;

  // TODO continue here
  const canBuild = (type: keyof typeof buildingData) =>
    playerStorage.hasResources(buildingData[type].constructionCosts.needs) &&
    playerTreasury.hasEnough(buildingData[type].constructionCosts.money);
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
    const costs = buildingData.brewery.constructionCosts;

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
    const costs = buildingData.grainFarm.constructionCosts;

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
    const costs = buildingData.woodcutter.constructionCosts;

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
      <ToWorldmapButton />
      <SpeedSettings />

      <HStack align={'flex-start'} justify={'space-between'} gap={20}>
        <CitizenDetails city={city} />

        <VStack align="flex-end">
          <Heading as="h2">Player</Heading>
          <List>
            <ListItem>{playerTreasury.balance} Gold</ListItem>
          </List>
        </VStack>
      </HStack>

      <Port city={city} />
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

export default CityDetails;
