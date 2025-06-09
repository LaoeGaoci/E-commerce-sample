'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';

interface UserInfo {
    id: number;
    name: string;
    email: string;
    registerDate: string;
    status: '正常' | '禁用';
}

// 模拟用户数据
const mockUsers: UserInfo[] = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', registerDate: '2025-01-10', status: '正常' },
    { id: 2, name: '李四', email: 'lisi@example.com', registerDate: '2025-02-20', status: '禁用' },
    { id: 3, name: '王五', email: 'wangwu@example.com', registerDate: '2025-03-05', status: '正常' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', registerDate: '2025-04-12', status: '正常' },
    { id: 5, name: '钱七', email: 'qianqi@example.com', registerDate: '2025-05-01', status: '禁用' },
];

const User = () => {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        setUsers(mockUsers);
    }, []);

    // 用户状态标签
    const statusBodyTemplate = (rowData: UserInfo) => {
        const severity = rowData.status === '正常' ? 'success' : 'danger';
        return <Tag value={rowData.status} severity={severity} />;
    };

    // 操作按钮列
    const actionBodyTemplate = (rowData: UserInfo) => {
        const toggleStatus = rowData.status === '正常' ? '禁用' : '启用';
        const icon = rowData.status === '正常' ? 'pi pi-ban' : 'pi pi-check';
        const className =
            rowData.status === '正常'
                ? 'p-button-sm p-button-text p-button-danger'
                : 'p-button-sm p-button-text p-button-success';

        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    className="p-button-sm p-button-text"
                    onClick={() => {
                        setSelectedUser(rowData);
                        setDialogVisible(true);
                    }}
                    tooltip="查看"
                />
                <Button
                    icon={icon}
                    className={className}
                    label={toggleStatus}
                    onClick={() => handleToggleStatus(rowData.id)}
                    tooltip={toggleStatus}
                />
            </div>
        );
    };

    // 切换启用/禁用状态
    const handleToggleStatus = (id: number) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id
                    ? {
                          ...user,
                          status: user.status === '正常' ? '禁用' : '正常',
                      }
                    : user
            )
        );
    };

    // 弹窗内容
    const renderDialogContent = () => {
        if (!selectedUser) return null;

        const statusColor =
            selectedUser.status === '正常' ? 'text-green-600' : 'text-red-600';

        return (
            <div className="space-y-3 text-base">
                <div>
                    <span className="font-semibold">ID：</span>
                    {selectedUser.id}
                </div>
                <div>
                    <span className="font-semibold">姓名：</span>
                    {selectedUser.name}
                </div>
                <div>
                    <span className="font-semibold">邮箱：</span>
                    {selectedUser.email}
                </div>
                <div>
                    <span className="font-semibold">注册时间：</span>
                    {selectedUser.registerDate}
                </div>
                <div>
                    <span className="font-semibold">状态：</span>
                    <span className={statusColor}>{selectedUser.status}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="card p-4">
            <h2 className="mb-4">用户管理</h2>

            <div className="flex justify-content-between mb-3">
                <span className="p-input-icon-left">
                    {/* <i className="pi pi-search" /> */}
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="搜索用户..."
                    />
                </span>
            </div>

            <DataTable
                value={users}
                paginator
                rows={5}
                dataKey="id"
                globalFilter={globalFilter}
                responsiveLayout="scroll"
                emptyMessage="未找到用户"
            >
                <Column field="id" header="ID" sortable />
                <Column field="name" header="姓名" sortable />
                <Column field="email" header="邮箱" sortable />
                <Column field="registerDate" header="注册时间" sortable />
                <Column field="status" header="状态" body={statusBodyTemplate} sortable />
                <Column header="操作" body={actionBodyTemplate} style={{ width: '200px' }} />
            </DataTable>

            <Dialog
                header="用户详情"
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                style={{ width: '450px' }}
                modal
                className="p-fluid"
            >
                {renderDialogContent()}
            </Dialog>
        </div>
    );
};

export default User;
