'use client';
import React from 'react';

const EmptyPage: React.FC = () => {
  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh' }}>
      {"订单页面,里面的商品点进去后进入资源详情页(./commodity/[commodityId])"}
    </div>
  );
};

export default EmptyPage;
