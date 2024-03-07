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
import { useEffect, useRef, useState } from 'react';
import {
  FiTrash,
  FiUserCheck,
  FiUserMinus,
  FiUserPlus,
  FiUserX,
} from 'react-icons/fi';
import { Brewery } from '../domain/buildings/brewery';
import { GrainFarm, PGrainFarm } from '../domain/buildings/grain-farm';
import { ProductionSystem } from '../domain/buildings/production.system';
import { WithProductionSystem } from '../domain/buildings/with-production-system.mixin';
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
  const wares = mapRef.current.storage.wares;
  const city = mapRef.current.city;
  const buildings = city.buildingsList;
  const citizens = city.citizens;
  const playerTreasury = mapRef.current.playerTreasury;
  return (
    <div>
      <h1>Welcome, Parvenu.</h1>
      <Heading as={'h2'}>Speed Settings</Heading>
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
            <Th>Time</Th>
            <Th>Grain</Th>
            <Th>Beer</Th>
            <Th>Fabric</Th>
            <Th>Wine</Th>
            <Th>Furs</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{time}</Td>
            <Td>{wares['grain']}</Td>
            <Td>{wares['beer']}</Td>
            <Td>{wares['fabric']}</Td>
            <Td>{wares['furs']}</Td>
            <Td>{wares['wine']}</Td>
          </Tr>
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
              onClick={() => (building as PGrainFarm).setDesiredWorkers(0)}
            />
            <IconButton
              color="red.300"
              icon={<FiUserMinus />}
              aria-label="Fire one worker"
              onClick={() =>
                (building as PGrainFarm).decrementDesiredWorkers(5)
              }
            />
            <IconButton
              color="green.300"
              icon={<FiUserPlus />}
              aria-label="Add one workers"
              onClick={() =>
                (building as PGrainFarm).incrementDesiredWorkers(5)
              }
            />
            <IconButton
              color="green.500"
              icon={<FiUserCheck />}
              aria-label="Max workers"
              onClick={() => (building as PGrainFarm).setDesiredWorkers(100)}
            />
            <IconButton
              colorScheme="red"
              icon={<FiTrash />}
              aria-label="Destroy building"
              onClick={() => city.destroyBuilding(building.id)}
            />
          </ListItem>
        ))}
      </List>

      <Button
        onClick={() => {
          const productionSystem = new ProductionSystem({
            cityTreasury: city.treasury,
            storage: city.storage,
            treasury: playerTreasury,
            workforce: new Workforce({
              citizens: city.citizens,
              maxWorkers: 100,
              workers: 0,
            }),
          });
          const ActualGrainFarm = WithProductionSystem(GrainFarm);
          const farm = new ActualGrainFarm({
            owner: 'city',
            productionSystem,
          });
          city.build(farm);
        }}
      >
        Add grain farm
      </Button>
      <Button
        onClick={() => {
          const productionSystem = new ProductionSystem({
            cityTreasury: city.treasury,
            storage: city.storage,
            treasury: playerTreasury,
            workforce: new Workforce({
              citizens: city.citizens,
              maxWorkers: 100,
              workers: 0,
            }),
          });
          const ActualBrewery = WithProductionSystem(Brewery);
          const brewery = new ActualBrewery({
            owner: 'city',
            productionSystem,
          });
          city.build(brewery);
        }}
      >
        Add brewery
      </Button>
    </div>
  );
};

export default App;
