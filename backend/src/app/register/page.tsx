"use client";

import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { Message } from "primereact/message";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      setError("所有字段均为必填");
    } else if (password !== confirmPassword) {
      setError("两次密码输入不一致");
    } else {
      // ✅ 模拟注册成功，跳转登录
      router.push("/login");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="surface-card p-6 shadow-2 border-round w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">注册</h2>

        {error && <Message severity="error" text={error} className="mb-3" />}

        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            用户名
          </label>
          <InputText
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
            placeholder="请输入用户名"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            密码
          </label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            toggleMask
            className="w-full"
            placeholder="请输入密码"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2">
            确认密码
          </label>
          <Password
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            feedback={false}
            toggleMask
            className="w-full"
            placeholder="请再次输入密码"
          />
        </div>

        <Button label="注册" className="w-full" onClick={handleRegister} />
        <p className="text-center mt-3">
          已有账号？{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            去登录
          </span>
        </p>
      </div>
    </div>
  );
}
