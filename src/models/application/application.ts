import { useState } from 'react'; 
import { Application, ApplicationHistory, ApplicationStatus, ApplicationForm } from '@/services/application/app.types'; 
import { message } from 'antd'; 
import { getLocalApplications, saveLocalApplications, getApplicationHistory, saveApplicationHistory } from '@/services/application';

export default function useApplicationModel() {
  const [applications, setApplications] = useState<Application[]>(getLocalApplications());
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [histories, setHistories] = useState<ApplicationHistory[]>(getApplicationHistory());

  const refresh = () => {
    setApplications(getLocalApplications());
    setHistories(getApplicationHistory());
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
  };

  const updateApplication = (id: string, data: Partial<Application>) => {
    const updatedList = applications.map((app) =>
      app.id === id ? { ...app, ...data, updatedAt: new Date().toISOString() } : app
    );
    saveLocalApplications(updatedList);
    setApplications(updatedList);
    message.success('Cập nhật đơn đăng ký thành công!');
  };

  const deleteApplication = (id: string) => {
    const filtered = applications.filter((a) => a.id !== id);
    saveLocalApplications(filtered);
    setApplications(filtered);
    message.success('Xoá đơn đăng ký thành công!');
  };

  const updateStatus = (id: string, status: ApplicationStatus, reason?: string) => {
    const updatedList = applications.map((app) =>
      app.id === id ? { ...app, status, note: reason || app.note, updatedAt: new Date().toISOString() } : app
    );
    saveLocalApplications(updatedList);
    setApplications(updatedList);

    const newHistory: ApplicationHistory = {
      id: crypto.randomUUID(),
      applicationId: id,
      action: status,
      reason,
      timestamp: new Date().toISOString(),
    };
    const newHistories = [...histories, newHistory];
    saveApplicationHistory(newHistories);
    setHistories(newHistories);
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
      action: status,
      reason,
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
