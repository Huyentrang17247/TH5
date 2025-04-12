export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Application { 
  id: string; 
  fullName: string; 
  email: string; 
  gender: 'Nam' | 'Nữ'; 
  address: string; 
  strengths: string; 
  clubId: string; 
  reason: string; 
  status: ApplicationStatus; 
  note?: string; 
  createdAt: string; 
  updatedAt?: string; 
}

export interface ApplicationForm { 
  fullName: string; 
  email: string; 
  gender: 'Nam' | 'Nữ'; 
  address: string; 
  strengths: string; 
  clubId: string; 
  reason: string; 
}

export interface ApplicationHistory { 
  id: string; 
  applicationId: string; 
  action: ApplicationStatus; 
  reason?: string; 
  timestamp: string; 
}

export interface Club {
  id: string;
  name: string;
  establishedDate: string; // ISO string: "2025-04-10"
  description: string; // HTML content (TinyEditor)
  president: string;
  isActive: boolean;
  avatar?: string; // URL ảnh
}
