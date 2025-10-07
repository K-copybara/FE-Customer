import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_small, display_medium, body_large } from '../../styles/font';
import { storeInfo } from '../../store/dummyStore';

import ReviewIcon from '../../assets/icon/review-icon.svg?react';

const dummyHistory = {
  storeId: 1,
  totalOrders: 3,
  totalSpent: 3,
  orders: [
    {
      orderId: '2',
      totalPrice: 0,
      requestNote: null,
      status: 'COMPLETED',
      createdAt: '2025-10-05T00:01:16.764796',
      items: [
        {
          menuId: 101,
          menuName: '메뉴명',
          amount: 2,
          price: 0,
          totalPrice: 0,
        },
        {
          menuId: 102,
          menuName: '메뉴명',
          amount: 1,
          price: 0,
          totalPrice: 0,
        },
      ],
    },
    {
      orderId: 'cf054be8-e54c-49b2-b3f4-7eadb64db59c',
      totalPrice: 3,
      requestNote: '요청사항 들어달라고',
      status: 'PENDING',
      createdAt: '2025-10-05T00:00:51.534912',
      items: [
        {
          menuId: 101,
          menuName: '탄탄지 샐러드',
          amount: 2,
          price: 1,
          totalPrice: 2,
        },
        {
          menuId: 102,
          menuName: '하가우',
          amount: 1,
          price: 1,
          totalPrice: 1,
        },
      ],
    },
    {
      orderId: '1',
      totalPrice: 0,
      requestNote: null,
      status: 'PENDING',
      createdAt: '2025-10-05T00:00:49.479736',
      items: [
        {
          menuId: 101,
          menuName: '메뉴명',
          amount: 2,
          price: 0,
          totalPrice: 0,
        },
        {
          menuId: 102,
          menuName: '메뉴명',
          amount: 1,
          price: 0,
          totalPrice: 0,
        },
      ],
    },
  ],
};

const STATUS_MAP = {
  PENDING: '주문 접수',
  COMPLETED: '주문 완료',
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const [orderHistory, setOrderHistory] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // const res = await getOrderHistory(); // 실제 API 호출 시 사용
        const historyData = dummyHistory; // 데이터를 변수에 할당

        setOrderHistory(historyData);
        setOrders([...(historyData.orders || [])]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleReviewClick = (order) => {
    console.log('리뷰 쓰기 버튼 클릭됨. 주문 정보:', order);
    navigate('/review', { state: order });
  };

  return (
    <Container>
      <PageHeader
        title="주문 내역"
        onClick={() => navigate('/')}
        showBackButton={true}
      />
      {orderHistory && (
        <PageContent>
          <StoreInfo>
            <StoreTitle>{storeInfo.shopName}</StoreTitle>
            <TableInfo>{storeInfo.tableId}번 테이블</TableInfo>
          </StoreInfo>

          <TotalOrderInfo>
            <TotalOrderText>
              총 {orderHistory.totalOrders}건 주문금액
            </TotalOrderText>
            <TotalOrderAmountText>
              {orderHistory.totalSpent.toLocaleString()}원
            </TotalOrderAmountText>
          </TotalOrderInfo>

          {orders.length === 0 ? (
            <EmptyOrder>
              <EmptyMessage>주문 내역이 없습니다</EmptyMessage>
            </EmptyOrder>
          ) : (
            <OrderList>
              {orders.map((order) => (
                <OrderCard key={order.orderId}>
                  <OrderHeader>
                    <OrderStatus>{STATUS_MAP[order.status]}</OrderStatus>
                    {/* 나중에 날짜 포맷팅 함수 적용 */}
                    <OrderTime>{order.createdAt}</OrderTime>
                  </OrderHeader>

                  <OrderItemInfo>
                    <OrderNumberText>주문 번호 {order.orderId}</OrderNumberText>
                    {order.items.map((item) => (
                      <OrderItem key={item.menuId}>
                        <ItemName>
                          {item.menuName} | {item.amount}개
                        </ItemName>
                        <ItemPrice>
                          {item.totalPrice.toLocaleString()}원
                        </ItemPrice>
                      </OrderItem>
                    ))}
                    <TotalAmount>
                      <span>총 주문 금액</span>
                      {order.totalPrice.toLocaleString()}원
                    </TotalAmount>
                  </OrderItemInfo>

                  <RequestSection>
                    <RequestLabel>요청사항</RequestLabel>
                    <RequestContent>
                      {order.requestNote || '없음'}
                    </RequestContent>
                  </RequestSection>

                  {order.status === 'COMPLETED' && (
                    <ReviewButton onClick={() => handleReviewClick(order)}>
                      <ReviewIcon />
                      리뷰 쓰기
                    </ReviewButton>
                  )}
                </OrderCard>
              ))}
            </OrderList>
          )}
        </PageContent>
      )}
    </Container>
  );
};

export default HistoryPage;

// 스타일 컴포넌트들

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--white);
  position: relative;
`;

const PageContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem 1rem 1rem;
  -webkit-overflow-scrolling: touch;
`;

const StoreInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.88rem 0;
`;

const StoreTitle = styled.h2`
  ${display_medium}
  color: var(--black);
`;

const TableInfo = styled.span`
  ${display_small}
  color: var(--black);
`;

const TotalOrderInfo = styled.div`
  border-radius: 0.625rem;
  border: 1px solid var(--secondary);
  display: flex;
  width: 100%;
  padding: 1.75rem 1.25rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.56rem;
`;

const TotalOrderText = styled.div`
  ${display_medium}
  color: var(--black);
`;

const TotalOrderAmountText = styled.div`
  ${display_medium}
  color: var(--black);
`;

const EmptyOrder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const EmptyMessage = styled.p`
  ${body_large}
  color: var(--gray500);
  margin: 0;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.56rem;
`;

const OrderCard = styled.div`
  background: var(--background);
  border-radius: 0.625rem;
  padding: 1.5rem 1.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray300);
  display: flex;
  flex-direction: column;
`;

const OrderHeader = styled.div`
  display: flex;
  padding: 0.25rem 0;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const OrderStatus = styled.div`
  ${body_large}
  color: var(--primary);
`;

const OrderTime = styled.div`
  ${body_large}
  color: var(--gray700);
`;

const OrderItemInfo = styled.div`
  padding-top: 0.5rem;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
`;

const OrderNumberText = styled.div`
  ${display_medium}
  border-bottom: 1px solid var(--gray300);
  padding-bottom: 1.25rem;
  color: var(--black);
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  padding: 0.25rem 0;
`;

const ItemName = styled.div`
  ${body_large}
  color: var(--black);
`;

const ItemPrice = styled.div`
  ${body_large}
  color: var(--black);
`;

const TotalAmount = styled.div`
  ${body_large}
  padding: 1rem 0 1.25rem 0;
  color: var(--black);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--gray300);
`;

const RequestSection = styled.div`
  margin-bottom: 1.25rem;
`;

const RequestLabel = styled.div`
  ${body_large}
  margin-bottom: 0.75rem;
`;

const RequestContent = styled.div`
  ${body_large}
  color: var(--Black, #222);
`;

const ReviewButton = styled.button`
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 3.125rem;

  display: flex;
  gap: 0.5rem;
  padding: 0.625rem 1rem;

  align-items: flex-end;
  justify-content: flex-end;
  align-self: flex-end;
  text-align: rlex-end;
  ${body_large}
  cursor: pointer;

  &:hover {
    background: var(--secondary);
  }
`;
