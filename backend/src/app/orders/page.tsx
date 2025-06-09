'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { type Order, initialOrders } from '@/mock/orders';
import { saveToStorage, loadFromStorage } from '@/mock/localStorageUtil';

const STORAGE_KEY = 'orders_data';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const toast = useRef<Toast>(null);

  // 初始化，从localStorage加载，没数据则使用initialOrders
  useEffect(() => {
    const storedOrders = loadFromStorage<Order[]>(STORAGE_KEY);
    if (storedOrders && storedOrders.length > 0) {
      setOrders(storedOrders);
    } else {
      setOrders(initialOrders);
      saveToStorage(STORAGE_KEY, initialOrders);
    }
  }, []);

  // 封装一个更新订单并同步localStorage的函数
  const updateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveToStorage(STORAGE_KEY, newOrders);
  };

  const statusBodyTemplate = (row: Order) => {
    const severity = row.status === '待收货' ? 'success' : 'warning';
    return <Tag value={row.status} severity={severity as any} />;
  };

  const actionBodyTemplate = (row: Order) => (
    <div className="flex gap-2">
      <Button icon="pi pi-eye" className="p-button-text" onClick={() => openDialog(row)} />
      {row.status === '待发货' && (
        <Button icon="pi pi-send" className="p-button-text p-button-success" onClick={() => markAsDelivered(row.id)} />
      )}
      <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => deleteOrder(row.id)} />
    </div>
  );

  const openDialog = (order: Order) => {
    setSelectedOrder(order);
    setDialogVisible(true);
  };

  const markAsDelivered = (id: string) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, status: '待收货' } : order
    );
    updateOrders(updated);
    toast.current?.show({ severity: 'success', summary: '状态已更新为待收货', life: 1500 });
  };

  const deleteOrder = (id: string) => {
    const updated = orders.filter(order => order.id !== id);
    updateOrders(updated);
    toast.current?.show({ severity: 'warn', summary: '订单已删除', life: 1500 });
  };

  const renderDialogContent = () => {
    if (!selectedOrder) return null;
    return (
      <div className="space-y-2">
        <p><strong>订单 ID：</strong>{selectedOrder.id}</p>
        <p><strong>用户 ID：</strong>{selectedOrder.userId}</p>
        <p><strong>商品列表：</strong></p>
        <ul className="ml-4 list-disc">
          {selectedOrder.productList.map((p, idx) => (
            <li key={idx}>商品 ID：{p.productId}，数量：{p.quantity}</li>
          ))}
        </ul>
        <p><strong>总价：</strong>￥{selectedOrder.totalPrice.toFixed(2)}</p>
        <p><strong>状态：</strong>{selectedOrder.status}</p>
      </div>
    );
  };

  return (
    <div className="card p-4">
      <Toast ref={toast} />
      <h2 className="mb-3">订单管理</h2>
      <div className="flex justify-content-between mb-3">
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="搜索订单 ID 或用户 ID..."
        />
      </div>

      <DataTable
        value={orders}
        paginator
        rows={5}
        dataKey="id"
        globalFilter={globalFilter}
        responsiveLayout="scroll"
        emptyMessage="未找到订单。"
      >
        <Column field="id" header="订单 ID" sortable />
        <Column field="userId" header="用户 ID" sortable />
        <Column field="totalPrice" header="总价" body={(row) => `￥${row.totalPrice.toFixed(2)}`} sortable />
        <Column field="status" header="状态" body={statusBodyTemplate} sortable />
        <Column body={actionBodyTemplate} header="操作" style={{ width: '200px' }} />
      </DataTable>

      <Dialog
        header="订单详情"
        visible={dialogVisible}
        style={{ width: '450px' }}
        onHide={() => setDialogVisible(false)}
        modal
      >
        {renderDialogContent()}
      </Dialog>
    </div>
  );
};

export default Orders;
