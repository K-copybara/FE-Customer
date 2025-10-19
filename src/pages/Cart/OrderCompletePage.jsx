import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  display_large,
  body_large,
  title_large,
  title_medium,
} from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';

import Send from '../../assets/icon/send-icon.svg?react';

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

  // 요청사항 텍스트 결정
  const requestText = orderData.request || orderData.requestNote || '';

  const handleComplete = () => {
    navigate('/history');
  };

  return (
    <Container>
      <Content>
        <SendIcon>
          <Send />
        </SendIcon>

        <Title>
          {orderData.isRequestOnly
            ? '요청사항이 전달되었습니다!'
            : '주문이 완료되었습니다!'}
        </Title>
        <OrderNumber>
          주문번호 {orderData.orderNumbers.split('-')[0]}
        </OrderNumber>

        <OrderSummary>
          {/* 실제 주문한 아이템들 표시 */}
          {orderData.items && orderData.items.length > 0 && (
            <ItemsContainer>
              {orderData.items.map((item, index) => (
                <SummaryRow key={item.cartItemId || index}>
                  <ItemName>{item.menuName}</ItemName>
                  <ItemQuantity>{item.amount}개</ItemQuantity>
                </SummaryRow>
              ))}
            </ItemsContainer>
          )}

          {/* 총 금액 (요청사항만 있을 때는 표시 안 함) */}
          {!orderData.isRequestOnly && orderData.totalPrice !== undefined && (
            <TotalRow>
              <SummaryLabel>총 주문 금액</SummaryLabel>
              <SummaryValue>
                {orderData.totalPrice.toLocaleString()}원
              </SummaryValue>
            </TotalRow>
          )}

          {/* 요청사항 */}
          {requestText && (
            <>
              {((orderData.items && orderData.items.length > 0) ||
                (!orderData.isRequestOnly &&
                  orderData.totalPrice !== undefined)) && <Line></Line>}
              <RequestInfo>
                <RequestTitle>요청사항</RequestTitle>
                <RequestContent>{requestText}</RequestContent>
              </RequestInfo>
            </>
          )}
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
  marin-bottom: 0.5rem;
`;

const OrderNumber = styled.div`
  ${title_large}
  color: var(--primary);
  text-align: center;
  margin-bottom: 2rem;
`;

const OrderSummary = styled.div`
  display: flex;
  width: 100%;
  background: var(--gray100);
  border-radius: 0.625rem;
  border: 1px solid var(--Gray300, #d9d9d9);
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
  color: var(--black);
`;

const ItemQuantity = styled.div`
  ${title_medium}
  color: var(--black);
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
`;

const SummaryValue = styled.span`
  ${title_medium}
  color: var(--black);
`;

const RequestInfo = styled.div`
  width: 100%;
  text-align: left;
`;

const RequestTitle = styled.div`
  ${title_medium}
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const RequestContent = styled.div`
  ${body_large}
  color: var(--black);
`;

const ErrorMessage = styled.div`
  ${body_large}
  color: var(--gray700);
  margin-bottom: 2rem;
`;
