import { useState } from 'react';
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

import Amountplus from '../../assets/icon/amountplus-icon.svg?react';
import Amountminus from '../../assets/icon/amountminus-icon.svg?react';
import Delete from '../../assets/icon/delete-icon.svg?react';

const CartPage = () => {
  const navigate = useNavigate();
  const { fetchCart, items, cartId, totalPrice, customerKey } = useCartStore(); //clearCart삭제
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [tempRequestText, setTempRequestText] = useState('');

  // 결제위젯 관련 state
  const handleQuantityChange = (id, change) => {
    const item = items.find((item) => item.id === id);
    console.log('수량변경', change);
    if (item) {
      //장바구니 수량 변경 api
      fetchCart();
    }
  };

  const handleRemoveItem = (cartItemId) => {
    //장바구니 삭제 api
    console.log('삭제', cartItemId);
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

  //요청사항이랑 메뉴 아이템  기준으로 분리
  const separateItems = () => {
    const requestItems = items.filter(
      (item) =>
        item.category?.categoryId === 99 && item.menuName === '요청사항',
    );
    const menuItems = items.filter((item) => item.category?.categoryId !== 99);
    return { requestItems, menuItems };
  };

  //주문 처리
  const handleOrder = async () => {
    const { requestItems, menuItems } = separateItems();
    const hasRequestText = requestText.trim().length > 0;
    const hasRequestItems = requestItems.length > 0;
    const hasMenuItems = menuItems.length > 0;

    console.log('주문 처리 시작:', {
      requestItems: requestItems.length,
      menuItems: menuItems.length,
      hasRequestText,
      결제여부: hasMenuItems ? '결제진행' : '바로완료',
    });

    try {
      //메뉴 아이템이 포함된 모든 경우 → 결제 진행
      if (hasMenuItems) {
        if (hasMenuItems && !hasRequestItems && !hasRequestText) {
          console.log('- 메뉴만');
        } else if (hasMenuItems && !hasRequestItems && hasRequestText) {
          console.log('- 메뉴 + 요청사항 텍스트');
        } else if (hasMenuItems && hasRequestItems && !hasRequestText) {
          console.log('- 메뉴 + 요청사항 아이템');
        } else if (hasMenuItems && hasRequestItems && hasRequestText) {
          console.log('- 메뉴 + 요청사항 텍스트 + 요청사항 아이템');
        }
        await handlePayment();
        return;
      }

      // 요청사항만 있는 경우 → 바로 완료 (결제 없음)
      if (!hasMenuItems && (hasRequestItems || hasRequestText)) {
        if (!hasMenuItems && hasRequestItems && !hasRequestText) {
          console.log('- 요청사항 아이템만');
        } else if (!hasMenuItems && !hasRequestItems && hasRequestText) {
          console.log('- 요청사항 텍스트만');
        } else if (!hasMenuItems && hasRequestItems && hasRequestText) {
          console.log('- 요청사항 아이템 + 요청사항 텍스트');
        }

        await sendRequestOnly(requestItems, requestText);
        navigate('/ordercomplete', {
          state: {
            isRequestOnly: true,
            message: '요청사항이 전달되었습니다.',
          },
        });
        return;
      }

      const sendRequestOnly = async (requestItems, requestNote) => {
        const requestBody = {
          storeId: storeInfo.storeId || 1,
          customerKey: customerKey, //useCartStore에서 가져왔음..맞는지 모르겠
          requestNote: requestNote || null,
          items: requestItems.map((item) => ({
            menuId: item.menuId,
            amount: item.amount,
          })),
        };

        console.log('요청사항 전송:', requestBody);

        // 더미 응답
        const mockResponse = {
          data: {
            orderRequestId: 1,
            storeId: storeInfo.storeId,
            customerKey: customerKey,
            requestNote: requestNote || null,
            items: requestItems.map((item, index) => ({
              orderRequestItemId: index + 1,
              menuId: item.menuId,
              amount: item.amount,
            })),
          },
        };

        console.log('요청사항 전송 성공:', mockResponse);
        return mockResponse;
      };

      // 예외 상황
      alert('주문할 항목이 없습니다.');
    } catch (error) {
      console.error('주문 처리 실패:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  };

  // 결제창 방식으로 결제 요청
  const handlePayment = async () => {
    try {
      console.log('결제 준비 API 호출 시작');

      const trimmedRequestText = requestText.trim();

      const requestBody = {
        cartId: cartId || 1234,
        storeId: storeInfo.storeId || 'store_123',
        tableId: storeInfo.tableId || 'table_1', // tableNumber를 tableId로 사용
        ...(trimmedRequestText && { requestNote: trimmedRequestText }),
      };

      console.log('결제 준비 요청:', requestBody);

      // 백엔드 결제 준비 API 호출
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

      //세민한테 받은  clientKey, orderId, customerKey
      const { clientKey, orderId, customerKey } = await prepareResponse.json();
      console.log('결제 준비 완료:', { clientKey, orderId, customerKey });

      // localStorage에 주문 정보 저장 (기존 방식 유지)

      //localStorage.setItem('pendingOrder', JSON.stringify(orderData));

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
        orderName: `${storeInfo.shopName} 주문 (${items.length}건)`,
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
          <StoreTitle>{storeInfo.shopName}</StoreTitle>
          <TableInfo>{storeInfo.tableId}번 테이블</TableInfo>
        </StoreInfo>

        {items.length === 0 ? (
          <EmptyCartContent>
            <EmptyMessage>메뉴를 담아주세요</EmptyMessage>
            <EmptyButton onClick={() => navigate('/')}>
              메뉴 보러가기
            </EmptyButton>
          </EmptyCartContent>
        ) : (
          <>
            <OrderCount>총 {items.length}건</OrderCount>

            <CartItems>
              {items.map((item) => (
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
                            <Amountminus />
                          </QuantityButton>
                          <QuantityDisplay>{item.amount}</QuantityDisplay>
                          <QuantityButton
                            onClick={() =>
                              handleQuantityChange(item.cartItemId, 1)
                            }
                          >
                            <Amountplus />
                          </QuantityButton>
                        </QuantityControls>
                      </PriceQuantitySection>
                    </ItemInfo>
                  </ItemRow>
                  <RemoveButton
                    onClick={() => handleRemoveItem(item.cartItemId)}
                  >
                    <Delete />
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

      {/* 결제하기 or 요청사항 전달하기 */}
      {items.length > 0 && (
        <FullBottomButton onClick={handleOrder}>
          {(() => {
            const { requestItems, menuItems } = separateItems();
            const hasMenuItems = menuItems.length > 0;
            console.log('주문 처리:', { requestItems, menuItems });
            if (hasMenuItems) {
              return `${totalPrice.toLocaleString()}원 결제하기`;
            } else {
              return '요청사항 전달하기';
            }
          })()}
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
