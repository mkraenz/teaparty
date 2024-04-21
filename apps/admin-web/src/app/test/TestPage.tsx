import { Button, HStack, VStack } from '@chakra-ui/react';
import { useDb } from '@teaparty/react-firebase-database';
import { useFirebaseRemoteConfig } from '@teaparty/react-firebase-remote-config';
import { Searchbar } from '@teaparty/shared-ui';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../hooks/redux';
import TableTest from './TableTest';

const TestPage = () => {
  const { t } = useTranslation();
  const { createUser, findUserByUsername, error } = useDb();
  const dispatch = useAppDispatch();
  const featureFlags = useFirebaseRemoteConfig();
  featureFlags.getFeatureFlagAsNumber('testflagnumber');
  featureFlags.getFeatureFlagAsString('testflagstring');

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
    if (featureFlags.getFeatureFlagAsBoolean('testflag')) {
      alert('feature is enabled');
    } else {
      alert('feature is currently disabled');
    }
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
