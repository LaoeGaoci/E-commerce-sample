'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';  
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';

interface Message {
    id: number;
    title: string;
    content: string;
    date: string;
    read: boolean;
}

// 模拟初始消息
const initialMessages: Message[] = [
    { id: 1, title: '系统更新通知', content: '系统将于6月15日更新维护。', date: '2025-06-09', read: false },
    { id: 2, title: '账号登录提醒', content: '您的账号在北京地区有一次登录。', date: '2025-06-08', read: true },
    { id: 3, title: '优惠活动', content: '本周限时优惠，所有商品8折。', date: '2025-06-07', read: false }
];

const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [newMessageTitle, setNewMessageTitle] = useState('');
    const [newMessageContent, setNewMessageContent] = useState('');
    const toast = useRef<Toast>(null);

    useEffect(() => {
        setMessages(initialMessages);
    }, []);

    // 查看消息
    const handleView = (msg: Message) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            handleSetRead(msg.id);
        }
        setDialogVisible(true);
    };

    // 标记为已读
    const handleSetRead = (id: number) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
        );
    };

    // 标记为未读
    const handleSetUnread = (id: number) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, read: false } : msg))
        );
    };

    // 发布新消息（模拟）
    const handlePublish = () => {
        if (!newMessageTitle || !newMessageContent) {
            toast.current?.show({ severity: 'warn', summary: '标题和内容不能为空', life: 2000 });
            return;
        }

        const newMsg: Message = {
            id: Date.now(),
            title: newMessageTitle,
            content: newMessageContent,
            date: new Date().toISOString().split('T')[0],
            read: false
        };

        setMessages([newMsg, ...messages]);
        setNewMessageTitle('');
        setNewMessageContent('');
        toast.current?.show({ severity: 'success', summary: '消息已发布', life: 2000 });
    };

    // 消息状态标签
    const readStatus = (row: Message) => {
        return <Tag value={row.read ? '已读' : '未读'} severity={row.read ? 'success' : 'warning'} />;
    };

    // 操作列
    const actionTemplate = (row: Message) => (
        <div className="flex gap-2">
            <Button icon="pi pi-eye" className="p-button-text" onClick={() => handleView(row)} />
            {row.read ? (
                <Button
                    icon="pi pi-envelope"
                    className="p-button-text p-button-warning"
                    tooltip="设为未读"
                    onClick={() => handleSetUnread(row.id)}
                />
            ) : (
                <Button
                    icon="pi pi-check"
                    className="p-button-text p-button-success"
                    tooltip="标记为已读"
                    onClick={() => handleSetRead(row.id)}
                />
            )}
        </div>
    );

    return (
        <div className="card p-4 space-y-4">
            <Toast ref={toast} />
            <h2 className="text-xl font-bold">消息中心</h2>

            <div className="card p-4 bg-gray-50 border rounded">
                <h3 className="mb-2 font-semibold">发布新消息</h3>
                <div className="flex flex-column gap-3">
                    <InputText
                        value={newMessageTitle}
                        onChange={(e) => setNewMessageTitle(e.target.value)}
                        placeholder="消息标题"
                    />
                    <InputTextarea
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
                        rows={4}
                        placeholder="消息内容"
                    />
                    <Button label="发布消息" icon="pi pi-send" onClick={handlePublish} />
                </div>
            </div>

            <DataTable
                value={messages}
                paginator
                rows={5}
                dataKey="id"
                responsiveLayout="scroll"
                emptyMessage="暂无消息"
            >
                <Column field="title" header="标题" />
                <Column field="date" header="日期" />
                <Column header="状态" body={readStatus} />
                <Column header="操作" body={actionTemplate} style={{ width: '150px' }} />
            </DataTable>

            <Dialog
                header="消息详情"
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                style={{ width: '400px' }}
                modal
            >
                {selectedMessage && (
                    <div>
                        <h3 className="mb-2 font-bold">{selectedMessage.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">时间：{selectedMessage.date}</p>
                        <p>{selectedMessage.content}</p>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default Messages;
