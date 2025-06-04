import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-gray-200 border-round h-32 mb-3 flex items-center justify-center">
            <i className="pi pi-book text-4xl text-gray-500"></i>
          </div>
          <h4 className="font-medium mb-1">{product.name}</h4>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mt-3">
            <span className="font-bold text-red-500">${product.price.toFixed(2)}</span>
            <Button 
              icon="pi pi-shopping-cart" 
              rounded 
              text 
              severity="secondary" 
              onClick={() => onAddToCart?.(product)}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;