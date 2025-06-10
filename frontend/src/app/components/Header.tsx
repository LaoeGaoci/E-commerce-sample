'use client';

import React, { useState} from 'react';
import { InputText } from 'primereact/inputtext';
import { Image } from 'primereact/image';
import { useRouter } from 'next/navigation';


export default function Header() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchText.trim() !== '') {
      router.push(`/commodity?query=${encodeURIComponent(searchText.trim())}`);
      setSearchText('');
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 py-2 flex items-center gap-3">
      <Image src={process.env.NEXT_PUBLIC_NGINX_URL + "logo.png"} alt="logo" className="h-6" />
      <span className="text-lg font-semibold">Mega</span>
      <span className="flex-grow" />
        <InputText
          placeholder="Search.."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-sm"
        />
    </header>
  );
}
