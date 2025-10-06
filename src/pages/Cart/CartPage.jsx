import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  display_medium,
  body_large,
  body_medium,
  body_small,
  display_small,
} from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';
import PageHeader from '../../components/common/PageHeader';
import { storeInfo } from '../../store/dummyStore';
import { useCartStore } from '../../store/useCartStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { fetchCart, clearCart, cartItems, totalPrice } = useCartStore();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [tempRequestText, setTempRequestText] = useState('');

  // 결제위젯 관련 state
  const handleQuantityChange = (id, change) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      //장바구니 수량 변경 api
      fetchCart();
    }
  };

  const handleRemoveItem = (cartItemId) => {
    //장바구니 삭제 api
    fetchCart();
  };

  const handleRequestComplete = () => {
    setRequestText(tempRequestText);
    setShowRequestModal(false);
  };

  const handleRequestEdit = () => {
    setTempRequestText(requestText);
    setShowRequestModal(true);
  };

  // ✅ 결제창 방식으로 결제 요청
  const handlePayment = async () => {
    try {
      console.log('결제 준비 API 호출 시작');

      // ✅ 간단한 요청 body (3개 값만)
      const requestBody = {
        cartId: 'cart_' + Date.now(), // 또는 실제 cartId 값
        storeId: storeInfo?.storeId || 'store_123',
        tableId: storeInfo?.tableNumber || 'table_1', // tableNumber를 tableId로 사용
      };

      console.log('결제 준비 요청:', requestBody);

      // ✅ 백엔드 결제 준비 API 호출
      const prepareResponse = await fetch(
        'http://localhost:8080/v1/payments/prepare',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!prepareResponse.ok) {
        throw new Error('결제 준비 실패');
      }

      const { clientKey, orderId, customerKey } = await prepareResponse.json();
      console.log('결제 준비 완료:', { clientKey, orderId, customerKey });

      // localStorage에 주문 정보 저장 (기존 방식 유지)

      localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      // 토스 결제창 호출 (백엔드에서 받은 키 사용)
      if (typeof window.TossPayments === 'undefined') {
        alert('결제 시스템이 로딩되지 않았습니다. 페이지를 새로고침해주세요.');
        return;
      }

      const tossPayments = window.TossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: customerKey });

      await payment.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: totalPrice,
        },
        orderId: orderId, // 백엔드에서 받은 orderId
        orderName: `${storeInfo.storeName} 주문 (${cartItems.length}건)`,
        customerName: '고객',
        customerEmail: 'customer@example.com',
        card: {
          useEscrow: false,
          flowMode: 'DEFAULT',
          useCardPoint: false,
          useAppCardOnly: false,
        },
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error('결제 요청 실패:', error);
      if (error.code === 'USER_CANCEL') {
        console.log('사용자가 결제를 취소했습니다.');
      } else {
        alert('결제 요청 중 오류가 발생했습니다: ' + error.message);
      }
    }
  };

  return (
    <Container>
      <PageHeader title="장바구니" onClick={() => navigate('/')} />

      <Content>
        <StoreInfo>
          <StoreTitle>{storeInfo.storeName}</StoreTitle>
          <TableInfo>{storeInfo.tableNumber}번 테이블</TableInfo>
        </StoreInfo>

        {cartItems.length === 0 ? (
          <EmptyCartContent>
            <EmptyMessage>메뉴를 담아주세요</EmptyMessage>
            <EmptyButton onClick={() => navigate('/')}>
              메뉴 보러가기
            </EmptyButton>
          </EmptyCartContent>
        ) : (
          <>
            <OrderCount>총 {cartItems.length}건</OrderCount>

            <CartItems>
              {cartItems.map((item) => (
                <CartItem key={item.menuId}>
                  <ItemRow>
                    <ItemImage src={item.menuPicture} alt={item.menuName} />
                    <ItemInfo>
                      <ItemName>{item.menuName}</ItemName>

                      <PriceQuantitySection>
                        <ItemPrice>{item.price.toLocaleString()}원</ItemPrice>
                        <QuantityControls>
                          <QuantityButton
                            onClick={() =>
                              handleQuantityChange(item.cartItemId, -1)
                            }
                            disabled={item.amount <= 1}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.33333 10.8333C2.98611 10.8333 2.74306 10.6944 2.60417 10.4167C2.47917 10.1389 2.47917 9.86111 2.60417 9.58333C2.74306 9.30556 2.98611 9.16667 3.33333 9.16667H16.6667C17.0139 9.16667 17.25 9.30556 17.375 9.58333C17.5139 9.86111 17.5139 10.1389 17.375 10.4167C17.25 10.6944 17.0139 10.8333 16.6667 10.8333H3.33333Z"
                                fill="#717171"
                              />
                            </svg>
                          </QuantityButton>
                          <QuantityDisplay>{item.amount}</QuantityDisplay>
                          <QuantityButton
                            onClick={() =>
                              handleQuantityChange(item.cartItemId, 1)
                            }
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.33333 10.8333C2.98611 10.8333 2.74306 10.6944 2.60417 10.4167C2.47917 10.1389 2.47917 9.86111 2.60417 9.58333C2.74306 9.30556 2.98611 9.16667 3.33333 9.16667H16.6667C17.0139 9.16667 17.25 9.30556 17.375 9.58333C17.5139 9.86111 17.5139 10.1389 17.375 10.4167C17.25 10.6944 17.0139 10.8333 16.6667 10.8333H3.33333ZM9.16667 3.33333C9.16667 2.98611 9.30556 2.75 9.58333 2.625C9.86111 2.48611 10.1389 2.48611 10.4167 2.625C10.6944 2.75 10.8333 2.98611 10.8333 3.33333V16.6667C10.8333 17.0139 10.6944 17.2569 10.4167 17.3958C10.1389 17.5208 9.86111 17.5208 9.58333 17.3958C9.30556 17.2569 9.16667 17.0139 9.16667 16.6667V3.33333Z"
                                fill="#717171"
                              />
                            </svg>
                          </QuantityButton>
                        </QuantityControls>
                      </PriceQuantitySection>
                    </ItemInfo>
                  </ItemRow>
                  <RemoveButton
                    onClick={() => handleRemoveItem(item.cartItemId)}
                  >
                    ×
                  </RemoveButton>
                </CartItem>
              ))}
            </CartItems>

            <RequestSection>
              {requestText ? (
                <RequestWithText onClick={handleRequestEdit}>
                  <RequestLabel>요청사항</RequestLabel>
                  <RequestContent>
                    <RequestPreview>{requestText}</RequestPreview>
                    <ArrowIcon>›</ArrowIcon>
                  </RequestContent>
                </RequestWithText>
              ) : (
                <RequestButton onClick={() => setShowRequestModal(true)}>
                  요청사항 추가하기
                </RequestButton>
              )}
            </RequestSection>
          </>
        )}
      </Content>

      {/* 결제 버튼 */}
      {cartItems.length > 0 && (
        <FullBottomButton onClick={handlePayment}>
          {totalPrice.toLocaleString()}원 결제하기
        </FullBottomButton>
      )}

      {/* 요청사항 모달 */}
      {showRequestModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>요청사항</ModalTitle>
            </ModalHeader>
            <TextArea
              value={tempRequestText}
              onChange={(e) => setTempRequestText(e.target.value)}
              placeholder="매장에 요청할 내용을 적어주세요"
              maxLength={100}
            />
            <FullBottomButton onClick={handleRequestComplete}>
              완료
            </FullBottomButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CartPage;

const EmptyCartContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  gap: 1.5rem;
`;

const EmptyMessage = styled.p`
  ${display_medium}
  color: var(--gray600);
  margin: 0;
  text-align: center;
`;

const EmptyButton = styled.button`
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 0.625rem;
  padding: 0.875rem 2rem;
  ${body_large}
  cursor: pointer;

  &:hover {
    background: var(--secondary);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: var(--background);
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  flex: 1;
  padding: 0 1rem;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const StoreInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.88rem;
  margin-bottom: 1.88rem;
`;

const StoreTitle = styled.h2`
  ${display_medium}
  color: var(--black);
  margin: 0;
`;

const OrderCount = styled.div`
  ${body_large}
  color: var(--black);
`;

const TableInfo = styled.span`
  ${display_small}
  color: var(--black);
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartItem = styled.div`
  display: flex;
  padding: 1.5rem 0 1.5rem 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--Gray100, #fafafc);
  position: relative;
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 0.625rem;
  object-fit: cover;
  background: var(--gray100);
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ItemName = styled.div`
  ${display_medium}
  color: var(--black);
`;

const ItemPrice = styled.div`
  ${body_large}
  color: var(--black);
`;

const QuantityControls = styled.div`
  display: flex;
  padding: 0.25rem 0.75rem;
  align-items: center;
  gap: 0.75rem;

  border-radius: 0.625rem;
  border: 1px solid var(--Gray300, #d9d9d9);
  background: var(--white);
`;

const QuantityButton = styled.button`
  ${display_medium}
  background: none;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  color: var(--Gray700, #717171);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PriceQuantitySection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const QuantityDisplay = styled.span`
  ${body_large}
  color: var(--black);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--gray500);
  cursor: pointer;
`;

const RequestSection = styled.div`
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RequestButton = styled.button`
  ${body_large}
  display: flex;
  align-items: center;
  justify-content: center;
  width: 21.875rem;
  padding: 0.62rem 0;

  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  background: var(--background);
  color: var(--primary, #190eaa);
  cursor: pointer;
`;

const RequestWithText = styled.button`
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--gray300);
  border-radius: 0.5rem;
  background: var(--background);
  cursor: pointer;
  text-align: left;
`;

const RequestLabel = styled.div`
  ${body_small}
  color: var(--gray500);
  margin-bottom: 0.25rem;
`;

const RequestContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RequestPreview = styled.div`
  ${body_medium}
  color: var(--black);
`;

const ArrowIcon = styled.span`
  color: var(--gray500);
  font-size: 1.25rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  background: var(--background);
  border-radius: 1rem 1rem 0 0;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 65vh;
  position: relative;
`;

const ModalHeader = styled.div`
  text-align: left;
  padding: 0.62rem;
`;

const ModalTitle = styled.h3`
  ${display_medium}
  color: var(--black);
  margin: 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  height: 7.5rem;
  border: 1px solid var(--gray300);
  border-radius: 0.625rem;
  align-items: center;
  ${body_large}
  resize: none;
  outline: none;

  &::placeholder {
    color: var(--gray700);
  }
`;
