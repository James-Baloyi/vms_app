import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  farmer: null,
  registrationData: {},
  vouchers: [],
  orders: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_FARMER':
      return { ...state, farmer: action.payload };
    case 'UPDATE_REGISTRATION':
      return { 
        ...state, 
        registrationData: { ...state.registrationData, ...action.payload }
      };
    case 'SET_VOUCHERS':
      return { ...state, vouchers: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}