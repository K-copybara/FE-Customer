import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import styled from 'styled-components';
import { display_small, display_medium, body_large } from '../../styles/font';
import { useStore } from '../../hooks/useStore';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { orderHistory } = useCart();
  const { storeInfo } = useStore();

  const orders = [...(orderHistory || [])].reverse();

  const totalOrderAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const handleReviewClick = (order) => {
    console.log("리뷰 쓰기 버튼 클릭됨. 주문 정보:", order);
    navigate('/review', { state: order });
  };

   return (
    <Container>
      <PageHeader 
        title="주문 내역" 
        onClick={() => navigate('/')} 
        showBackButton={true}
      />

      <PageContent>
        <StoreInfo>
          <StoreTitle>{storeInfo.storeName}</StoreTitle>
          <TableInfo>{storeInfo.tableNumber}</TableInfo>
        </StoreInfo>

        <TotalOrderInfo>
          <TotalOrderText>총 {orders.length}건 주문금액</TotalOrderText>
          <TotalOrderAmountText>{totalOrderAmount.toLocaleString()}원</TotalOrderAmountText>
        </TotalOrderInfo>

        {orders.length === 0 ? (
          <EmptyOrder>
            <EmptyMessage>주문 내역이 없습니다</EmptyMessage>
          </EmptyOrder>
        ) : (
          <OrderList>
            {orders.map((order) => (
              <OrderCard key={order.orderNumber}>
                <OrderHeader>
                  <OrderStatus>{order.status}</OrderStatus>
                  <OrderTime>{order.orderTime}</OrderTime>
                </OrderHeader>

                <OrderItemInfo>
                  <OrderNumberText>주문 번호 {order.orderNumber}</OrderNumberText>
                  {order.items.map((item) => (
                    <OrderItem key={item.cartItemId}>
                      <ItemName>{item.name} | {item.quantity}개</ItemName>
                      <ItemPrice>{item.totalPrice.toLocaleString()}원</ItemPrice>
                    </OrderItem>
                  ))}
                  <TotalAmount>
                    <span>총 주문 금액</span>
                     {order.totalPrice.toLocaleString()}원
                  </TotalAmount>
                </OrderItemInfo>

                <RequestSection>
                  <RequestLabel>요청사항</RequestLabel>
                  <RequestContent>{order.request || '없음'}</RequestContent>
                </RequestSection>
                {order.status === '주문 완료' && (
                  <ReviewButton onClick={() => handleReviewClick(order)}>
                      <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5625 18.2083C3.3125 18.2778 3.07639 18.2569 2.85417 18.1458C2.63194 18.0347 2.46528 17.8681 2.35417 17.6458C2.24306 17.4236 2.22222 17.1875 2.29167 16.9375L3.08333 13.7292L13.7083 3.125C14.0417 2.79167 14.4236 2.56944 14.8542 2.45833C15.2847 2.33333 15.7153 2.33333 16.1458 2.45833C16.5764 2.56944 16.9583 2.79167 17.2917 3.125L17.375 3.20833C17.7083 3.54167 17.9306 3.92361 18.0417 4.35417C18.1667 4.78472 18.1667 5.21528 18.0417 5.64583C17.9306 6.07639 17.7083 6.45833 17.375 6.79167L6.77083 17.4167L3.5625 18.2083ZM3.89583 17.375C3.90972 17.3333 3.90972 17.2708 3.89583 17.1875C3.89583 17.1042 3.88194 17 3.85417 16.875C3.82639 16.7361 3.78472 16.5972 3.72917 16.4583L5.89583 15.9167L16.2083 5.625C16.4306 5.40278 16.5417 5.19444 16.5417 5C16.5417 4.80555 16.4306 4.59722 16.2083 4.375L16.125 4.29167C15.9028 4.06944 15.6944 3.95833 15.5 3.95833C15.3056 3.95833 15.0972 4.06944 14.875 4.29167L4.58333 14.6042L3.89583 17.375ZM12.4167 5.58333L13.5833 4.41667L16.0833 6.91667L14.9167 8.08333L12.4167 5.58333Z" fill="white"/>
                      </svg>
                      리뷰 쓰기
                  </ReviewButton>
                )}
              </OrderCard>
            ))}
          </OrderList>
        )}
      </PageContent>
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