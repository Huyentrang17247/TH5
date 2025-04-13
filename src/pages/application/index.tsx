import { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Popconfirm, Space, Tag, message, Modal, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ApplicationForm from '@/pages/application/components/ApplicationForm';
import ApplicationDetail from '@/pages/application/components/ApplicationDetail';
import ApplicationHistory from '@/pages/application/components/ApplicationHistory';
import { Application, ApplicationStatus } from '@/services/application/app.types';

export default function ApplicationPage() {
  const {
    applications,
    selectedRowKeys,
    setSelectedRowKeys,
    deleteApplication,
    updateApplication,
    bulkUpdateStatus,
    addApplication,
  } = useModel('application.application');

  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);

  const addHistory = (action: string, operator: string, reason?: string) => {
    const histories = JSON.parse(localStorage.getItem('appHistories') || '[]');
    histories.unshift({
      id: `${Date.now()}`,
      action,
      operator,
      reason,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('appHistories', JSON.stringify(histories));
  };

  const handleDelete = (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (app) {
      deleteApplication(id);
      addHistory(`Xoá đơn ${app.fullName}`, 'Admin');
    }
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
    addHistory(`Duyệt ${selectedRowKeys.length} đơn`, 'Admin');
    setSelectedRowKeys([]);
  };

  const handleRejectSelected = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: `Từ chối ${selectedRowKeys.length} đơn đăng ký`,
      content: 'Bạn có chắc chắn muốn từ chối các đơn này?',
      onOk() {
        bulkUpdateStatus(selectedRowKeys as string[], 'Rejected', 'Từ chối hàng loạt');
        addHistory(`Từ chối ${selectedRowKeys.length} đơn`, 'Admin', 'Từ chối hàng loạt');
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
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button type="primary" onClick={() => { 
              setEditingApp(null); 
              setFormVisible(true); 
            }}>
              Thêm đơn
            </Button>        
            <Button onClick={handleApproveSelected}>Duyệt {selectedRowKeys.length} đơn</Button>
            <Button danger onClick={handleRejectSelected}>Từ chối {selectedRowKeys.length} đơn</Button>
          </Space>
        </Col>
        <Col>
          <Button onClick={() => setHistoryVisible(true)}>Xem lịch sử thao tác</Button>
        </Col>
      </Row>

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
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={(data) => {
          if (editingApp) {
            updateApplication(editingApp.id, data);
            if (data.status === 'Approved') {
              addHistory(`Duyệt đơn ${editingApp.fullName}`, 'Admin');
            } else if (data.status === 'Rejected') {
              addHistory(`Từ chối đơn ${editingApp.fullName}`, 'Admin', data.note || 'Không ghi lý do');
            } else {
              addHistory(`Cập nhật đơn ${editingApp.fullName}`, 'Admin');
            }
          } else {
            addApplication(data);
            addHistory(`Thêm đơn ${data.fullName}`, 'Admin');
          }
          setFormVisible(false);
        }}        
        initialValues={editingApp || undefined}
      />

      <ApplicationDetail
        application={viewingApp}
        onClose={() => setViewingApp(null)}
        visible={!!viewingApp}
        addHistory={addHistory} // Truyền addHistory vào đây
      />

      <ApplicationHistory
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
      />
    </div>
  );
}
