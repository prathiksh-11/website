import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmOptions {
  title?: string;
  content?: string;
  onOk: () => void | Promise<void>;
}

export const confirmDelete = ({
  title = 'Delete item?',
  content = 'This action cannot be undone.',
  onOk,
}: ConfirmOptions) => {
  Modal.confirm({
    title,
    content,
    icon: <ExclamationCircleOutlined />,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk,
  });
};
