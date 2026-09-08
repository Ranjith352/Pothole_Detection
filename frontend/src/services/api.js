import axios from 'axios';

const getInitialApiUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl !== 'http://localhost:8000') {
    envUrl = envUrl.trim().replace(/\/+$/, '');
    if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
      envUrl = `https://${envUrl}`;
    }
    return envUrl;
  }
  // Use 127.0.0.1 to avoid Windows IPv6 localhost resolution mismatch
  return 'http://127.0.0.1:8000';
};

let currentApiUrl = getInitialApiUrl();

const apiClient = axios.create({
  baseURL: `${currentApiUrl}/api`,
  timeout: 60000,
});

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (err) {
    if (currentApiUrl.includes('localhost')) {
      currentApiUrl = 'http://127.0.0.1:8000';
      apiClient.defaults.baseURL = `${currentApiUrl}/api`;
      const retryRes = await apiClient.get('/health');
      return retryRes.data;
    }
    throw err;
  }
};

export const predictImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await apiClient.post('/detection/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const get3DSurfaceData = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await apiClient.post('/detection/3d', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getHistory = async (params = {}) => {
  const response = await apiClient.get('/history', { params });
  return response.data;
};

export const getStatistics = async () => {
  const response = await apiClient.get('/statistics');
  return response.data;
};

export const downloadReportUrl = `${currentApiUrl}/api/reports/generate`;

export const submitFeedback = async (data) => {
  const response = await apiClient.post('/feedback', data);
  return response.data;
};

export const getFeedbackList = async () => {
  const response = await apiClient.get('/feedback');
  return response.data;
};

export const getComplaintInfo = async () => {
  const response = await apiClient.get('/complaint/info');
  return response.data;
};

export const getFullImageUrl = (relativePath) => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  return `${currentApiUrl}${relativePath}`;
};
