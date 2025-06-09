'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

interface Order {
    id: number;
    orderNumber: string;
    customer: string;
    date: string;         // 下单时间
    amount: number;
    status: '已发货' | '待处理' | '已取消';
    shippedDate?: string; // 发货时间
}

// 模拟订单数据
const mockOrders: Order[] = [
    { id: 1001, orderNumber: 'ORD20250601A', customer: '张三', date: '2025-06-01', amount: 199.99, status: '已发货', shippedDate: '2025-06-02' },
    { id: 1002, orderNumber: 'ORD20250603B', customer: '李四', date: '2025-06-03', amount: 89.50, status: '待处理' },
    { id: 1003, orderNumber: 'ORD20250605C', customer: '王五', date: '2025-06-05', amount: 0, status: '已取消' },
    { id: 1004, orderNumber: 'ORD20250606D', customer: '赵六', date: '2025-06-06', amount: 109.00, status: '已发货', shippedDate: '2025-06-07' },
    { id: 1005, orderNumber: 'ORD20250608E', customer: '孙七', date: '2025-06-08', amount: 310.80, status: '待处理' },
];

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        setOrders(mockOrders);
    }, []);

    // 状态标签
    const statusBodyTemplate = (row: Order) => {
        let severity: 'success' | 'warning' | 'danger' = 'success';
        if (row.status === '待处理') severity = 'warning';
        else if (row.status === '已取消') severity = 'danger';

        return <Tag value={row.status} severity={severity} />;
    };

    // 操作按钮
    const actionBodyTemplate = (row: Order) => (
        <div className="flex gap-2">
            <Button icon="pi pi-eye" className="p-button-text" onClick={() => openDialog(row)} />
            {row.status === '待处理' ? (
                <Button icon="pi pi-send" className="p-button-text p-button-success" tooltip="发货" onClick={() => markAsShipped(row.id)} />
            ) : row.status === '已发货' ? (
                <Button icon="pi pi-undo" className="p-button-text p-button-warning" tooltip="设为未发货" onClick={() => markAsUnshipped(row.id)} />
            ) : null}
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" tooltip="删除订单" onClick={() => deleteOrder(row.id)} />
        </div>
    );

    const openDialog = (order: Order) => {
        setSelectedOrder(order);
        setDialogVisible(true);
    };

    const markAsShipped = (id: number) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id
                    ? { ...order, status: '已发货', shippedDate: new Date().toISOString().split('T')[0] }
                    : order
            )
        );
        toast.current?.show({ severity: 'success', summary: '已发货', life: 1500 });
    };

    const markAsUnshipped = (id: number) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id
                    ? { ...order, status: '待处理', shippedDate: undefined }
                    : order
            )
        );
        toast.current?.show({ severity: 'info', summary: '设为未发货', life: 1500 });
    };

    const deleteOrder = (id: number) => {
        setOrders((prev) => prev.filter((order) => order.id !== id));
        toast.current?.show({ severity: 'warn', summary: '订单已删除', life: 1500 });
    };

    const renderDialogContent = () => {
        if (!selectedOrder) return null;

        return (
            <div className="p-2 space-y-2">
                <p><strong>订单编号：</strong> {selectedOrder.orderNumber}</p>
                <p><strong>客户：</strong> {selectedOrder.customer}</p>
                <p><strong>下单时间：</strong> {selectedOrder.date}</p>
                <p><strong>发货时间：</strong> {selectedOrder.shippedDate || '未发货'}</p>
                <p><strong>金额：</strong> ￥{selectedOrder.amount.toFixed(2)}</p>
                <p><strong>状态：</strong> {selectedOrder.status}</p>
            </div>
        );
    };

    return (
        <div className="card p-4">
            <Toast ref={toast} />
            <h2 className="mb-3">订单管理</h2>
            <div className="flex justify-content-between mb-3">
                <span className="p-input-icon-left">
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="搜索订单..."
                    />
                </span>
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
                <Column field="orderNumber" header="订单编号" sortable />
                <Column field="customer" header="客户" sortable />
                <Column field="date" header="下单时间" sortable />
                <Column field="shippedDate" header="发货时间" sortable body={(row) => row.shippedDate || '-'} />
                <Column field="amount" header="金额" sortable body={(row) => `￥${row.amount.toFixed(2)}`} />
                <Column field="status" header="状态" body={statusBodyTemplate} sortable />
                <Column body={actionBodyTemplate} header="操作" style={{ width: '200px' }} />
            </DataTable>

            <Dialog
                header="订单详情"
                visible={dialogVisible}
                style={{ width: '400px' }}
                onHide={() => setDialogVisible(false)}
                modal
            >
                {renderDialogContent()}
            </Dialog>
        </div>
    );
};

export default Orders;
