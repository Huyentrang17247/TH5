import { Modal, Timeline } from 'antd';
import { useModel } from 'umi';
import type { ApplicationHistory } from '@/services/application/app.types';

interface Props {
  visible: boolean;
  onClose: () => void;
  id: string;
}

const ApplicationHistory: React.FC<Props> = ({ visible, onClose, id }) => {
  const { histories }: { histories: ApplicationHistory[] } = useModel('application.application');

  // Lọc lịch sử theo ID
  const list: ApplicationHistory[] = Array.isArray(histories)
    ? histories.filter((h) => h.applicationId === id)
    : [];

  return (
    <Modal
      visible={visible}
      title="Lịch sử thao tác"
      onCancel={onClose}
      onOk={onClose}
      footer={null}
    >
      <Timeline>
        {list.length > 0 ? (
          list.map((entry, index) => (
            <Timeline.Item key={index}>
              {`${entry.timestamp ?? 'Không rõ thời gian'} - ${entry.action ?? 'Không rõ hành động'}`}
            </Timeline.Item>
          ))
        ) : (
          <Timeline.Item>Không có lịch sử nào</Timeline.Item>
        )}
      </Timeline>
    </Modal>
  );
};

export default ApplicationHistory;
