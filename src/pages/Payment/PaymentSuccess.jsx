import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  display_large,
  body_large,
  title_large,
  title_medium,
} from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';
import Send from '../../assets/icon/send-icon.svg?react';

//import { postPaymentConfirm } from '../../api/order';

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
      confirmPayment(paymentKey, orderId, amount);
    } else {
      setError('결제 정보가 올바르지 않습니다.');
      setIsProcessing(false);
    }
  }, [paymentKey, orderId, amount]);

  //order api 사용 버전(결제승인)
  // const confirmPayment = async (paymentKey, orderId, amount) => {
  //   try {
  //     const requestData = {
  //       paymentKey,
  //       orderId,
  //       amount: Number(amount),
  //     };

  //     console.log('결제 승인 요청:', requestData);

  //     //axios client 사용
  //     const result = await postPaymentConfirm(requestData);

  //     console.log('✅ 결제 승인 완료!', result);

  //     // 완료된 주문 정보 생성
  //     const completedOrderData = {
  //       paymentKey,
  //       orderId,
  //       amount: Number(amount),
  //       paymentStatus: 'completed',
  //       paymentData: result,
  //       completedAt: new Date().toISOString(),
  //     };

  //     setOrderInfo(completedOrderData);
  //     localStorage.removeItem('pendingOrder');

  //   } catch (error) {
  //     console.error('❌ 결제 승인 실패:', error);

  //         console.log('🔴 error.response:', error.response);
  //   console.log('🔴 error.response.data:', error.response?.data);
  //   console.log('🔴 error.response.status:', error.response?.status);
  //   console.log('🔴 error.message:', error.message);

  //   const errorMessage =
  //     error.response?.data?.message ||
  //     error.response?.data?.error ||
  //     error.response?.data?.code ||
  //     error.message ||
  //     '결제 승인 중 오류가 발생했습니다.';

  //     setError(errorMessage);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  // https 사용 버전(결제승인)
  const confirmPayment = async (paymentKey, orderId, amount) => {
    try {
      const requestData = {
        paymentKey,
        orderId,
        amount: Number(amount),
      };

      console.log('결제 승인 요청:', requestData);

      //localStorage에서 장바구니 정보 가져오기
      const pendingCart = localStorage.getItem('pendingCart');
      const cartInfo = pendingCart ? JSON.parse(pendingCart) : null;

      // paymentKey, orderId, amount 보내기, 결제승인 api 호출
      const response = await fetch(
        'https://hhatv6dqxr.apigw.ntruss.com/payment/toss-payment/v1/payments/confirm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        },
      );

      const result = await response.json();
      console.log('백엔드 응답:', result);

      if (response.ok) {
        console.log('✅ 결제 승인 완료!', result);

        // 완료된 주문 정보 생성
        const completedOrderData = {
          paymentKey,
          orderId,
          amount: Number(amount),
          paymentStatus: 'completed',
          paymentData: result,
          completedAt: new Date().toISOString(),
          items: cartInfo?.items || [],
          request: cartInfo?.request || '',
        };

        setOrderInfo(completedOrderData);

        // localStorage 정리 (필요시)
        localStorage.removeItem('pendingCart');
      } else {
        // 에러 응답 처리
        console.error('❌ 결제 승인 실패:', result);
        const errorMessage =
          result.message || result.error || '결제 승인 중 오류가 발생했습니다.';
        setError(errorMessage);
      }
    } catch (error) {
      console.error('결제 승인 API 호출 오류:', error);
      setError('서버와 통신 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleComplete = () => {
    navigate('/history', { state: orderInfo });
  };

  // 로딩 중
  if (isProcessing) {
    return (
      <Container>
        <Content>
          <LoadingSpinner />
          <Title>결제 승인 처리 중...</Title>
          <ProcessingText>잠시만 기다려 주세요</ProcessingText>
        </Content>
      </Container>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <Container>
        <Content>
          <ErrorMessage>{error}</ErrorMessage>
          <FullBottomButton onClick={handleGoHome}>
            메뉴로 돌아가기
          </FullBottomButton>
        </Content>
      </Container>
    );
  }

  // 주문 정보가 없는 경우
  if (!orderInfo) {
    return (
      <Container>
        <Content>
          <ErrorMessage>주문 정보를 찾을 수 없습니다.</ErrorMessage>
          <FullBottomButton onClick={handleGoHome}>
            메뉴로 돌아가기
          </FullBottomButton>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <SendIcon>
          <Send />
        </SendIcon>

        <Title>결제가 완료되었습니다!</Title>
        <OrderNumber>주문번호 {orderId.split('-')[0]}</OrderNumber>

        <OrderSummary>
          {/* 주문 아이템이 있는 경우 표시 */}
          {orderInfo.items && orderInfo.items.length > 0 && (
            <ItemsContainer>
              {orderInfo.items.map((item, index) => (
                <SummaryRow key={item.cartItemId || index}>
                  <ItemName>{item.menuName}</ItemName>
                  <ItemQuantity>{item.amount}개</ItemQuantity>
                </SummaryRow>
              ))}
            </ItemsContainer>
          )}

          {/* 총 금액 */}
          <TotalRow>
            <SummaryLabel>총 주문 금액</SummaryLabel>
            <SummaryValue>{Number(amount).toLocaleString()}원</SummaryValue>
          </TotalRow>

          {/* 요청사항이 있는 경우 표시 */}
          {orderInfo.request && (
            <>
              <Line></Line>
              <RequestInfo>
                <RequestTitle>요청사항</RequestTitle>
                <RequestContent>{orderInfo.request}</RequestContent>
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

export default PaymentSuccess;

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
  margin-bottom: 0.5rem;
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
  align-self: stretch;
  gap: 0.5rem;
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

const ProcessingText = styled.p`
  ${body_large}
  color: var(--gray600);
  margin: 0;
`;
