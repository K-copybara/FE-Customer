import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  display_medium,
  body_large,
  body_medium,
  title_large,
  title_medium,
} from '../../styles/font';

import ReviewIcon from '../../assets/icon/review-icon.svg?react';
import { useUserStore } from '../../store/useUserStore';
import { getOrderHistory } from '../../api/order';
import { formatDateTime } from '../../utils/formatTime';

const STATUS_MAP = {
  PENDING: '주문 접수',
  COMPLETED: '주문 완료',
  CANCELED: '주문 취소',
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const { storeName, storeId, tableId, customerKey } = useUserStore();
  const [orderHistory, setOrderHistory] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const res = await getOrderHistory(storeId, customerKey);

        setOrderHistory(res);
        setOrders(res?.orders || []);
      } catch (err) {
        console.error(err);
        setOrderHistory({ totalOrders: 0, totalSpent: 0 });
        setOrders([]);
      }
    };

    fetchOrderHistory();
  }, [customerKey]);

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
      {orderHistory ? (
        <PageContent>
          <StoreInfo>
            <StoreTitle>{storeName}</StoreTitle>
            <TableInfo>{tableId}번 테이블</TableInfo>
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
                    <OrderTime>{formatDateTime(order.createdAt)}</OrderTime>
                  </OrderHeader>

                  <OrderItemInfo>
                    <OrderNumberText>
                      주문번호 {order.orderId.split('-')[0]}
                    </OrderNumberText>
                    <Line />
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
                  <Line />
                  <RequestSection>
                    <RequestLabel>요청사항</RequestLabel>
                    <RequestContent>
                      {order.requestNote || '없음'}
                    </RequestContent>
                  </RequestSection>

                  {order.status === 'COMPLETED' && !order.reviewed && (
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
      ) : (
        <div>로딩 중...</div>
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
  &::-webkit-scrollbar {
    display: none;
  }
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
  ${body_medium}
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
  box-shadow: 0 4px 8px 0 #e8ecff;
`;

const TotalOrderText = styled.div`
  ${title_large}
  color: var(--black);
`;

const TotalOrderAmountText = styled.div`
  ${title_large}
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
  box-shadow: 0 4px 10px 0 rgba(214, 214, 214, 0.4);
  border: 1px solid var(--gray300);
  display: flex;
  flex-direction: column;
`;

const Line = styled.div`
  width: 100%;
  height: 0.06rem;
  background-color: var(--gray300);
  margin: 1.25rem 0;
`;

const OrderHeader = styled.div`
  display: flex;
  padding: 0.25rem 0;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const OrderStatus = styled.div`
  ${title_medium}
  color: var(--primary);
`;

const OrderTime = styled.div`
  ${body_large}
  color: var(--gray700);
`;

const OrderItemInfo = styled.div`
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
`;

const OrderNumberText = styled.div`
  ${title_large}
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
  ${title_medium}
  padding-top: 1rem;
  color: var(--black);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RequestSection = styled.div`
  margin-bottom: 1.25rem;
`;

const RequestLabel = styled.div`
  ${title_medium}
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
  text-align: flex-end;
  ${title_medium}
  cursor: pointer;

  &:hover {
    background: var(--secondary);
  }
`;
