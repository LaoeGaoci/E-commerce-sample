'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { type User, initialUsers } from '@/mock/users';
import { loadFromStorage, saveToStorage } from '@/mock/localStorageUtil';

const STORAGE_KEY = 'users-data';

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage<User[]>(STORAGE_KEY);
    if (stored && stored.length > 0) {
      setUsers(stored);
    } else {
      setUsers(initialUsers);
      saveToStorage(STORAGE_KEY, initialUsers);
    }
  }, []);

  const showUserDialog = (user: User) => {
    setSelectedUser(user);
    setDialogVisible(true);
  };

  const addressCountTemplate = (rowData: User) => {
    return (
      <Tag
        value={`${rowData.addressIds.length} 个`}
        severity={rowData.addressIds.length > 0 ? 'success' : 'warning'}
      />
    );
  };

  const actionBodyTemplate = (rowData: User) => {
    return (
      <Button
        icon="pi pi-eye"
        className="p-button-sm p-button-text"
        onClick={() => showUserDialog(rowData)}
        tooltip="查看"
      />
    );
  };

  const renderDialogContent = () => {
    if (!selectedUser) return null;

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
          <span className="font-semibold">地址ID：</span>
          {selectedUser.addressIds.length > 0
            ? selectedUser.addressIds.join(', ')
            : '无'}
        </div>
      </div>
    );
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">用户管理</h2>

      <div className="flex justify-content-between mb-3">
        <span className="p-input-icon-left">
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="搜索用户..."
          />
        </span>
      </div>

      <DataTable
        value={users.filter(user =>
          user.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
          user.id.includes(globalFilter)
        )}
        paginator
        rows={5}
        dataKey="id"
        responsiveLayout="scroll"
        emptyMessage="未找到用户"
      >
        <Column field="id" header="ID" sortable />
        <Column field="name" header="姓名" sortable />
        <Column
          header="地址数"
          body={addressCountTemplate}
          sortable
        />
        <Column
          header="操作"
          body={actionBodyTemplate}
          style={{ width: '150px' }}
        />
      </DataTable>

      <Dialog
        header="用户详情"
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ width: '400px' }}
        modal
        className="p-fluid"
      >
        {renderDialogContent()}
      </Dialog>
    </div>
  );
};

export default UserPage;
