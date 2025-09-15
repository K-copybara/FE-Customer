// ReviewCompletePage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_large, display_medium } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';

const ReviewCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const orderNumber = state?.orderNumber || '알 수 없음';

  return (
    <Container>
      <Content>
        <SendIcon>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.33333 18.6667C5.66667 17.9722 5.27778 17.1944 5.16667 16.3333C5.08333 15.4444 5.27778 14.6389 5.75 13.9167C6.25 13.1944 6.95833 12.6944 7.875 12.4167L29.125 6.125C30.0694 5.84722 30.9722 5.90278 31.8333 6.29167C32.7222 6.65278 33.3472 7.27778 33.7083 8.16667C34.0972 9.02778 34.1528 9.93055 33.875 10.875L27.5833 32.125C27.3056 33.0417 26.8056 33.75 26.0833 34.25C25.3611 34.7222 24.5556 34.9167 23.6667 34.8333C22.8056 34.7222 22.0278 34.3333 21.3333 33.6667L6.33333 18.6667ZM24.625 32.25C24.8194 32.4722 24.8333 32.6528 24.6667 32.7917C24.5278 32.9028 24.3611 32.9306 24.1667 32.875C23.9722 32.8194 23.9167 32.6528 24 32.375L31.0833 8.5C31.1667 8.22222 31.3056 8.11111 31.5 8.16667C31.6944 8.19444 31.8056 8.30555 31.8333 8.5C31.8889 8.69444 31.7778 8.83333 31.5 8.91666L7.625 16C7.34722 16.0833 7.18056 16.0278 7.125 15.8333C7.06944 15.6111 7.09722 15.4306 7.20833 15.2917C7.34722 15.1528 7.52778 15.1806 7.75 15.375L24.625 32.25ZM13.8333 23.8333L20.5 17.1667C20.9722 16.6944 21.5 16.5556 22.0833 16.75C22.6944 16.9444 23.0972 17.3333 23.2917 17.9167C23.4861 18.4722 23.3333 19 22.8333 19.5L16.1667 26.1667L13.8333 23.8333Z" fill="white"/>
          </svg>

        </SendIcon>
        
        <Title>리뷰가 완성되었습니다!</Title>
        <OrderNumber>주문번호 {orderNumber}</OrderNumber>

      
      <FullBottomButton onClick={() => navigate('/history')}>
        주문 내역 보기
      </FullBottomButton>
      </Content>
    </Container>
  );
};

export default ReviewCompletePage;

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background);
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
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
  margin-bottom: 5rem;
`;

