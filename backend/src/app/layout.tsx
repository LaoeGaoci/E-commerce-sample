"use client";

import React, { useEffect } from "react";
import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { MenuItem as Item } from "primereact/menuitem";

import "@/app/globals.css";

import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../assest/b137da758efdfc411d446bda19a19fa.png";

interface MenuItem extends Item {
  to?: string;
  badge?: string | number;
  shortcut?: string;
}

export type CustomMenuItem = {
  label?: string;
  icon?: string;
  badge?: string | number;
  to?: string;
  shortcut?: string;
  template?: (item: MenuItem) => React.JSX.Element;
  separator?: boolean;
  items?: CustomMenuItem[];
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isFullPage = ["/login", "/register"].includes(pathname);

  // ✅ 进入后台默认跳转到订单页
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      router.push("/orders");
    }
  }, []);

  const itemRenderer = (item: MenuItem) => (
    <div
      className="p-menuitem-content"
      onClick={() => item.to && router.push(item.to)}
    >
      <a className="flex align-items-center p-menuitem-link">
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
        {item.badge && <Badge className="ml-auto" value={item.badge} />}
        {item.shortcut && (
          <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
            {item.shortcut}
          </span>
        )}
      </a>
    </div>
  );
  const items: CustomMenuItem[] = [
    {
      template: () => {
        return (
          <span className="inline-flex align-items-center gap-1 px-2 py-2">
            <Image src={Logo} alt="logo" width={30} height={30} />
            <span className="font-medium text-xl font-semibold">
              电商<span className="text-primary">后台系统</span>
            </span>
          </span>
        );
      },
    },
    {
      separator: true,
    },
    {
      label: "管理",
      items: [
        {
          label: "订单管理",
          icon: "pi pi-shopping-cart",
          shortcut: "⌘+N",
          to: "/orders",
          template: itemRenderer,
        },
        {
          label: "商品管理",
          icon: "pi pi-box", // ✅ 修改为商品管理图标
          shortcut: "⌘+N",
          to: "/products",
          template: itemRenderer,
        },
        {
          label: "用户管理",
          icon: "pi pi-users", // 更符合“用户管理”的图标
          to: "/users",
          shortcut: "⌘+U",
          template: itemRenderer,
        },
      ],
    },
    {
      label: "设置",
      items: [
        {
          label: "消息中心",
          icon: "pi pi-inbox",
          badge: 2,
          to: "/messages",
          template: itemRenderer,
        },
        {
          label: "退出登录",
          icon: "pi pi-sign-out",
          shortcut: "⌘+Q",
          to: "/login",
          template: itemRenderer,
        },
      ],
    },
  ];

  if (isFullPage) {
    return (
      <html lang="zh">
        <body
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          {children}
        </body>
      </html>
    );
  }
  return (
    <html lang="zh">
      <body>
        <div className="flex h-screen">
          {/* 左侧导航栏 */}
          <div className="bg-indigo-500 text-white p-4 shadow-2">
            <Menu model={items} className="w-full md:w-15rem" />
          </div>

          <div className="flex-1 p-4 overflow-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
