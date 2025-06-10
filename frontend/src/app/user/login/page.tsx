'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { registerUser, loginUser } from '../userService';
import './login.scss';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      if (isRegisterMode) {
        await registerUser(username, password);
        alert('Registration successful, please log in');
        setIsRegisterMode(false);
      }
      const user = await loginUser(username, password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        router.push('/');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Card title={isRegisterMode ? 'Register New User' : 'Welcome to Login'} className="login-card">
        <form onSubmit={handleAuth} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <Button label={isRegisterMode ? 'Register' : 'Login'} type="submit" loading={loading} className="p-button-rounded w-full" />

          <Button
            label={isRegisterMode ? 'Already have an account? Login' : "Don't have an account? Register"}
            type="button"
            className="p-button-text toggle-button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setUsername('');
              setPassword('');
              setErrorMessage('');
            }}
          />
        </form>
      </Card>
    </div>
  );
}
