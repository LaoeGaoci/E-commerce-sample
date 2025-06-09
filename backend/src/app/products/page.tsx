'use client'

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

import { Product, products1 } from '@/mock/products';

export default function BasicDemo() {
    const [products, setProducts] = useState<Product[]>(products1);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [searchText, setSearchText] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const [newProduct, setNewProduct] = useState<Product>({
        id: '',
        code: '',
        name: '',
        description: '',
        image: 'bamboo-watch.jpg',
        price: 0,
        category: '',
        quantity: 0,
        inventoryStatus: 'INSTOCK',
        rating: 3,
    });

    const getSeverity = (product: Product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return null;
        }
    };

    const handleEdit = (product: Product) => {
        setEditProduct({ ...product });
    };

    const saveEditedProduct = () => {
        if (!editProduct) return;
        const updated = products.map(p => p.id === editProduct.id ? editProduct : p);
        setProducts(updated);
        setEditProduct(null);
    };

    const listItem = (product: Product, index: number) => (
        <div className="col-12" key={product.id}>
            <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', {
                'border-top-1 surface-border': index !== 0,
            })}>
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block mx-auto border-round"
                     src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
                     alt={product.name}
                />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{product.name}</div>
                        <Rating value={product.rating} readOnly cancel={false} />
                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-tag" />
                                <span className="font-semibold">{product.category}</span>
                            </span>
                            <Tag value={product.inventoryStatus} severity={getSeverity(product)} />
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">${product.price}</span>
                        <Button icon="pi pi-cog" className="p-button-rounded"
                                onClick={() => handleEdit(product)} />
                    </div>
                </div>
            </div>
        </div>
    );

    const gridItem = (product: Product) => (
        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product.id}>
            <div className="p-4 border-1 surface-border surface-card border-round">
                <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag" />
                        <span className="font-semibold">{product.category}</span>
                    </div>
                    <Tag value={product.inventoryStatus} severity={getSeverity(product)} />
                </div>
                <div className="flex flex-column align-items-center gap-3 py-5">
                    <img className="w-9 shadow-2 border-round"
                         src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
                         alt={product.name}
                    />
                    <div className="text-2xl font-bold">{product.name}</div>
                    <Rating value={product.rating} readOnly cancel={false} />
                </div>
                <div className="flex align-items-center justify-content-between">
                    <span className="text-2xl font-semibold">${product.price}</span>
                    <Button icon="pi pi-cog" className="p-button-rounded"
                            onClick={() => handleEdit(product)} />
                </div>
            </div>
        </div>
    );

    const itemTemplate = (product: Product, layout: string, index: number) => {
        if (!product) return;
        if (layout === 'list') return listItem(product, index);
        else return gridItem(product);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.category.toLowerCase().includes(searchText.toLowerCase())
    );

    const header = () => (
        <div className="flex justify-content-between align-items-center gap-2 mb-3">
            <span className="p-input-icon-left">
                <InputText value={searchText}
                           onChange={(e) => setSearchText(e.target.value)}
                           placeholder="搜索商品名称或分类" />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    const addDialogFooter = (
        <div>
            <Button label="取消" icon="pi pi-times" onClick={() => setShowAddDialog(false)} className="p-button-text" />
            <Button label="保存" icon="pi pi-check" onClick={() => {
                const id = (products.length + 1).toString();
                const newP = { ...newProduct, id, code: `P${id.padStart(4, '0')}` };
                setProducts([...products, newP]);
                setShowAddDialog(false);
                setNewProduct({
                    id: '',
                    code: '',
                    name: '',
                    description: '',
                    image: 'bamboo-watch.jpg',
                    price: 0,
                    category: '',
                    quantity: 0,
                    inventoryStatus: 'INSTOCK',
                    rating: 3,
                });
            }} />
        </div>
    );

    const editDialogFooter = (
        <div>
            <Button label="取消" icon="pi pi-times" onClick={() => setEditProduct(null)} className="p-button-text" />
            <Button label="保存" icon="pi pi-check" onClick={saveEditedProduct} />
        </div>
    );

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-3">
                <h3>商品管理</h3>
                <Button label="新增商品" icon="pi pi-plus" onClick={() => setShowAddDialog(true)} />
            </div>

            <DataView
                value={filteredProducts}
                itemTemplate={itemTemplate}
                layout={layout}
                header={header()}
            />

            <Dialog header="新增商品" visible={showAddDialog}
                    style={{ width: '30vw' }} modal
                    onHide={() => setShowAddDialog(false)}
                    footer={addDialogFooter}>
                <div className="flex flex-column gap-3 mt-2">
                    <InputText placeholder="商品名称" value={newProduct.name}
                               onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                    <InputText placeholder="分类" value={newProduct.category}
                               onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
                    <InputNumber placeholder="价格" value={newProduct.price}
                                 onValueChange={(e) => setNewProduct({ ...newProduct, price: e.value || 0 })} />
                    <Dropdown
                        value={newProduct.inventoryStatus}
                        options={[
                            { label: '有货', value: 'INSTOCK' },
                            { label: '少量', value: 'LOWSTOCK' },
                            { label: '无货', value: 'OUTOFSTOCK' },
                        ]}
                        onChange={(e) => setNewProduct({ ...newProduct, inventoryStatus: e.value })}
                        placeholder="库存状态"
                    />
                </div>
            </Dialog>

            <Dialog header="编辑商品" visible={!!editProduct}
                    style={{ width: '30vw' }} modal
                    onHide={() => setEditProduct(null)}
                    footer={editDialogFooter}>
                {editProduct && (
                    <div className="flex flex-column gap-3 mt-2">
                        <InputText placeholder="商品名称" value={editProduct.name}
                                   onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                        <InputText placeholder="分类" value={editProduct.category}
                                   onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} />
                        <InputNumber placeholder="价格" value={editProduct.price}
                                     onValueChange={(e) => setEditProduct({ ...editProduct, price: e.value || 0 })} />
                        <Dropdown
                            value={editProduct.inventoryStatus}
                            options={[
                                { label: '有货', value: 'INSTOCK' },
                                { label: '少量', value: 'LOWSTOCK' },
                                { label: '无货', value: 'OUTOFSTOCK' },
                            ]}
                            onChange={(e) => setEditProduct({ ...editProduct, inventoryStatus: e.value })}
                            placeholder="库存状态"
                        />
                    </div>
                )}
            </Dialog>
        </div>
    );
}
