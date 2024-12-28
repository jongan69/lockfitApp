import axios from 'axios';
import { Workout, Program } from '../types/workout';

const api = axios.create({
  baseURL: 'YOUR_API_URL',
});

export const workoutApi = {
  // Sync workout history with server
  syncWorkouts: async (workouts: Workout[]) => {
    try {
      const response = await api.post('/workouts/sync', { workouts });
      return response.data;
    } catch (error) {
      console.error('Error syncing workouts:', error);
      throw error;
    }
  },

  // Get available programs
  getPrograms: async () => {
    try {
      const response = await api.get('/programs');
      return response.data as Program[];
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  // Get user's progress
  getProgress: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },
}; 