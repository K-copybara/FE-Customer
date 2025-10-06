import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_medium, body_large, body_medium } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorInfo, setErrorInfo] = useState({});

  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    console.log('결제 실패 정보:', { code, message, orderId });
    
    setErrorInfo({
      code: code || '알 수 없음',
      message: message ? decodeURIComponent(message) : '결제 중 오류가 발생했습니다.',
      orderId: orderId || '알 수 없음'
    });
  }, [code, message, orderId]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    // 장바구니로 돌아가기
    navigate('/cart');
  };

  return (
    <Container>
      <ErrorContent>
        <ErrorIcon>❌</ErrorIcon>
        <ErrorTitle>결제가 실패했습니다</ErrorTitle>
        
        <InfoSection>
          <InfoItem>
            <InfoLabel>주문번호</InfoLabel>
            <InfoValue>{errorInfo.orderId}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>오류 코드</InfoLabel>
            <InfoValue>{errorInfo.code}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>오류 메시지</InfoLabel>
            <InfoValue>{errorInfo.message}</InfoValue>
          </InfoItem>
        </InfoSection>

        <ButtonSection>
          <FullBottomButton onClick={handleRetry}>
            다시 시도하기
          </FullBottomButton>
          <SecondaryButton onClick={handleGoHome}>
            홈으로 가기
          </SecondaryButton>
        </ButtonSection>
      </ErrorContent>
    </Container>
  );
};

export default PaymentFail;

// 스타일 컴포넌트들 (PaymentSuccess와 동일)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--background);
`;

const ErrorContent = styled.div`
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h1`
  ${display_medium}
  color: var(--black);
  margin-bottom: 2rem;
`;

const InfoSection = styled.div`
  background: var(--white);
  border-radius: 0.625rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  ${body_medium}
  color: var(--gray600);
`;

const InfoValue = styled.span`
  ${body_medium}
  color: var(--black);
  word-break: break-word;
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SecondaryButton = styled.button`
  background: var(--background);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 0.625rem;
  padding: 1rem;
  ${body_large}
  cursor: pointer;
  
  &:hover {
    background: var(--gray50);
  }
`;
