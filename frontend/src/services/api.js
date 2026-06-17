const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('trip_token');
  
  const headers = {
    ...options.headers,
  };

  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      
      if (response.status === 401) {
        localStorage.removeItem('trip_token');
        localStorage.removeItem('trip_user');
        
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
};

const api = {
  
  auth: {
    register: (username, email, password) => 
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    getMe: () => request('/auth/me'),
  },

  
  itinerary: {
    upload: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return request('/itineraries/upload', {
        method: 'POST',
        body: formData,
      });
    },
    generate: (title, destination, startDate, endDate, bookings) =>
      request('/itineraries/generate', {
        method: 'POST',
        body: JSON.stringify({ title, destination, startDate, endDate, bookings }),
      }),
    getAll: () => request('/itineraries'),
    getOne: (id) => request(`/itineraries/${id}`),
    update: (id, data) =>
      request(`/itineraries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/itineraries/${id}`, {
        method: 'DELETE',
      }),
    toggleShare: (id) =>
      request(`/itineraries/${id}/share`, {
        method: 'POST',
      }),
    getPublic: (shareId) => request(`/itineraries/public/${shareId}`),
  },
};

export default api;
