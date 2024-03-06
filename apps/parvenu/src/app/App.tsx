import {
  Button,
  Heading,
  IconButton,
  List,
  ListItem,
  Table,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiUserCheck, FiUserMinus, FiUserPlus, FiUserX } from 'react-icons/fi';
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
  const buildings = Object.values(city.buildings);
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
            <th>Time</th>
            <th>Grain</th>
            <th>Wine</th>
            <th>Furs</th>
            <th>Fabric</th>
            <th>Beer</th>
          </Tr>
        </Thead>
        <tbody>
          <tr>
            <td>{time}</td>
            <td>{wares['grain']}</td>
            <td>{wares['beer']}</td>
            <td>{wares['wine']}</td>
            <td>{wares['furs']}</td>
            <td>{wares['fabric']}</td>
          </tr>
        </tbody>
      </Table>
      <Heading as="h2">Buildings</Heading>
      <List>
        {buildings.map((building) => (
          <ListItem display={'flex'} gap={10}>
            Grain Farm: {(building as GrainFarm).workforce.workers} workers of{' '}
            {(building as GrainFarm).desiredWorkers} desired
            <IconButton
              icon={<FiUserX />}
              aria-label="Fire all workers"
              onClick={() => (building as GrainFarm).setDesiredWorkers(0)}
            />
            <IconButton
              icon={<FiUserMinus />}
              aria-label="Fire one worker"
              onClick={() => (building as GrainFarm).decrementDesiredWorkers(5)}
            />
            <IconButton
              icon={<FiUserPlus />}
              aria-label="Add one workers"
              onClick={() => (building as GrainFarm).incrementDesiredWorkers(5)}
            />
            <IconButton
              icon={<FiUserCheck />}
              aria-label="Max workers"
              onClick={() => (building as GrainFarm).setDesiredWorkers(100)}
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
