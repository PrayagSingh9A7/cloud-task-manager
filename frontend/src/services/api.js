import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('tasksphere_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

export const taskAPI = {
    getTasks: (params) => api.get('/tasks', { params }),
    createTask: (task) => api.post('/tasks', task),
    updateTask: (id, updates) => api.put(`/tasks/${id}`, updates),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
    patchStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
    duplicateTask: (id) => api.post(`/tasks/${id}/duplicate`)
};

export const analyticsAPI = {
    getSummary: () => api.get('/analytics'),
    getCalendar: () => api.get('/analytics/calendar')
};

export default api;