import {
  Button,
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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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

const map = builder();

export const App = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
      map.city.passDay();
    }, 1000);
    return () => clearInterval(interval);
  });
  const wares = map.storage.wares;
  const city = map.city;
  const buildings = city.buildingsList;
  const citizens = city.citizens;
  return (
    <div>
      <h1>Welcome, Parvenu.</h1>
      <Heading as="h2">Citizens</Heading>
      <List>
        <ListItem>Beggars: {citizens.beggars}</ListItem>
        <ListItem>Poor: {citizens.poor}</ListItem>
        <ListItem>Middle: {citizens.middle}</ListItem>
        <ListItem>Rich: {citizens.rich}</ListItem>
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
          <ListItem display={'flex'} gap={10}>
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
          const city = map.city;
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
          map.city.build(farm);
        }}
      >
        Add grain farm
      </Button>
    </div>
  );
};

export default App;
