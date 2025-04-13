import { useState } from 'react'; 
import { Application, ApplicationStatus, ApplicationForm, ApplicationHistory } from '@/services/application/app.types'; 
import { message } from 'antd'; 
import { getLocalApplications, saveLocalApplications, getApplicationHistory, saveApplicationHistory } from '@/services/application';

function formatVNTime(date: string | Date) {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${hours}h${minutes} ${day}/${month}/${year}`;
}

export default function useApplicationModel() {
  const [applications, setApplications] = useState<Application[]>(getLocalApplications());
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [histories, setHistories] = useState<ApplicationHistory[]>(getApplicationHistory());

  const refresh = () => {
    setApplications(getLocalApplications());
    setHistories(getApplicationHistory());
  };

  const recordHistory = (applicationId: string, action: string, reason?: string) => {
    const time = formatVNTime(new Date());
    const description = reason
      ? `Admin đã ${action} vào lúc ${time} với lý do: ${reason}`
      : `Admin đã ${action} vào lúc ${time}`;
    const newLog: ApplicationHistory = {
      id: crypto.randomUUID(),
      applicationId,
      description,
      timestamp: new Date().toISOString(),
    };
    const newHistories = [...histories, newLog];
    saveApplicationHistory(newHistories);
    setHistories(newHistories);
  };

  const addApplication = (data: ApplicationForm) => {
    const newApp: Application = {
      ...data,
      id: crypto.randomUUID(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const newList = [newApp, ...applications];
    saveLocalApplications(newList);
    setApplications(newList);
    message.success('Thêm đơn đăng ký thành công!');

    recordHistory(newApp.id, 'tạo đơn đăng ký');
  };

  const updateApplication = (id: string, data: Partial<Application>) => {
    const updatedList = applications.map((app) =>
      app.id === id ? { ...app, ...data, updatedAt: new Date().toISOString() } : app
    );
    saveLocalApplications(updatedList);
    setApplications(updatedList);
    message.success('Cập nhật đơn đăng ký thành công!');

    recordHistory(id, 'cập nhật đơn đăng ký');
  };

  const deleteApplication = (id: string) => {
    const filtered = applications.filter((a) => a.id !== id);
    saveLocalApplications(filtered);
    setApplications(filtered);
    message.success('Xoá đơn đăng ký thành công!');
    // Không ghi log khi xóa
  };

  const updateStatus = (id: string, status: ApplicationStatus, reason?: string) => {
    const updatedList = applications.map((app) =>
      app.id === id ? { ...app, status, note: reason || app.note, updatedAt: new Date().toISOString() } : app
    );
    saveLocalApplications(updatedList);
    setApplications(updatedList);

    recordHistory(id, status, reason);
  };

  const bulkUpdateStatus = (ids: string[], status: ApplicationStatus, reason?: string) => {
    const updatedList = applications.map((app) =>
      ids.includes(app.id)
        ? { ...app, status, note: reason, updatedAt: new Date().toISOString() }
        : app
    );
    saveLocalApplications(updatedList);
    setApplications(updatedList);

    const newHistories: ApplicationHistory[] = ids.map((id) => ({
      id: crypto.randomUUID(),
      applicationId: id,
      description: reason
        ? `Admin đã ${status} vào lúc ${formatVNTime(new Date())} với lý do: ${reason}`
        : `Admin đã ${status} vào lúc ${formatVNTime(new Date())}`,
      timestamp: new Date().toISOString(),
    }));

    const merged = [...histories, ...newHistories];
    saveApplicationHistory(merged);
    setHistories(merged);
    message.success(`Đã cập nhật ${ids.length} đơn`);
  };

  return {
    applications,
    selectedRowKeys,
    setSelectedRowKeys,
    addApplication,
    updateApplication,
    deleteApplication,
    bulkUpdateStatus,
    updateStatus,
    refresh,
    histories,
  };
}
