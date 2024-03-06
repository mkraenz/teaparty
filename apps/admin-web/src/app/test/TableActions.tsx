import { HStack, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { User, useDb } from '@teaparty/react-firebase-database';
import { useFirebaseFunctions } from '@teaparty/react-firebase-functions';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBell, FiBellOff, FiTrash } from 'react-icons/fi';
import { useAppDispatch } from '../hooks/redux';
import { userDeleted } from '../users/users.slice';

type Props = {
  user: User;
};

const TableActions: FC<Props> = ({ user }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { createSubscription } = useFirebaseFunctions();
  const { deleteUser: deleteDbUser } = useDb();
  const deleteUser = async (username: string, id: string) => {
    const confirmed = window.confirm(
      `Delete: Are you sure you want to delete user '${username}' (ID ${id}) and all associated data to the user? This can not be undone!`
    );
    if (confirmed) {
      await deleteDbUser(id);
      dispatch(userDeleted(id));
    }
  };
  const subscribeUser = async (username: string, id: string) => {
    const confirmed = window.confirm(
      `Subscribe: Are you sure you want to subscribe user '${username}' (ID ${id})?`
    );
    if (confirmed) {
      const res = await createSubscription();
      console.log(res);
    }
  };
  const unsubscribeUser = (username: string, id: string) => {
    window.confirm(
      `Unsubscribe: Are you sure you want to unsubscribe user '${username}' (ID ${id})?`
    );
  };
  const changeEmail = async (username: string, id: string) => {
    const confirmed = window.confirm(
      `Change email: Are you sure you want to change the email of user '${username}' (ID ${id}) to typescriptteatime+0206@gmail.com?`
    );
    if (confirmed) {
      const res = await createSubscription();
      console.log(res);
    }
  };

  return (
    <HStack>
      {user.subscribed ? (
        <Tooltip label={t('Unsubscribe user')}>
          <IconButton
            onClick={() => unsubscribeUser(user.username, user.id)}
            colorScheme="orange"
            icon={<Icon as={FiBellOff} />}
            aria-label={t('Unsubscribe user')}
          />
        </Tooltip>
      ) : (
        <Tooltip label={t('Subscribe user')}>
          <IconButton
            onClick={() => subscribeUser(user.username, user.id)}
            icon={<Icon as={FiBell} />}
            aria-label={t('Subscribe user')}
          />
        </Tooltip>
      )}

      <Tooltip label={t('Delete user')}>
        <IconButton
          onClick={() => deleteUser(user.username, user.id)}
          colorScheme="red"
          icon={<Icon as={FiTrash} />}
          aria-label={t('Delete user')}
        />
      </Tooltip>

      <Tooltip label={t('Change Email')}>
        <IconButton
          onClick={() => changeEmail(user.username, user.id)}
          colorScheme="red"
          icon={<Icon as={FiTrash} />}
          aria-label={t('Change Email')}
        />
      </Tooltip>
    </HStack>
  );
};

export default TableActions;
