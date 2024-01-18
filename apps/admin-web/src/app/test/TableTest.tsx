import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { User, useDb } from '@teaparty/react-firebase-database';
import { DataTable } from '@teaparty/shared-ui';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { manyUsersUpserted, usersSelectors } from '../users/users.slice';
import Pagination from './Pagination';
import TableActions from './TableActions';

const columnHelper = createColumnHelper<User>();

const TableTest = () => {
  const { t } = useTranslation();
  const { listUsers } = useDb();
  const dispatch = useAppDispatch();
  const users = useAppSelector(usersSelectors.selectAll);
  const columns = useMemo<ColumnDef<User, string>[]>(
    () => [
      columnHelper.accessor('id', {
        cell: (info) => info.getValue(),
        header: t('id'),
      }),
      columnHelper.accessor('username', {
        cell: (info) => <p>{info.getValue()}</p>,
        header: t('username'),
      }),
      columnHelper.accessor('createdAt', {
        cell: (info) => t('intlDatetime', { val: new Date(info.getValue()) }),
        header: t('createdAt'),
      }),
      columnHelper.accessor('subscribedSince', {
        cell: (info) => info.getValue() ?? t('notAvailable'),
        header: t('subscribedSince'),
      }),
      columnHelper.display({
        cell: ({ row: { original: user } }) => <TableActions user={user} />,
        header: t('actions'),
      }),
    ],
    [t]
  );

  useEffect(() => {
    const loadUsers = async () => {
      const newUsers = await listUsers();
      dispatch(manyUsersUpserted(newUsers));
    };
    loadUsers().catch(console.error);
  }, [dispatch, listUsers]);
  return (
    <>
      <DataTable columns={columns} data={users} />
      <Pagination />
    </>
  );
};

export default TableTest;
