import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_large, body_large, display_medium } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';

const OrderCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // CartPage에서 전달된 주문 데이터 받기
  const orderData = location.state;

  console.log('받은 주문 데이터:', orderData);

  // 데이터가 없으면 에러 페이지 또는 메인으로 리다이렉트
  if (!orderData) {
    return (
      <Container>
        <Content>
          <ErrorMessage>주문 정보를 찾을 수 없습니다.</ErrorMessage>
          <FullBottomButton onClick={() => navigate('/')}>
            메뉴로 돌아가기
          </FullBottomButton>
        </Content>
      </Container>
    );
  }

  const handleComplete = () => {
    navigate('/history'); 
  };

  return (
    <Container>
      <Content>
        <SendIcon>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.33333 18.6667C5.66667 17.9722 5.27778 17.1944 5.16667 16.3333C5.08333 15.4444 5.27778 14.6389 5.75 13.9167C6.25 13.1944 6.95833 12.6944 7.875 12.4167L29.125 6.125C30.0694 5.84722 30.9722 5.90278 31.8333 6.29167C32.7222 6.65278 33.3472 7.27778 33.7083 8.16667C34.0972 9.02778 34.1528 9.93055 33.875 10.875L27.5833 32.125C27.3056 33.0417 26.8056 33.75 26.0833 34.25C25.3611 34.7222 24.5556 34.9167 23.6667 34.8333C22.8056 34.7222 22.0278 34.3333 21.3333 33.6667L6.33333 18.6667ZM24.625 32.25C24.8194 32.4722 24.8333 32.6528 24.6667 32.7917C24.5278 32.9028 24.3611 32.9306 24.1667 32.875C23.9722 32.8194 23.9167 32.6528 24 32.375L31.0833 8.5C31.1667 8.22222 31.3056 8.11111 31.5 8.16667C31.6944 8.19444 31.8056 8.30555 31.8333 8.5C31.8889 8.69444 31.7778 8.83333 31.5 8.91666L7.625 16C7.34722 16.0833 7.18056 16.0278 7.125 15.8333C7.06944 15.6111 7.09722 15.4306 7.20833 15.2917C7.34722 15.1528 7.52778 15.1806 7.75 15.375L24.625 32.25ZM13.8333 23.8333L20.5 17.1667C20.9722 16.6944 21.5 16.5556 22.0833 16.75C22.6944 16.9444 23.0972 17.3333 23.2917 17.9167C23.4861 18.4722 23.3333 19 22.8333 19.5L16.1667 26.1667L13.8333 23.8333Z" fill="white"/>
          </svg>

        </SendIcon>
        
        <Title>주문이 완료되었습니다!</Title>
        <OrderNumber>주문번호 {orderData.orderNumber}</OrderNumber>

        <OrderSummary>
          {/* 실제 주문한 아이템들 표시 */}
          <ItemsContainer>
            {orderData.items.map((item) => (
              <SummaryRow key={item.cartItemId}>
                <ItemName>{item.name}</ItemName>
                <ItemQuantity>{item.quantity}개</ItemQuantity>
              </SummaryRow>
            ))}
          </ItemsContainer>
          
          {/* 총 금액 */}
          <TotalRow>
            <SummaryLabel>총 주문 금액</SummaryLabel>
            <SummaryValue>{orderData.totalPrice.toLocaleString()}원</SummaryValue>
          </TotalRow>
          <Line></Line>
          <RequestInfo>
            <RequestTitle>요청사항</RequestTitle>
            <RequestContent>{orderData.request}</RequestContent>
          </RequestInfo>
        </OrderSummary>
      </Content>

      <FullBottomButton onClick={handleComplete}>
        주문 내역 보기
      </FullBottomButton>
    </Container>
  );
};

export default OrderCompletePage;

// 스타일 컴포넌트들
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: var(--background);
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  padding: 7rem 1rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SendIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 6.25rem;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  ${display_large}
  color: var(--Black, #222);

  font-family: "Pretendard Variable";
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 2.1rem */
  marin-bottom: 0.5rem;
`;

const OrderNumber = styled.div`
  ${display_medium}
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 1.75rem */
  color: var(--primary);
  text-align: center;
  margin-bottom: 2rem;
`;

const OrderSummary = styled.div`
  display: flex;
  width: 100%;
  background: var(--gray100);
  border-radius: 0.625rem;
  border: 1px solid var(--Gray300, #D9D9D9);
  padding: 1.25rem 1rem;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;
const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch; /* 부모 넓이에 맞춰 꽉 채움 */
  gap: 0.5rem; /* 원하시는 메뉴 간 간격 */
`;
const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;


const ItemName = styled.div`
  ${body_large}
  font-weight: 400;
  font-family: "Pretendard Variable";
  color: var(--black);
  font-style: normal;
  line-height: 140%
`;

const ItemQuantity = styled.div`
  ${body_large}
  color: var(--black);
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  font-family: "Pretendard Variable";
`;

const Line = styled.div`
  border-bottom: 1px solid var(--gray300);
  width: 100%;  
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  font-weight: 600;
  
`;

const SummaryLabel = styled.span`
  ${body_large}
  color: var(--black);
  font-family: "Pretendard Variable";
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 1.4rem */
`;

const SummaryValue = styled.span`
  ${body_large}
  color: var(--black);
  font-family: "Pretendard Variable";
  font-style: normal;
  font-weight: 600;
  line-height: normal;

`;

const RequestInfo = styled.div`
  width: 100%;
  text-align: left;
`;

const RequestTitle = styled.div`
  ${body_large}
  color: var(--black);
  font-family: "Pretendard Variable";
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 0.5rem;
`;

const RequestContent = styled.div`
  ${body_large}
  color: var(--black);
  font-family: "Pretendard Variable";
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 1.4rem */
`;

const ErrorMessage = styled.div`
  ${body_large}
  color: var(--gray700);
  margin-bottom: 2rem;
`;
