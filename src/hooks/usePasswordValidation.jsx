// src/hooks/usePasswordValidation.js
import { useState } from 'react';

export const usePasswordValidation = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  };

  const passwordsMatch = password && password === confirmPassword;
  const passwordIsValid = Object.values(checks).every(Boolean) && passwordsMatch;

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    checks,
    passwordsMatch,
    passwordIsValid,
  };
};
