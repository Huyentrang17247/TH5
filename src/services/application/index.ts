import { Application, ApplicationHistory } from '@/services/application/app.types';

const APPLICATION_KEY = 'club_applications'; 
const HISTORY_KEY = 'application_action_histories';

export const getLocalApplications = (): Application[] => { 
  const raw = localStorage.getItem(APPLICATION_KEY); 
  return raw ? JSON.parse(raw) : []; 
};

export const saveLocalApplications = (data: Application[]) => { 
  localStorage.setItem(APPLICATION_KEY, JSON.stringify(data)); 
};

export const getApplicationHistory = (): ApplicationHistory[] => { 
  const raw = localStorage.getItem(HISTORY_KEY); 
  return raw ? JSON.parse(raw) : []; 
};

export const saveApplicationHistory = (data: ApplicationHistory[]) => { 
  localStorage.setItem(HISTORY_KEY, JSON.stringify(data)); 
};