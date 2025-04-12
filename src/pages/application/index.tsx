import { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Popconfirm, Space, Tag, message, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ApplicationForm from '@/pages/application/components/ApplicationForm';
import ApplicationDetail from '@/pages/application/components/ApplicationDetail';
import { Application, ApplicationStatus } from '@/services/application/app.types';

export default function ApplicationPage() {
  const {
    applications,
    selectedRowKeys,
    setSelectedRowKeys,
    deleteApplication,
    updateApplication,
    bulkUpdateStatus,
    addApplication, // Đảm bảo có hàm addApplication
  } = useModel('application.application');

  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const handleDelete = (id: string) => {
    deleteApplication(id);
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setFormVisible(true);
  };

  const handleView = (app: Application) => {
    setViewingApp(app);
  };

  const handleApproveSelected = () => {
    if (selectedRowKeys.length === 0) return;
    bulkUpdateStatus(selectedRowKeys as string[], 'Approved');
    setSelectedRowKeys([]);
  };

  const handleRejectSelected = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: `Từ chối ${selectedRowKeys.length} đơn đăng ký`,
      content: 'Bạn có chắc chắn muốn từ chối các đơn này?',
      onOk() {
        bulkUpdateStatus(selectedRowKeys as string[], 'Rejected', 'Từ chối hàng loạt');
        setSelectedRowKeys([]);
      },
    });
  };

  const columns: ColumnsType<Application> = [
    {
      title: 'Tên',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },
    {
      title: 'Sở trường',
      dataIndex: 'strengths',
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: ApplicationStatus) => {
        let color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'gold';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleView(record)}>Xem</Button>
          <Button size="small" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xoá đơn này?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => { 
          setEditingApp(null); 
          setFormVisible(true); 
        }}>
          Thêm đơn
        </Button>        
        <Button onClick={handleApproveSelected}>Duyệt {selectedRowKeys.length} đơn</Button>
        <Button danger onClick={handleRejectSelected}>Từ chối {selectedRowKeys.length} đơn</Button>
      </Space>
      <Table
        rowKey="id"
        dataSource={applications}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{ pageSize: 5 }}
      />

      <ApplicationForm
        visible={formVisible}  // Sử dụng visible thay vì open
        onCancel={() => setFormVisible(false)}
        onSubmit={(data) => {
          if (editingApp) {
            updateApplication(editingApp.id, data);
          } else {
            addApplication(data); // Gọi hàm addApplication để thêm đơn đăng ký
          }
          setFormVisible(false);  // Đảm bảo đóng modal khi đã xử lý
        }}
        initialValues={editingApp || undefined}
      />

      <ApplicationDetail
        application={viewingApp}
        onClose={() => setViewingApp(null)}
        visible={!!viewingApp}  // Sử dụng visible thay vì open
      />
    </div>
  );
}
