import { Modal, Descriptions, Button, message } from 'antd'; 
import { Application } from '@/services/application/app.types'; 
import { useModel } from 'umi';

interface Props { 
  application: Application; 
  onClose: () => void; 
}

const ApplicationDetail: React.FC<Props> = ({ application, onClose }) => { 
  const { updateStatus } = useModel('application.application');

  const handleAction = (status: 'Approved' | 'Rejected') => { 
    if (!application) {
      message.error('Không có đơn đăng ký để xử lý!');
      return;
    }
  
    if (status === 'Rejected') { 
      Modal.confirm({ 
        title: 'Từ chối đơn đăng ký', 
        content: ( 
          <> 
            <p>Bạn có chắc chắn muốn từ chối đơn này?</p> 
            <p>Hãy cập nhật lý do trong ghi chú.</p> 
          </> 
        ), 
        onOk: () => { 
          updateStatus(application.id, status); 
          message.success('Đã cập nhật đơn'); 
          onClose(); 
        }, 
      }); 
    } else { 
      updateStatus(application.id, status); 
      message.success('Đã cập nhật đơn'); 
      onClose(); 
    } 
  };
  

  return ( 
        <Modal
        visible={!!application}  // Đảm bảo modal chỉ hiển thị khi application không phải null hoặc undefined
        onCancel={onClose}
        footer={null}
        title="Chi tiết đơn đăng ký"
        >      
        <Descriptions column={1} bordered> 
        <Descriptions.Item label="Tên">{application ? application.fullName : 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Email">{application ? application.email : 'Chưa có thông tin'}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{application ? application.gender : 'Chưa có thông tin'}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{application ? application.address : 'Chưa có thông tin'}</Descriptions.Item> 
        <Descriptions.Item label="Sở trường">{application?.strengths || 'Chưa có thông tin'}</Descriptions.Item>
        <Descriptions.Item label="Câu lạc bộ">{application?.clubId || 'Chưa có thông tin'}</Descriptions.Item>
        <Descriptions.Item label="Lý do đăng ký">{application?.reason || 'Chưa có lý do'}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{application?.status || 'Chưa có trạng thái'}</Descriptions.Item>
        <Descriptions.Item label="Ghi chú">{application?.note || '---'}</Descriptions.Item>
        </Descriptions> 
      <div style={{ marginTop: 16, textAlign: 'right' }}> 
        <Button type="primary" onClick={() => handleAction('Approved')} style={{ marginRight: 8 }}> Duyệt </Button> 
        <Button danger onClick={() => handleAction('Rejected')}> Từ chối </Button> 
      </div> 
    </Modal> 
  ); 
};

export default ApplicationDetail;
