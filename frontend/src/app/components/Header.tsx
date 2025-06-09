'use client';

import { InputText } from "primereact/inputtext";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 py-2 flex items-center gap-3">
      <img src="http://localhost:65/logo.png" alt="logo" className="h-6" />
      <span className="text-lg font-semibold">Shop</span>
      <span className="flex-grow" />
      <InputText
        placeholder="Search..."
        className="w-2/3 sm:w-1/2 text-sm"
      />
    </header>
  );
}
