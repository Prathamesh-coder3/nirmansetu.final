import axios from 'axios';

// Relative URL so same server/Vercel router serves API and frontend
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nirmaansetu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler using React Router navigate instead of hard reload.
// CRITICAL: window.location.href = '/login' causes a full page reload
// which triggers the startup splash screen again — strictly forbidden.
// Instead, store a flag and let components/AuthContext react to it.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear token if one was set (avoid clearing on public endpoint attempts)
      const hadToken = !!localStorage.getItem('nirmaansetu_token');
      if (hadToken) {
        localStorage.removeItem('nirmaansetu_token');
        localStorage.removeItem('nirmaansetu_user');
        // Dispatch a custom event so AuthContext can react without a page reload
        window.dispatchEvent(new CustomEvent('nirmaansetu:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ============================================================
// Auth API
// ============================================================
export const authApi = {
  login: (usernameOrEmail: string, password: string) =>
    api.post('/auth/login', { usernameOrEmail, password }),
  register: (data: object) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('nirmaansetu_token');
    localStorage.removeItem('nirmaansetu_user');
  },
};

// ============================================================
// Analytics API
// ============================================================
export const analyticsApi = {
  workforceSummary: () => api.get('/analytics/workforce-summary'),
  skillGap: (district?: string) => api.get('/analytics/skill-gap', { params: { district } }),
  employmentOutcomes: () => api.get('/analytics/employment-outcomes'),
  trainingImpact: () => api.get('/analytics/training-impact'),
  locationWorkforce: () => api.get('/analytics/location-workforce'),
  forecast: (params?: object) => api.get('/analytics/forecast', { params }),
};

// ============================================================
// Workers API
// ============================================================
export const workersApi = {
  list: (params?: object) => api.get('/workers', { params }),
  get: (id: string) => api.get(`/workers/${id}`),
  myProfile: () => api.get('/workers/me/profile'),
  createProfile: (data: object) => api.post('/workers/me/profile', data),
  updateProfile: (data: object) => api.put('/workers/me/profile', data),
  addSkill: (data: object) => api.post('/workers/me/skills', data),
  stats: () => api.get('/workers/stats/summary'),
};

// ============================================================
// Projects API
// ============================================================
export const projectsApi = {
  list: (params?: object) => api.get('/projects', { params }),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: object) => api.post('/projects', data),
  update: (id: string, data: object) => api.put(`/projects/${id}`, data),
  requirements: (id: string) => api.get(`/projects/${id}/requirements`),
  addRequirement: (id: string, data: object) => api.post(`/projects/${id}/requirements`, data),
  stats: () => api.get('/projects/stats'),
};

// ============================================================
// Requirements API (workforce requirements listings)
// ============================================================
export const requirementsApi = {
  list: (params?: object) => api.get('/requirements', { params }),
  get: (id: string) => api.get(`/requirements/${id}`),
  create: (data: object) => api.post('/requirements', data),
  update: (id: string, data: object) => api.put(`/requirements/${id}`, data),
};

// ============================================================
// Applications API
// ============================================================
export const applicationsApi = {
  apply: (requirementId: string) => api.post('/applications', { requirementId }),
  myApplications: () => api.get('/applications/my'),
  list: (params?: object) => api.get('/applications', { params }),
  get: (id: string) => api.get(`/applications/${id}`),
  updateStatus: (id: string, status: string, data?: object) =>
    api.put(`/applications/${id}/status`, { status, ...data }),
  withdraw: (id: string) => api.put(`/applications/${id}/withdraw`),
  stats: () => api.get('/applications/stats'),
};

// ============================================================
// Matching API
// ============================================================
export const matchingApi = {
  findMatches: (requirementId: string, minScore?: number) =>
    api.get(`/matching/requirement/${requirementId}`, { params: { minScore } }),
  computeScore: (workerId: string, requirementId: string) =>
    api.get('/matching/score', { params: { workerId, requirementId } }),
};

// ============================================================
// Training API
// ============================================================
export const trainingApi = {
  programs: (params?: object) => api.get('/training/programs', { params }),
  program: (id: string) => api.get(`/training/programs/${id}`),
  enroll: (id: string) => api.post(`/training/programs/${id}/enroll`),
  myEnrollments: () => api.get('/training/my-enrollments'),
  createProgram: (data: object) => api.post('/training/programs', data),
};

// ============================================================
// Skills API
// ============================================================
export const skillsApi = {
  list: (params?: object) => api.get('/skills', { params }),
  get: (id: string) => api.get(`/skills/${id}`),
};

// ============================================================
// Employment API
// ============================================================
export const employmentApi = {
  myRecords: () => api.get('/employment/my'),
  list: (params?: object) => api.get('/employment', { params }),
  get: (id: string) => api.get(`/employment/${id}`),
  create: (data: object) => api.post('/employment', data),
  update: (id: string, data: object) => api.put(`/employment/${id}`, data),
};
