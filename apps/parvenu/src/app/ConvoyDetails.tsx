import { Heading, Table } from '@chakra-ui/react';
import { FC } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useWorld } from './GameProvider';
import ToWorldmapButton from './ToWorldmapButton';

type Props = {};

const ConvoyDetails: FC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const world = useWorld();

  if (!id) return <Navigate to="/" />;

  const convoy = world.convoys[id];

  if (!convoy) return <Navigate to="/" />;
  return (
    <div>
      <ToWorldmapButton />
      <Heading>Convoy "{convoy.label}"</Heading>
      <Heading as="h2" size="md">
        Storage
      </Heading>

      <Table>
        <thead>
          <tr>
            <th>Good</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {convoy.storage.waresList
            .filter((x) => x.amount !== 0)
            .map(({ amount, type }) => (
              <tr key={type}>
                <td>{type}</td>
                <td>{amount}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ConvoyDetails;
