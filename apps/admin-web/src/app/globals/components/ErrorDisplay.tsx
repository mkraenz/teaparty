import { Button, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useRouteError } from 'react-router-dom';

const ErrorDisplay = () => {
  const nav = useNavigate();
  const error = useRouteError() as Error & {
    statusText?: string;
    status?: number;
  };

  const isHttpErrorCode =
    error.status && error.status > 400 && error.status < 600;
  return (
    <VStack h={'full'} justify="center">
      <Heading>Oops!</Heading>
      <br />
      <Text>Sorry, an unexpected error has occurred.</Text>
      <Text as="i">{error.statusText || error.message}</Text>
      <Button onClick={() => nav('/')}>Back to safety</Button>
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

export default ErrorDisplay;
