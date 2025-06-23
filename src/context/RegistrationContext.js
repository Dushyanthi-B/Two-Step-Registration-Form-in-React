import React, { createContext, useContext, useReducer } from 'react';

const RegistrationContext = createContext();

const initialState = {
  currentStep: 1,
  formData: {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  },
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  submitError: '',
};

const registrationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };
    case 'CLEAR_FIELD_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.field];
      return {
        ...state,
        errors: newErrors,
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1),
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case 'SET_SUBMITTED':
      return {
        ...state,
        isSubmitted: true,
        isSubmitting: false,
      };
    case 'SET_SUBMIT_ERROR':
      return {
        ...state,
        submitError: action.error,
        isSubmitting: false,
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

export const RegistrationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  const setFieldValue = (field, value) => {
    dispatch({ type: 'SET_FIELD_VALUE', field, value });
  };

  const setFieldError = (field, error) => {
    dispatch({ type: 'SET_FIELD_ERROR', field, error });
  };

  const clearFieldError = (field) => {
    dispatch({ type: 'CLEAR_FIELD_ERROR', field });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const setSubmitting = (isSubmitting) => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting });
  };

  const setSubmitted = () => {
    dispatch({ type: 'SET_SUBMITTED' });
  };

  const setSubmitError = (error) => {
    dispatch({ type: 'SET_SUBMIT_ERROR', error });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const value = {
    ...state,
    setFieldValue,
    setFieldError,
    clearFieldError,
    nextStep,
    prevStep,
    setSubmitting,
    setSubmitted,
    setSubmitError,
    resetForm,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}; 