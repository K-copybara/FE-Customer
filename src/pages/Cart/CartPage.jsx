import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_medium, body_large, body_medium, body_small, display_small } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';
import PageHeader from '../../components/common/PageHeader';
import { useCart } from '../../hooks/useCart';
import { useStore } from '../../hooks/useStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice, completeOrder } = useCart(); // 추가
  const { storeInfo } = useStore(); 
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [tempRequestText, setTempRequestText] = useState('');

  const handleQuantityChange = (cartItemId, change) => {
    const item = cartItems.find(item => item.cartItemId === cartItemId);
    if (item) {
      updateQuantity(cartItemId, item.quantity + change); // 수정된 부분
    }
  };

  const handleRemoveItem = (cartItemId) => {
    removeFromCart(cartItemId); // 수정된 부분
  };

  const handleRequestComplete = () => {
    setRequestText(tempRequestText);
    setShowRequestModal(false);
  };

  const handleRequestEdit = () => {
    setTempRequestText(requestText);
    setShowRequestModal(true);
  };

  const handleOrder = () => {
    const orderData = {
      items: cartItems,
      totalPrice: totalPrice,
      request: requestText || '없음',
      orderNumber: Math.floor(Math.random() * 100) + 1 // 랜덤 주문번호
    };
    // Context의 completeOrder 사용
    const completedOrder = completeOrder(orderData);
    clearCart(); // 수정된 부분
    navigate('/ordercomplete', { state: completedOrder});
  };

  return (
    <Container>
      <PageHeader 
        title="장바구니" 
        onBackClick={() => navigate('/')} // onClick → onBackClick으로 수정
      />

      <Content>
        <StoreInfo>
          <StoreTitle>{storeInfo.storeName}</StoreTitle>
          <TableInfo>{storeInfo.tableNumber}</TableInfo>
        </StoreInfo>

        {cartItems.length === 0 ? (
          // 장바구니가 비어있을 때 표시
          <EmptyCartContent>
            <EmptyMessage>메뉴를 담아주세요</EmptyMessage>
            <EmptyButton onClick={() => navigate('/')}>메뉴 보러가기</EmptyButton>
          </EmptyCartContent>
        ) : (
          // 장바구니에 아이템이 있을 때 표시
          <>
            <OrderCount>총 {cartItems.length}건</OrderCount>

            <CartItems>
              {cartItems.map((item) => (
                <CartItem key={item.cartItemId}>
                  <ItemRow>
                    <ItemImage src={item.imgUrl} alt={item.name} />
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      
                      <PriceQuantitySection>
                        <ItemPrice>{item.price.toLocaleString()}원</ItemPrice>
                        <QuantityControls>
                          <QuantityButton 
                            onClick={() => handleQuantityChange(item.cartItemId, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                              <path d="..." fill="#717171"/>
                            </svg>
                          </QuantityButton>
                          <QuantityDisplay>{item.quantity}</QuantityDisplay>
                          <QuantityButton onClick={() => handleQuantityChange(item.cartItemId, 1)}>
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                              <path d="..." fill="#717171"/>
                            </svg>
                          </QuantityButton>
                        </QuantityControls>
                      </PriceQuantitySection>
                    </ItemInfo>
                  </ItemRow>
                  <RemoveButton onClick={() => handleRemoveItem(item.cartItemId)}>
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

      {/* 아이템이 있을 때만 주문 버튼 표시 */}
      {cartItems.length > 0 && (
        <FullBottomButton onClick={handleOrder}>
          {totalPrice.toLocaleString()}원 주문하기
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

// 기존 스타일 + 빈 장바구니 스타일 추가
const EmptyCart = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

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
  font-weight: 500;
`;

const EmptyButton = styled.button`
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 0.625rem;
  padding: 0.875rem 2rem;
  font-family: "Pretendard Variable";
  ${body_large}
  font-weight: 600;
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
  overflow-y: auto; /* Content 영역에서만 스크롤 */
  /* 스크롤체인 방지 */
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
  font-family: 'Pretendard Variable';
`;
const TableInfo = styled.span`
  ${display_small}
  color: var(--black);
  font-weight: 400;
  line-height: 150%;
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
  border-bottom: 1px solid var(--Gray100, #FAFAFC);
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
  font-weight: 600;
  color: var(--black);
`;

const ItemPrice = styled.div`
  ${body_large}
  color: var(--black);
  font-weight: 600;
`;

const QuantityControls = styled.div`
  display: flex;
  padding: 0.25rem 0.75rem;
  align-items: center;
  gap: 0.75rem;
  
  border-radius: 0.625rem;
  border: 1px solid var(--Gray300, #D9D9D9);
  background: var(--white);

`;

const QuantityButton = styled.button`
  ${display_medium}
  /* 기본 button 스타일 완전히 제거 */
  background: none; /* 또는 background: transparent; */
  background-color: transparent; /* 명시적으로 투명 배경 */
  border: none; /* 기본 테두리 제거 */
  outline: none; /* 포커스 시 테두리 제거 */
  padding: 0; /* 기본 패딩 제거 */
  margin: 0; /* 기본 마진 제거 */
  color: var(--Gray700, #717171);
  font-family: "Min Icon VF";
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const PriceQuantitySection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 양끝 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 100%;
`;
const QuantityDisplay = styled.span`
  ${body_large}
  font-weight: 600;
  color: var(--black);
  font-family: "Pretendard Variable";
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
  padding: 0.625rem 7.3125rem;
  border: 1px solid var(--secondary);
  font-family: "Pretendard Variable";
  border-radius: 0.625rem;
  background: var(--background);
  color: var(--primary, #190EAA);
  cursor: pointer;
  gap: 0.625rem;
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
  font-weight: 600;
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

  font-family: "Pretendard Variable";
  ${body_large}
  resize: none;
  outline: none;

  &::placeholder {
    color: var(--gray700);
  }
`;

