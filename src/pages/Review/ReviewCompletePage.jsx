// ReviewCompletePage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_large, title_large } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';

import Send from '../../assets/icon/send-icon.svg?react';

const ReviewCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const orderId = state?.orderId || '알 수 없음';

  return (
    <Container>
      <Content>
        <SendIcon>
          <Send />
        </SendIcon>
        
        <Title>리뷰가 완성되었습니다!</Title>
        <OrderNumber>주문번호 {orderId}</OrderNumber>

      
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

  marin-bottom: 0.5rem;
`;

const OrderNumber = styled.div`
  ${title_large}
  color: var(--primary);
  text-align: center;
  margin-bottom: 5rem;
`;

