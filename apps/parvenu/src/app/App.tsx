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
import { GrainFarm } from '../domain/buildings/grain-farm';
import { builder } from '../domain/main';
import { Workforce } from '../domain/workforce';

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
  const wares = mapRef.current.storage.wares;
  const city = mapRef.current.city;
  const buildings = city.buildingsList;
  const citizens = city.citizens;
  return (
    <div>
      <h1>Welcome, Parvenu.</h1>
      <Heading as="h2">Settings</Heading>
      <Heading as={'h3'}>Speed</Heading>
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
            <Th>Wine</Th>
            <Th>Furs</Th>
            <Th>Fabric</Th>
            <Th>Beer</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{time}</Td>
            <Td>{wares['grain']}</Td>
            <Td>{wares['beer']}</Td>
            <Td>{wares['wine']}</Td>
            <Td>{wares['furs']}</Td>
            <Td>{wares['fabric']}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Heading as="h2">Buildings</Heading>
      <List>
        {buildings.map((building) => (
          <ListItem display={'flex'} gap={10} key={building.id}>
            Grain Farm {building.idNumber}:{' '}
            {(building as GrainFarm).workforce.workers} workers of{' '}
            {(building as GrainFarm).desiredWorkers} desired
            <IconButton
              color="red.500"
              icon={<FiUserX />}
              aria-label="Fire all workers"
              onClick={() => (building as GrainFarm).setDesiredWorkers(0)}
            />
            <IconButton
              color="red.300"
              icon={<FiUserMinus />}
              aria-label="Fire one worker"
              onClick={() => (building as GrainFarm).decrementDesiredWorkers(5)}
            />
            <IconButton
              color="green.300"
              icon={<FiUserPlus />}
              aria-label="Add one workers"
              onClick={() => (building as GrainFarm).incrementDesiredWorkers(5)}
            />
            <IconButton
              color="green.500"
              icon={<FiUserCheck />}
              aria-label="Max workers"
              onClick={() => (building as GrainFarm).setDesiredWorkers(100)}
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
          const farm = new GrainFarm({
            cityTreasury: city.treasury,
            owner: 'city',
            storage: city.storage,
            treasury: city.treasury,
            workforce: new Workforce({
              citizens: city.citizens,
              maxWorkers: 100,
              workers: 0,
            }),
          });
          city.build(farm);
        }}
      >
        Add grain farm
      </Button>
    </div>
  );
};

export default App;
