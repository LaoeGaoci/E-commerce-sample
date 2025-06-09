'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('token', 'demo-token');
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <div className="card w-25rem p-4 shadow-3">
        <h3 className="text-center mb-3">后台登录</h3>
        <label>账号</label>
        <InputText value={username} onChange={(e) => setUsername(e.target.value)} className="w-full" />
        <label className="mt-3">密码</label>
        <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask className="w-full" />
        <Button label="登录" className="w-full mt-4" onClick={handleLogin} />
      </div>
    </div>
  );
}
