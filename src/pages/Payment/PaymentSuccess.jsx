import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_medium, body_large, body_medium } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(true);
  const [orderInfo, setOrderInfo] = useState(null);
  const [error, setError] = useState(null);

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    console.log('PaymentSuccess 페이지 로드:', { paymentKey, orderId, amount });

    if (paymentKey && orderId && amount) {
      // 1초 후 결제 승인 요청
      setTimeout(() => {
        confirmPayment(paymentKey, orderId, amount);
      }, 1000);
    } else {
      setError('결제 정보가 올바르지 않습니다.');
      setIsProcessing(false);
    }
  }, [paymentKey, orderId, amount]);

  // ✅ 결제 승인 API 호출
  const confirmPayment = async (paymentKey, orderId, amount) => {
    try {
      console.log('결제 승인 시작:', { paymentKey, orderId, amount });

      // 세민이한테 paymentKey, orderId, amount 보내기, 결제승인 api 호출
      const response = await fetch(
        'https://localhost:8080/v1/payments/confirm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        },
      );

      const result = await response.json();
      console.log('백엔드 응답:', result);

      if (response.ok) {
        console.log('✅ 결제 승인 완료!', result);

        // localStorage에서 주문 정보 가져오기
        const pendingOrderData = localStorage.getItem('pendingOrder');

        if (pendingOrderData) {
          try {
            const orderData = JSON.parse(pendingOrderData);

            // 완료된 주문 정보 생성
            const completedOrderData = {
              ...orderData,
              paymentKey,
              paidAmount: amount,
              chargedAmount: result.chargedAmount, // ✅ 백엔드 응답 필드
              paymentStatus: 'completed',
              paymentData: result,
              message: result.message, // ✅ "결제 성공"
              completedAt: new Date().toISOString(),
            };

            // Context의 주문 완료 처리
            setOrderInfo(completedOrderData);

            // localStorage 정리
            localStorage.removeItem('pendingOrder');
          } catch (parseError) {
            console.error('localStorage 파싱 오류:', parseError);
          }
        }
      } else {
        console.error('❌ 결제 승인 실패:', result);
        setError(result.message || '결제 승인 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('결제 승인 API 호출 오류:', error);
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    // 주문 완료 페이지가 있다면
    navigate('/orders', { state: orderInfo });
  };

  if (isProcessing) {
    return (
      <Container>
        <ProcessingContent>
          <LoadingSpinner />
          <ProcessingTitle>결제 승인 처리 중...</ProcessingTitle>
          <ProcessingText>잠시만 기다려 주세요</ProcessingText>
        </ProcessingContent>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContent>
          <ErrorIcon>❌</ErrorIcon>
          <ErrorTitle>결제 처리 실패</ErrorTitle>
          <ErrorText>{error}</ErrorText>
          <ButtonSection>
            <FullBottomButton onClick={handleGoHome}>
              홈으로 가기
            </FullBottomButton>
          </ButtonSection>
        </ErrorContent>
      </Container>
    );
  }

  return (
    <Container>
      <SuccessContent>
        <SuccessIcon>✅</SuccessIcon>
        <SuccessTitle>결제가 완료되었습니다!</SuccessTitle>

        <InfoSection>
          <InfoItem>
            <InfoLabel>주문번호</InfoLabel>
            <InfoValue>{orderId}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>결제금액</InfoLabel>
            <InfoValue>{Number(amount).toLocaleString()}원</InfoValue>
          </InfoItem>
          {/* ✅ 백엔드 응답 정보 추가 */}
          {orderInfo?.chargedAmount && (
            <InfoItem>
              <InfoLabel>실제 결제금액</InfoLabel>
              <InfoValue>
                {orderInfo.chargedAmount.toLocaleString()}원
              </InfoValue>
            </InfoItem>
          )}
          {orderInfo?.message && (
            <InfoItem>
              <InfoLabel>결제 상태</InfoLabel>
              <InfoValue>{orderInfo.message}</InfoValue>
            </InfoItem>
          )}
          {orderInfo?.storeInfo && (
            <InfoItem>
              <InfoLabel>매장</InfoLabel>
              <InfoValue>{orderInfo.storeInfo.storeName}</InfoValue>
            </InfoItem>
          )}
        </InfoSection>

        <ButtonSection>
          <FullBottomButton onClick={handleGoHome}>
            홈으로 가기
          </FullBottomButton>
          {orderInfo && (
            <SecondaryButton onClick={handleViewOrders}>
              주문 내역 보기
            </SecondaryButton>
          )}
        </ButtonSection>
      </SuccessContent>
    </Container>
  );
};

export default PaymentSuccess;

// 스타일 컴포넌트들
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--background);
  position: relative; //버튼 때문에 추가
`;

const ProcessingContent = styled.div`
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const LoadingSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ProcessingTitle = styled.h1`
  ${display_medium}
  color: var(--black);
  margin-bottom: 1rem;
`;

const ProcessingText = styled.p`
  ${body_large}
  color: var(--gray600);
  margin: 0;
`;

const SuccessContent = styled.div`
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h1`
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
  font-weight: 600;
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
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  ${body_large}
  color: var(--gray600);
  margin-bottom: 2rem;
`;
