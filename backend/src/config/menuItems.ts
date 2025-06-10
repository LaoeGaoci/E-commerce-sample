// src/config/menuItems.ts
export const menuItems = [
    {
      label: "管理",
      items: [
        {
          label: "订单管理",
          icon: "pi pi-shopping-cart",
          shortcut: "⌘+N",
          to: "/orders",
        },
        {
          label: "商品搜索",
          icon: "pi pi-search",
          shortcut: "⌘+S",
          to: "/products",
        },
      ],
    },
    {
      label: "设置",
      items: [
        {
          label: "系统设置",
          icon: "pi pi-cog",
          shortcut: "⌘+O",
          to: "/settings",
        },
        {
          label: "消息中心",
          icon: "pi pi-inbox",
          badge: 2,
          to: "/messages",
        },
      ],
    },
  ];
  