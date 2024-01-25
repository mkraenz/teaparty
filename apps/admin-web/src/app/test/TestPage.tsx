import { Button, HStack, Heading, VStack } from '@chakra-ui/react';
import { useDb } from '@teaparty/react-firebase-database';
import { Searchbar } from '@teaparty/shared-ui';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../hooks/redux';
import { userAdded } from '../users/users.slice';
import TableTest from './TableTest';

const TestPage = () => {
  const { t } = useTranslation();
  const { createUser, findUserByUsername, error } = useDb();
  const dispatch = useAppDispatch();

  const handleSearch = async (query: string) => {
    /*
     * fetch backend
      show results
     */

    const results = await findUserByUsername(query);
    console.log({ results });
    // TODO show the result data
  };
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
        <Searchbar onSearch={handleSearch} maxW={'xs'} />
        <Button onClick={handlePress}>{t('userAdd')}</Button>
      </HStack>
      <TableTest />;
    </VStack>
  );
};

export default TestPage;
