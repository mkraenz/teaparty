import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { User, useDb } from '@teaparty/react-firebase-database';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiTrash } from 'react-icons/fi';
import { useAppDispatch } from '../hooks/redux';
import { userDeleted } from '../users/users.slice';

type Props = {
  user: Pick<User, 'id' | 'username'>;
};

const DeleteUserButton: FC<Props> = ({ user }) => {
  const { t } = useTranslation();
  const { deleteUser: deleteDbUser } = useDb();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const deleteUser = async (username: string, id: string) => {
    setLoading(true);
    await deleteDbUser(id);
    const confirmed = window.confirm(
      `Delete: Are you sure you want to delete user '${username}' (ID ${id}) and all associated data to the user? This can not be undone!`
    );
    if (confirmed) {
      await deleteDbUser(id);
      dispatch(userDeleted(id));
    }
  };
  return (
    <Tooltip label={t('deleteUser')}>
      <IconButton
        onClick={() => deleteUser(user.username, user.id)}
        colorScheme="red"
        icon={<Icon as={FiTrash} />}
        aria-label={loading ? 'loading' : t('deleteUser')}
      />
    </Tooltip>
  );
};

export default DeleteUserButton;
