import { Divider, VStack } from '@chakra-ui/react';
import { FirebaseFunctionsState } from '@teaparty/react-firebase-functions';
import { FC, Fragment } from 'react';
import CloudFunction from './CloudFunction';

const data: {
  name: string;
  description: string;
  functionName: keyof FirebaseFunctionsState;
}[] = [
  {
    name: 'Fn1',
    description: 'Migrates data blabla',
    functionName: 'createSubscription',
  },
  {
    name: 'Migrate subscribers',
    description: 'Changes the structure of the subscribers to v0.1.7',
    functionName: 'createSubscription',
  },
];

const FunctionsPage: FC = () => {
  return (
    <VStack>
      {data.map((item) => (
        <Fragment key={item.name}>
          <CloudFunction {...item} />
          <Divider />
        </Fragment>
      ))}
    </VStack>
  );
};

export default FunctionsPage;
