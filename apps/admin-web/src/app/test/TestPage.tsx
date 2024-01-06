import { Button, HStack, VStack } from '@chakra-ui/react';
import { useDb } from '@teaparty/react-firebase-database';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../hooks/redux';
import { userAdded } from '../users/users.slice';
import TableTest from './TableTest';

const TestPage = () => {
  const { t } = useTranslation();
  const { createUser } = useDb();
  const dispatch = useAppDispatch();

  const handlePress = async () => {
    const user = await createUser({
      username: 'Hella Fella',
      subscribed: false,
    });
    dispatch(userAdded(user));
  };
  return (
    <VStack>
      <HStack width={'full'} justify={'flex-end'}>
        <Button onClick={handlePress}>{t('userAdd')}</Button>
      </HStack>
      <TableTest />;
    </VStack>
  );
};

export default TestPage;
