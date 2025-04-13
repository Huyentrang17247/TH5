import { Modal, Table } from 'antd';
import type { FC } from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ApplicationHistory: FC<Props> = ({ visible, onClose }) => {
  const history = JSON.parse(localStorage.getItem('appHistories') || '[]');

  const columns = [
    { title: 'Hành động', dataIndex: 'action' },
    { title: 'Người thực hiện', dataIndex: 'operator' },
    { 
      title: 'Thời gian', 
      dataIndex: 'timestamp',
      render: (text: string) => new Date(text).toLocaleString()
    },
  ];

  return (
    <Modal visible={visible} onCancel={onClose} onOk={onClose} title="Lịch sử thao tác" width={700}>
      <Table
        columns={columns}
        dataSource={history}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default ApplicationHistory;
