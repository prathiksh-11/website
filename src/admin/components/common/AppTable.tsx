import { Empty, Skeleton, Table, type TableProps } from 'antd';
import { memo } from 'react';
import { PAGE_SIZE_OPTIONS } from '@/constants';

interface AppTableProps<T extends object> extends TableProps<T> {
  loading?: boolean;
  emptyText?: string;
}

const AppTableInner = <T extends object>({
  loading,
  emptyText = 'No data found',
  pagination,
  ...props
}: AppTableProps<T>) => {
  if (loading && !props.dataSource?.length) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  return (
    <Table<T>
      rowKey="id"
      scroll={{ x: true }}
      locale={{ emptyText: <Empty description={emptyText} /> }}
      loading={loading}
      pagination={
        pagination === false
          ? false
          : {
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
              showTotal: (total) => `${total} items`,
              ...pagination,
            }
      }
      {...props}
    />
  );
};

export const AppTable = memo(AppTableInner) as typeof AppTableInner;
