'use client';

import { TabMenu } from "primereact/tabmenu";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Footer() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const tabItems = [
    { label: 'Home', icon: 'pi pi-home', command: () => router.push('/') },
    { label: 'Type', icon: 'pi pi-th-large', command: () => router.push('/type') },
    { label: 'Cart', icon: 'pi pi-shopping-cart', command: () => router.push('/cart') },
    { label: 'User', icon: 'pi pi-user', command: () => router.push('/user') },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-inner">
      <TabMenu
        model={tabItems}
        activeIndex={activeIndex}
        onTabChange={(e) => {
          setActiveIndex(e.index);
          tabItems[e.index].command?.();
        }}
        className="w-full text-xs"
      />
    </footer>
  );
}
