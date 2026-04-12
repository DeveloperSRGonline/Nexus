import { create } from 'zustand';
import toast from 'react-hot-toast';
import timerService from '../services/timerService';
import focusRecordService from '../services/focusRecordService';

const useFocusStore = create((set, get) => ({
  // State
  timers: [],
  activeTimerId: null,
  focusRecords: [],
  overview: {
    todayPomos: 0,
    todayDuration: 0,
    totalPomos: 0,
    totalDuration: 0,
  },
  
  // Timer state
  timerState: 'idle', // 'idle' | 'running' | 'paused' | 'stopped'
  timeRemaining: 0, // in seconds
  totalTime: 0, // in seconds
  startedAt: null,
  linkedTaskId: null,
  
  // UI state
  isLoading: false,
  error: null,
  showAddTimerModal: false,
  showFocusSettings: false,

  // ─── TIMER ACTIONS ──────────────────────────────────────

  // Fetch all timers for user
  fetchTimers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await timerService.getAll();
      const timers = response.data?.data || response.data || [];
      set({ timers, isLoading: false });
      
      // Set first timer as active if none selected
      if (!get().activeTimerId && timers.length > 0) {
        set({ activeTimerId: timers[0]._id });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch timers';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Create new timer
  createTimer: async (timerData) => {
    try {
      const response = await timerService.create(timerData);
      const newTimer = response.data?.data || response.data;
      
      set((state) => ({
        timers: [...state.timers, newTimer],
        activeTimerId: newTimer._id,
        showAddTimerModal: false,
      }));
      
      toast.success('Timer created!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create timer';
      toast.error(message);
      throw error;
    }
  },

  // Update timer
  updateTimer: async (timerId, updates) => {
    try {
      const response = await timerService.update(timerId, updates);
      const updatedTimer = response.data?.data || response.data;
      
      set((state) => ({
        timers: state.timers.map((t) => (t._id === timerId ? updatedTimer : t)),
      }));
      
      toast.success('Timer updated!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update timer';
      toast.error(message);
    }
  },

  // Delete timer
  deleteTimer: async (timerId) => {
    try {
      await timerService.delete(timerId);
      
      set((state) => ({
        timers: state.timers.filter((t) => t._id !== timerId),
        activeTimerId: state.activeTimerId === timerId 
          ? (state.timers.length > 1 ? state.timers.find((t) => t._id !== timerId)?._id : null)
          : state.activeTimerId,
      }));
      
      toast.success('Timer deleted!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete timer';
      toast.error(message);
    }
  },

  // Set active timer
  setActiveTimer: (timerId) => {
    set({ activeTimerId: timerId });
  },

  // ─── TIMER COUNTDOWN LOGIC ──────────────────────────────

  // Start timer
  startTimer: () => {
    const { activeTimerId, timers } = get();
    const timer = timers.find((t) => t._id === activeTimerId);
    
    if (!timer) {
      toast.error('No timer selected');
      return;
    }

    const durationInSeconds = timer.pomoDuration * 60;
    
    set({
      timerState: 'running',
      timeRemaining: durationInSeconds,
      totalTime: durationInSeconds,
      startedAt: Date.now(),
    });

    // Start the countdown interval
    get()._startInterval();
  },

  // Internal: Start interval with drift compensation
  _startInterval: () => {
    if (get()._intervalId) {
      clearInterval(get()._intervalId);
    }

    const intervalId = setInterval(() => {
      const { startedAt, totalTime, timerState } = get();
      
      if (timerState !== 'running') return;

      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, totalTime - elapsed);

      if (remaining <= 0) {
        // Timer completed
        get()._completeTimer();
      } else {
        set({ timeRemaining: remaining });
      }
    }, 100);

    set({ _intervalId: intervalId });
  },

  // Pause timer
  pauseTimer: () => {
    const { _intervalId } = get();
    if (_intervalId) {
      clearInterval(_intervalId);
    }
    
    set({ 
      timerState: 'paused',
      _intervalId: null,
    });
  },

  // Resume timer
  resumeTimer: () => {
    set({ timerState: 'running' });
    get()._startInterval();
  },

  // Stop timer
  stopTimer: () => {
    const { _intervalId } = get();
    if (_intervalId) {
      clearInterval(_intervalId);
    }
    
    set({ 
      timerState: 'idle',
      timeRemaining: 0,
      totalTime: 0,
      startedAt: null,
      _intervalId: null,
      linkedTaskId: null,
    });
  },

  // Complete timer
  _completeTimer: () => {
    const { _intervalId, totalTime, activeTimerId, timers, linkedTaskId } = get();
    
    if (_intervalId) {
      clearInterval(_intervalId);
    }

    const timer = timers.find((t) => t._id === activeTimerId);
    
    set({
      timerState: 'idle',
      _intervalId: null,
    });

    // Save focus record
    get().saveFocusRecord(timer, totalTime, linkedTaskId);

    // Trigger notification
    get().triggerNotification();

    toast.success('Focus session complete! Time for a break.');
  },

  // Save focus record
  saveFocusRecord: async (timer, duration, taskId) => {
    try {
      const recordData = {
        timerId: timer._id,
        linkedTaskId: taskId || undefined,
        mode: timer.mode,
        duration: duration,
        completedAt: new Date().toISOString(),
      };

      await focusRecordService.create(recordData);
      
      // Refresh overview stats
      get().fetchOverview();
      get().fetchFocusRecords();
    } catch (error) {
      console.error('Failed to save focus record:', error);
    }
  },

  // Trigger OS notification
  triggerNotification: () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Session Complete!', {
        body: 'Great work! Take a 5-minute break.',
        icon: '/favicon.ico',
      });
    }
  },

  // Request notification permission
  requestNotificationPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  },

  // Set linked task
  setLinkedTask: (taskId) => {
    set({ linkedTaskId: taskId });
  },

  // ─── FOCUS RECORDS ──────────────────────────────────────

  // Fetch focus records
  fetchFocusRecords: async () => {
    try {
      const response = await focusRecordService.getAll();
      const records = response.data?.data || response.data || [];
      set({ focusRecords: records });
    } catch (error) {
      console.error('Failed to fetch focus records:', error);
    }
  },

  // Fetch overview stats
  fetchOverview: async () => {
    try {
      const response = await focusRecordService.getOverview();
      const overview = response.data?.data || response.data || {};
      set({ overview });
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    }
  },

  // Delete focus record
  deleteFocusRecord: async (recordId) => {
    try {
      await focusRecordService.delete(recordId);
      
      set((state) => ({
        focusRecords: state.focusRecords.filter((r) => r._id !== recordId),
      }));
      
      toast.success('Record deleted!');
      get().fetchOverview();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete record';
      toast.error(message);
    }
  },

  // ─── UI ACTIONS ─────────────────────────────────────────

  setShowAddTimerModal: (show) => {
    set({ showAddTimerModal: show });
  },

  setShowFocusSettings: (show) => {
    set({ showFocusSettings: show });
  },

  // Cleanup on unmount
  cleanup: () => {
    const { _intervalId } = get();
    if (_intervalId) {
      clearInterval(_intervalId);
    }
    set({ _intervalId: null });
  },
}));

// Handle page visibility change for timer accuracy
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const store = useFocusStore.getState();
      if (store.timerState === 'running' && store.startedAt) {
        // Recalculate remaining time based on elapsed time
        const elapsed = Math.floor((Date.now() - store.startedAt) / 1000);
        const remaining = Math.max(0, store.totalTime - elapsed);
        
        if (remaining <= 0) {
          store._completeTimer();
        } else {
          store.timeRemaining = remaining;
          useFocusStore.setState({ timeRemaining: remaining });
          store._startInterval();
        }
      }
    }
  });
}

export default useFocusStore;
