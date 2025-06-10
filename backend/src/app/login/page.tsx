"use client";

import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { Message } from "primereact/message";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "123456") {
      router.push("/orders");
    } else {
      setError("用户名或密码错误");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-gray-100">
      <div className="surface-card p-6 shadow-2 border-round w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">登录</h2>

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

        <Button label="登录" className="w-full" onClick={handleLogin} />
        <p className="text-center mt-3">
          还没有账号？{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/register")}
          >
            去注册
          </span>
        </p>
      </div>
    </div>
  );
}
