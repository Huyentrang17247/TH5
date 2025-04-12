import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs'; // Đảm bảo bạn đã cài dayjs để xử lý ngày

const { Option } = Select;

interface ApplicationFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const ApplicationFormModal: React.FC<ApplicationFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...initialValues,
        appliedDate: initialValues?.appliedDate ? dayjs(initialValues.appliedDate) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values: any) => {
    const formatted = {
      ...values,
      appliedDate: values.appliedDate?.toISOString() || '',
    };
    onSubmit(formatted);
  };

  return (
    <Modal
      visible={visible}
      title={initialValues ? 'Cập nhật đơn đăng ký' : 'Thêm đơn đăng ký'}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          name="strengths"
          label="Sở trường"
          rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}
        >
          <Input placeholder="Vui lòng nhập sở trường" />
        </Form.Item>

        <Form.Item
          name="clubId"
          label="Câu lạc bộ"
          rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
        >
          <Select placeholder="Chọn câu lạc bộ">
            <Option value="1">CLB Âm nhạc</Option>
            <Option value="2">CLB Kỹ năng</Option>
            <Option value="3">CLB Bóng đá</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="reason"
          label="Lý do đăng ký"
          rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập lý do" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApplicationFormModal;
