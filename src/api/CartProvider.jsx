import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

export const CartProvider = ({ children }) => {
  // const [cartItems, setCartItems] = useState(() => {
  //   const stored = localStorage.getItem('cartItems');
  //   return stored ? JSON.parse(stored) : [];
  // });

  //   // 주문내역 상태 추가
  // const [orderHistory, setOrderHistory] = useState(() => {
  //   const stored = localStorage.getItem('orderHistory');
  //   return stored ? JSON.parse(stored) : [];
  // });
  const [orderHistory, setOrderHistory] = useState([]);
  const [cartItems, setCartItems] = useState([]);


  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // 주문내역 변경 시 localStorage 동기화
  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  const addToCart = (menu, quantity) => {
    setCartItems(prev => {
      // 같은 메뉴가 이미 있는지 확인 (menu.id 기준)
      const existingItem = prev.find(item => item.id === menu.id);
      
      if (existingItem) {
        // 기존 아이템이 있으면 수량 증가
        return prev.map(item => 
          item.id === menu.id 
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: item.price * (item.quantity + quantity)
              }
            : item
        );
      }
      
      // 새로운 아이템이면 추가
      const cartItem = {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        imgUrl: menu.imgUrl,
        quantity: quantity,
        totalPrice: menu.price * quantity,
      };

      return [...prev, cartItem];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

    // 주문 완료 함수 추가
  const completeOrder = (orderData) => {
    const nextOrderNumber = orderHistory.length + 1; 
    const isComplete = Math.random() < 0.5;
    const status = isComplete ? '주문 완료' : '주문 접수';
    const newOrder = {
      ...orderData,
      orderNumber: nextOrderNumber, // 더 유니크한 주문번호
      orderTime: new Date().toLocaleString('ko-KR'),
      status: status
    };
    setOrderHistory(prev => [...prev, newOrder]);
    clearCart(); // 주문 완료 후 장바구니 비우기
    
    return newOrder;
  };
  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,

    // 주문내역 관련
    orderHistory,
    completeOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
