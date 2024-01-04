import { Button } from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './hooks/auth';

interface Props {
  afterSignout: () => void;
}

export const LogoutButton: FC<Props> = ({ afterSignout }) => {
  const { loading, signOut } = useAuth();
  const { t } = useTranslation();
  const handleClick = async () => {
    await signOut();
    afterSignout();
  };
  return (
    <Button onClick={handleClick} isLoading={loading}>
      {t('signout')}
    </Button>
  );
};

export default LogoutButton;
