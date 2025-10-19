import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  display_medium,
  body_large,
  body_medium,
  title_medium,
  title_large,
  display_large,
} from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';
import PageHeader from '../../components/common/PageHeader';

import DeleteIcon from '../../assets/icon/delete-icon.svg?react';

import { deleteCart, getCartData, patchCart } from '../../api/cart';
import { postRequest, postPaymentPrepare } from '../../api/order';
import { useUserStore } from '../../store/useUserStore';
import { CartItem } from '../../components/cart/CartItem';

const CartPage = () => {
  const navigate = useNavigate();
  const { storeId, storeName, tableId, customerKey } = useUserStore();
  const [cartData, setCartData] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [tempRequestText, setTempRequestText] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCartData(storeId, customerKey);
        setCartData(res);
      } catch (err) {
        console.error('장바구니 조회 실패:', err);
        //에러가 나도 빈 장바구니로 처리
        setCartData({ items: [], totalPrice: 0 });
      }
    };
    fetchCart();
  }, [refresh]);

  // 장바구니 수량 변경
  const handleQuantityChange = async (id, amount) => {
    setCartData((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.cartItemId === id ? { ...item, amount } : item,
      );
      const updatedTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.amount,
        0,
      );
      return { ...prev, items: updatedItems, totalPrice: updatedTotalPrice };
    });
    try {
      await patchCart(id, { amount });
    } catch (err) {
      alert('수량 변경 실패. 다시 시도해주세요.');
      setRefresh((r) => r + 1);
      console.error(err);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    setCartData((prev) => {
      const updatedItems = prev.items.filter(
        (item) => item.cartItemId !== cartItemId,
      );
      const updatedTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.amount,
        0,
      );
      return { ...prev, items: updatedItems, totalPrice: updatedTotalPrice };
    });
    try {
      await deleteCart(cartItemId);
    } catch (err) {
      alert('메뉴 삭제에 실패했습니다. 다시 시도해주세요.');
      setRefresh((r) => r + 1);
      console.error(err);
    }
  };

  // 요청사항 완료
  const handleRequestComplete = () => {
    // 공백만 있는지 체크
    if (tempRequestText.trim().length === 0 && tempRequestText.length > 0) {
      alert('요청사항을 입력해주세요.');
      return;
    }

    setRequestText(tempRequestText);
    setShowRequestModal(false);
  };

  const handleRequestEdit = () => {
    setTempRequestText(requestText);
    setShowRequestModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowRequestModal(false);
    setTempRequestText(requestText); // 취소 시 원래 값으로 되돌림
  };

  //작성된 요청사항 삭제
  const handleDeleteRequest = (e) => {
    e.stopPropagation(); //모달이 열리는 것 방지
    setRequestText('');
  };

  //요청사항이랑 메뉴 아이템  기준으로 분리
  const separateItems = () => {
    // cartData가 null이면 빈 배열 반환
    if (!cartData || !cartData.items) {
      return { requestItems: [], menuItems: [] };
    }
    const requestItems = cartData.items.filter(
      (item) => item.menuCategory === '요청사항',
    );
    const menuItems = cartData.items.filter(
      (item) => item.menuCategory !== '요청사항',
    );
    return { requestItems, menuItems };
  };

  // 요청사항만 전송하는 함수
  const sendRequestOnly = async (requestItems, requestNote) => {
    const requestBody = {
      storeId: storeId,
      tableId: tableId,
      customerKey: customerKey,
    };

    // 요청 메모가 있으면 추가
    if (requestNote && requestNote.trim().length > 0) {
      requestBody.requestNote = requestNote.trim();
    }

    // 요청 아이템이 있으면 추가
    if (requestItems && requestItems.length > 0) {
      requestBody.items = requestItems.map((item) => ({
        menuId: item.menuId,
        menuName: item.menuName,
        amount: item.amount,
      }));
    }

    console.log('요청사항 전송:', requestBody);

    try {
      const result = await postRequest(requestBody);
      console.log('요청사항 전송 성공:', result);
      return result;
    } catch (error) {
      console.error('요청사항 전송 실패:', error);
      throw error;
    }
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
      //메뉴 아이템이 포함된 모든 경우(결제)
      if (hasMenuItems) {
        if (hasMenuItems && !hasRequestItems && !hasRequestText) {
          console.log('- 메뉴만');
        } else if (hasMenuItems && !hasRequestItems && hasRequestText) {
          console.log('- 메뉴 + 요청사항 메모');
        } else if (hasMenuItems && hasRequestItems && !hasRequestText) {
          console.log('- 메뉴 + 요청사항 아이템');
        } else if (hasMenuItems && hasRequestItems && hasRequestText) {
          console.log('- 메뉴 + 요청사항 메모 + 요청사항 아이템');
        }
        await handlePayment();
        return;
      }

      // 요청사항만 있는 경우 (결제 없음)
      if (!hasMenuItems && (hasRequestItems || hasRequestText)) {
        if (!hasMenuItems && hasRequestItems && !hasRequestText) {
          console.log('- 요청사항 아이템만'); //성공
        } else if (!hasMenuItems && !hasRequestItems && hasRequestText) {
          console.log('- 요청사항 텍스트만');
        } else if (!hasMenuItems && hasRequestItems && hasRequestText) {
          console.log('- 요청사항 아이템 + 요청사항 텍스트'); //성공
        }

        const response = await sendRequestOnly(requestItems, requestText);
        console.log('요청사항 전송 결과:', response);

        navigate('/ordercomplete', {
          state: {
            isRequestOnly: true,
            message: '요청사항이 전달되었습니다.',
            orderNumber: response.orderRequestId,
            requestNote: requestText,
            items: requestItems,
            totalPrice: 0,
          },
        });
        return;
      }
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

      // 결제 전 장바구니 정보 저장
      localStorage.setItem(
        'pendingCart',
        JSON.stringify({
          items: cartData.items,
          request: requestText,
          totalPrice: cartData.totalPrice,
        }),
      );

      const trimmedRequestText = requestText.trim();

      //결제준비로 보낼 데이터
      const prepareRequestBody = {
        cartId: cartData.cartId,
        storeId: storeId,
        tableId: tableId,
        ...(trimmedRequestText && { requestNote: trimmedRequestText }),
      };

      console.log('결제 준비 요청:', prepareRequestBody);

      //결제준비 api 호출
      const prepareData = await postPaymentPrepare(prepareRequestBody);

      //받은  clientKey, orderId, customerKey
      const {
        clientKey,
        orderId,
        customerKey: returnedCustomerKey,
      } = prepareData;
      console.log('결제 준비 완료:', {
        clientKey,
        orderId,
        customerKey: returnedCustomerKey,
      });

      //localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      // 토스 결제창 호출
      if (typeof window.TossPayments === 'undefined') {
        alert('결제 시스템이 로딩되지 않았습니다. 페이지를 새로고침해주세요.');
        return;
      }

      const tossPayments = window.TossPayments(clientKey);
      const payment = tossPayments.payment({
        customerKey: returnedCustomerKey,
      });

      await payment.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: cartData.totalPrice,
        },
        orderId: orderId, // 백엔드에서 받은 orderId
        orderName: `${storeName} 주문 (${cartData.items.length}건)`,
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

  //버튼 표시 조건 및 텍스트 결정
  const { requestItems, menuItems } = separateItems();
  const hasRequestText = requestText.trim().length > 0;
  const hasRequestItems = requestItems.length > 0;
  const hasMenuItems = menuItems.length > 0;

  // 버튼을 표시할 조건
  const showOrderButton = hasMenuItems || hasRequestItems || hasRequestText;

  // 버튼 텍스트 결정
  const buttonText = hasMenuItems
    ? `${cartData.totalPrice.toLocaleString()}원 결제하기`
    : hasRequestItems || hasRequestText
      ? '요청사항 전달하기'
      : '';

  return (
    <Container>
      <PageHeader title="장바구니" onClick={() => navigate('/')} />
      {cartData ? (
        <>
          <Content>
            <StoreInfo>
              <StoreTitle>{storeName}</StoreTitle>
              <TableInfo>{tableId}번 테이블</TableInfo>
            </StoreInfo>

            {/*장바구니가 비어있어도 UI 표시 */}
            {cartData.items.length === 0 ? (
              <EmptyCartContent>
                <EmptyMessage>텅</EmptyMessage>
                <EmptyDescription>메뉴를 추가해주세요</EmptyDescription>
              </EmptyCartContent>
            ) : (
              <>
                <OrderCount>총 {cartData.items.length}건</OrderCount>

                <CartItems>
                  {cartData.items.map((item) => (
                    <CartItem
                      key={`cart-${item.menuId}`}
                      item={item}
                      onChangeAmount={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </CartItems>
              </>
            )}

            <RequestSection>
              {requestText ? (
                <RequestWithText onClick={handleRequestEdit}>
                  <RequestHeader>
                    <RequestLabel>요청사항</RequestLabel>
                    <DeleteIcon onClick={handleDeleteRequest} />
                  </RequestHeader>
                  <RequestPreview>{requestText}</RequestPreview>
                </RequestWithText>
              ) : (
                <RequestButton onClick={() => setShowRequestModal(true)}>
                  요청사항 추가하기
                </RequestButton>
              )}
            </RequestSection>
          </Content>

          {/* 결제하기 or 요청사항 전달하기 */}
          {showOrderButton ? (
            <FullBottomButton onClick={handleOrder}>
              {buttonText}
            </FullBottomButton>
          ) : null}
        </>
      ) : (
        <div>로딩 중...</div>
      )}
      {/* 요청사항 모달 */}
      {showRequestModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
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
  ${display_large}
  color: var(--black);
  margin: 0;
  text-align: center;
`;

const EmptyDescription = styled.p`
  ${body_medium}
  color: var(--gray500);
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
  ${title_medium}
  color: var(--black);
`;

const TableInfo = styled.span`
  ${body_medium}
  color: var(--black);
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
`;

const RequestSection = styled.div`
  padding: 0.5rem;
  display: flex;
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
  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  background: var(--background);
  cursor: pointer;
  text-align: left;
  gap: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RequestLabel = styled.div`
  ${body_large}
  color: var(--gray500);
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

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  ${title_large}
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
