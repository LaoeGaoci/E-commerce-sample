'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { registerUser, loginUser } from '../user/userService';
import '../login/login.scss';

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
        alert('注册成功，请登录');
        setIsRegisterMode(false);
      }
      const user = await loginUser(username, password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        router.push('/');
      } else {
        setErrorMessage('用户名或密码错误');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Card title={isRegisterMode ? '注册新用户' : '欢迎登录'} className="login-card">
        <form onSubmit={handleAuth} className="login-form">
          <div className="input-group">
            <label htmlFor="username">用户名</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">密码</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              placeholder="请输入密码"
              required
            />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <Button label={isRegisterMode ? '注册' : '登录'} type="submit" loading={loading} className="p-button-rounded w-full" />

          <Button
            label={isRegisterMode ? '已有账号？去登录' : '没有账号？去注册'}
            type="button"
            className="p-button-text toggle-button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
          />
        </form>
      </Card>
    </div>
  );
}
