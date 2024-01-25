import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { User, useDb } from '@teaparty/react-firebase-database';
import { DataTable } from '@teaparty/shared-ui';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { manyUsersUpserted, usersSelectors } from '../users/users.slice';
import Pagination from './Pagination';
import TableActions from './TableActions';

const columnHelper = createColumnHelper<User>();

const TableTest = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasNext, setHasNext] = useState(true);
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
    const page = Number(searchParams.get('page')) || 1;
    const loadUsers = async () => {
      const limit = 5;
      const oldestLoadedUserCreatedAt =
        page === 1 ? undefined : users.at(-1)?.createdAt;
      const endAtCreationDate = oldestLoadedUserCreatedAt
        ? new Date(
            new Date(oldestLoadedUserCreatedAt).getTime() - 1
          ).toISOString()
        : undefined;
      const newUsers = await listUsers({
        limit,
        endAtCreationDate,
      });
      setHasNext(newUsers.length < limit);
      dispatch(manyUsersUpserted(newUsers));
    };
    loadUsers().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, listUsers, searchParams]);

  const onNext = () => {
    const page = Number(searchParams.get('page')) || 1;
    setSearchParams({ page: (page + 1).toString() });
  };

  return (
    <>
      <DataTable columns={columns} data={users} />
      <Pagination onNext={onNext} nextDisabled={hasNext} />
    </>
  );
};

export default TableTest;
