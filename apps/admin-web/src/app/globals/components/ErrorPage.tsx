import { Button, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const error = useRouteError() as Error & {
    statusText?: string;
    status?: number;
  };

  const isHttpErrorCode =
    error.status && error.status > 400 && error.status < 600;
  return (
    <VStack h={'full'} justify="center">
      <Heading>{t('Oops!')}</Heading>
      <br />
      <Text>{t('Sorry, an error occurred.')}</Text>
      <Text as="i">{error.statusText || error.message}</Text>
      <Button onClick={() => nav('/')}>{t('Back to safety')}</Button>
      <br />
      {isHttpErrorCode && (
        <Image
          src={`https://http.cat/images/${error.status}.jpg`}
          alt={error.statusText}
          maxH={'50%'}
        />
      )}
    </VStack>
  );
};

export default ErrorPage;
