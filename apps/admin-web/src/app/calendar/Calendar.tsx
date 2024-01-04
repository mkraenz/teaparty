import { Button, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {}

const Calendar: FC<Props> = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  return (
    <>
      <Text>{t('appName')}</Text>
      <Button onClick={() => nav('/')}>Home</Button>
    </>
  );
};

export default Calendar;
