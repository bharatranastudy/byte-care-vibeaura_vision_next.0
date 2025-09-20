import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  healthData: {
    symptoms: [],
    medications: [],
    appointments: [],
    vaccinations: []
  },
  wallet: {
    balance: 0,
    tokens: 0,
    transactions: []
  },
  notifications: [],
  language: 'en',
  theme: 'light'
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'ADD_SYMPTOM':
      return {
        ...state,
        healthData: {
          ...state.healthData,
          symptoms: [...state.healthData.symptoms, action.payload]
        }
      };
    case 'ADD_MEDICATION':
      return {
        ...state,
        healthData: {
          ...state.healthData,
          medications: [...state.healthData.medications, action.payload]
        }
      };
    case 'UPDATE_WALLET':
      return { ...state, wallet: { ...state.wallet, ...action.payload } };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load user data from localStorage on app start
    const savedUser = localStorage.getItem('healthbot_user');
    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('healthbot_user', JSON.stringify(userData));
    dispatch({ type: 'SET_USER', payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('healthbot_user');
    dispatch({ type: 'LOGOUT' });
  };

  const addSymptom = (symptom) => {
    dispatch({ type: 'ADD_SYMPTOM', payload: symptom });
  };

  const addMedication = (medication) => {
    dispatch({ type: 'ADD_MEDICATION', payload: medication });
  };

  const updateWallet = (walletData) => {
    dispatch({ type: 'UPDATE_WALLET', payload: walletData });
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const setLanguage = (language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const value = {
    ...state,
    login,
    logout,
    addSymptom,
    addMedication,
    updateWallet,
    addNotification,
    setLanguage,
    setTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
