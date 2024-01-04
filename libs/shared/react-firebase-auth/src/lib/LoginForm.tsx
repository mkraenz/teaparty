import {
  Button,
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/auth';

type FormData = {
  email: string;
  password: string;
};

const LoginForm: FC = () => {
  const { error, signIn } = useAuth();
  const nav = useNavigate();
  const { t } = useTranslation();
  const [passwordShown, showPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    await signIn(data);
    nav('/');
  });
  const togglePasswordVisibility = () => showPassword(!passwordShown);

  return (
    <form onSubmit={onSubmit}>
      <VStack>
        <FormControl isInvalid={Boolean(errors.email)}>
          <Input
            type="email"
            id="email"
            placeholder={t('Email')}
            {...register('email', {
              required: t('This is required'),
              minLength: {
                value: 4,
                message: t('Minimum length should be 4'),
              },
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$/,
                message: t('Invalid email address'),
              },
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.password)}>
          <InputGroup size="md">
            <Input
              type={passwordShown ? 'text' : 'password'}
              id="password"
              placeholder={t('Password')}
              {...register('password', {
                required: t('This is required'),
                minLength: {
                  value: 8,
                  message: t('Minimum length should be 8'),
                },
              })}
            />
            <InputRightElement>
              <IconButton
                onClick={togglePasswordVisibility}
                icon={<Icon as={passwordShown ? FiEyeOff : FiEye} />}
                aria-label={
                  passwordShown ? t('Hide password') : t('Show password')
                }
                size={'xs'}
                variant={'outline'}
                color={'gray.500'}
                _hover={{
                  color: 'blue.500',
                }}
              ></IconButton>
            </InputRightElement>
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </InputGroup>
        </FormControl>
        <Button mt={4} isLoading={isSubmitting} type="submit">
          {t('signin')}
        </Button>
        <Text color="red">{error && t('Invalid credentials.')}</Text>
      </VStack>
    </form>
  );
};

export default LoginForm;
