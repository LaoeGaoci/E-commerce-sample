'use client'

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Product, initialProducts } from '../../../../frontend/src/app/data/products';
import { saveToStorage, loadFromStorage } from '@/mock/localStorageUtil';



export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [layout, setLayout] = useState<'grid' | 'list' |(string & Record<string, unknown>)>('grid');
    const [searchText, setSearchText] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        id: '',
        name: '',
        image: 'default-product.png',
        description: '',
        price: 0,
        purchaseCount: 0,
        rating: 0,
        inCart: false,
        isHot: false,
        category: '',
        repeatPurchaseCount: 0,
        orderCount: 0
    });

    useEffect(() => {
        const stored = loadFromStorage<Product[]>('products');
        if (stored) {
            setProducts(stored);
        } else {
            setProducts(initialProducts);
            saveToStorage('products', initialProducts);
        }
    }, []);

    const getSeverity = (product: Product) => {
        return product.isHot ? 'danger' : null;
    };

    const handleEdit = (product: Product) => {
        setEditProduct({ ...product });
    };

    const saveEditedProduct = () => {
        if (!editProduct) return;
        const updated = products.map(p => p.id === editProduct.id ? editProduct : p);
        setProducts(updated);
        saveToStorage('products', updated);
        setEditProduct(null);
    };

    const listItem = (product: Product, index: number) => (
        <div className="col-12" key={product.id}>
           
            <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', {
                'border-top-1 surface-border': index !== 0,
            })}>
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block mx-auto border-round"
                     src={`http://localhost:65/images/${product.image}`}
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
                            {product.isHot && <Tag value="热销" severity={getSeverity(product)} />}
                            <span className="text-sm">已售: {product.purchaseCount}</span>
                            <span className="text-sm">复购: {product.repeatPurchaseCount}</span>
                        </div>
                        <div className="text-sm">{product.description}</div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">¥{product.price}</span>
                        <Button icon="pi pi-shopping-cart" className="p-button-rounded" 
                                label={product.inCart ? "已加购" : "加购"} 
                                disabled={product.inCart} />
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
                    {product.isHot && <Tag value="热销" severity={getSeverity(product)} />}
                </div>
                <div className="flex flex-column align-items-center gap-3 py-5">
                    <img className="w-9 shadow-2 border-round"
                         src={`http://localhost:65/images/${product.image}`}
                         alt={product.name}
                    />
                    <div className="text-2xl font-bold">{product.name}</div>
                    <Rating value={product.rating} readOnly cancel={false} />
                    <div className="text-sm text-center">{product.description}</div>
                    <div className="flex gap-3 text-sm">
                        <span>已售: {product.purchaseCount}</span>
                        <span>复购: {product.repeatPurchaseCount}</span>
                    </div>
                </div>
                <div className="flex align-items-center justify-content-between">
                    <span className="text-2xl font-semibold">¥{product.price}</span>
                    <div className="flex gap-2">
                        <Button icon="pi pi-cog" className="p-button-rounded"
                                onClick={() => handleEdit(product)} />
                    </div>
                </div>
            </div>
        </div>
    );
    // (item: any, layout?: "list" | "grid" | (string & Record<string, unknown>) | undefined) => ReactNode
    const itemTemplate = (product: Product, layout: string, index: number) => {
        if (!product) return;
        return layout === 'list' ? listItem(product, index) : gridItem(product);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.category.toLowerCase().includes(searchText.toLowerCase()) ||
        p.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const header = () => (
        <div className="flex justify-content-between align-items-center gap-2 mb-3">
            <span className="p-input-icon-left">
                <InputText value={searchText}
                           onChange={(e) => setSearchText(e.target.value)}
                           placeholder="搜索商品名称、分类或描述" />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    const addDialogFooter = (
        <div>
            <Button label="取消" icon="pi pi-times" onClick={() => setShowAddDialog(false)} className="p-button-text" />
            <Button label="保存" icon="pi pi-check" onClick={() => {
                const id = (products.length + 1).toString();
                const newP = { 
                    ...newProduct, 
                    id,
                    purchaseCount: 0,
                    repeatPurchaseCount: 0,
                    orderCount: 0,
                    rating: 0,
                    inCart: false
                } as Product;
                const updated = [...products, newP];
                setProducts(updated);
                saveToStorage('products', updated);
                setShowAddDialog(false);
                setNewProduct({
                    id: '',
                    name: '',
                    image: 'default-product.png',
                    description: '',
                    price: 0,
                    purchaseCount: 0,
                    rating: 0,
                    inCart: false,
                    isHot: false,
                    category: '',
                    repeatPurchaseCount: 0,
                    orderCount: 0
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

    const categories = [...new Set(products.map(p => p.category))];

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
                paginator
                rows={9}
            />

            <Dialog header="新增商品" visible={showAddDialog}
                    style={{ width: '30vw' }} modal
                    onHide={() => setShowAddDialog(false)}
                    footer={addDialogFooter}>
                <div className="flex flex-column gap-3 mt-2">
                    <InputText placeholder="商品名称" value={newProduct.name || ''}
                               onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                    <Dropdown 
                        options={categories.map(c => ({ label: c, value: c }))}
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.value })}
                        placeholder="选择分类"
                    />
                    <InputText placeholder="图片名称" value={newProduct.image || ''}
                               onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                    <InputText placeholder="商品描述" value={newProduct.description || ''}
                               onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                    <InputNumber placeholder="价格" value={newProduct.price || 0}
                                 onValueChange={(e) => setNewProduct({ ...newProduct, price: e.value || 0 })} 
                                 mode="currency" currency="CNY" locale="zh-CN"/>
                    <div className="flex align-items-center gap-3">
                        <label htmlFor="isHot">热销商品</label>
                        <input type="checkbox" id="isHot" checked={newProduct.isHot || false}
                               onChange={(e) => setNewProduct({ ...newProduct, isHot: e.target.checked })} />
                    </div>
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
                        <Dropdown 
                            options={categories.map(c => ({ label: c, value: c }))}
                            value={editProduct.category}
                            onChange={(e) => setEditProduct({ ...editProduct, category: e.value })}
                            placeholder="选择分类"
                        />
                        <InputText placeholder="图片名称" value={editProduct.image}
                                   onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })} />
                        <InputText placeholder="商品描述" value={editProduct.description}
                                   onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                        <InputNumber placeholder="价格" value={editProduct.price}
                                     onValueChange={(e) => setEditProduct({ ...editProduct, price: e.value || 0 })}
                                     mode="currency" currency="CNY" locale="zh-CN"/>
                        <div className="flex align-items-center gap-3">
                            <label htmlFor="editIsHot">热销商品</label>
                            <input type="checkbox" id="editIsHot" checked={editProduct.isHot}
                                   onChange={(e) => setEditProduct({ ...editProduct, isHot: e.target.checked })} />
                        </div>
                        <div className="flex flex-column gap-2">
                            <label>销售数据</label>
                            <div className="flex gap-3">
                                <InputNumber placeholder="购买次数" value={editProduct.purchaseCount}
                                             onValueChange={(e) => setEditProduct({ ...editProduct, purchaseCount: e.value || 0 })} />
                                <InputNumber placeholder="复购次数" value={editProduct.repeatPurchaseCount}
                                             onValueChange={(e) => setEditProduct({ ...editProduct, repeatPurchaseCount: e.value || 0 })} />
                            </div>
                        </div>
                        <Rating value={editProduct.rating} 
                                onChange={(e) => setEditProduct({ ...editProduct, rating: e.value || 0 })} 
                                cancel={false} />
                    </div>
                )}
            </Dialog>
        </div>
    );
}