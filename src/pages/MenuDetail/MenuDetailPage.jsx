import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_large, display_medium, body_large } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';

const MenuDetailPage = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [menuDetail, setMenuDetail] = useState();

  useEffect(() => {
    const getMenuDetail = async () => {
      //나중에 api 연결

      setMenuDetail({
        menuId: 101,
        menuName: '탄탄지 샐러드',
        menuPrice: 8600,
        menuInfo: '국내산 닭가슴살과 고구마무스, 건과일이 들어간 샐러드',
        menuPicture: 'https://cdn.store/menu/101.png',
      });
    };
    getMenuDetail();
  }, []);

  if (!menuDetail) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/')}>←</BackButton>
          <HeaderTitle>메뉴를 찾을 수 없습니다</HeaderTitle>
          <div></div>
        </Header>
        <ContentSection>
          <div>요청하신 메뉴를 찾을 수 없습니다.</div>
        </ContentSection>
      </Container>
    );
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    // 장바구니 추가 api 연결
    navigate('/');
  };

  return (
    <Container>
      <ImageButtonContainer>
        <MenuImage src={menuDetail.menuPicture} alt={menuDetail.menuName} />
        <BackButton onClick={() => navigate('/')}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7 18.3C11.9833 18.5833 12.0667 18.9 11.95 19.25C11.8333 19.6 11.6 19.8417 11.25 19.975C10.9167 20.0917 10.6 20 10.3 19.7L3.3 12.725C3.08333 12.5083 2.975 12.2667 2.975 12C2.975 11.7333 3.08333 11.4917 3.3 11.275L10.3 4.3C10.5833 4.01667 10.9 3.93333 11.25 4.05C11.6 4.16667 11.8333 4.4 11.95 4.75C12.0833 5.08333 12 5.4 11.7 5.7L5.425 12L11.7 18.3ZM4 13V11H20C20.4167 11 20.7 11.1667 20.85 11.5C21.0167 11.8333 21.0167 12.1667 20.85 12.5C20.7 12.8333 20.4167 13 20 13H4Z"
              fill="#222222"
            />
          </svg>
        </BackButton>
      </ImageButtonContainer>
      <ContentSection>
        <MenuInfoSection>
          <MenuName>{menuDetail.menuName}</MenuName>
          <MenuDescription>{menuDetail.menuInfo}</MenuDescription>
        </MenuInfoSection>
        <PriceQuantitySection>
          <MenuPrice>{menuDetail.menuPrice.toLocaleString()}원</MenuPrice>
          <QuantityControls>
            <QuantityButton
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
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
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton onClick={() => handleQuantityChange(1)}>
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
      </ContentSection>

      <FullBottomButton onClick={handleAddToCart}>
        {(menuDetail.menuPrice * quantity).toLocaleString()}원 담기
      </FullBottomButton>
    </Container>
  );
};
export default MenuDetailPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--background);
  position: relative;
  height: 100vh;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--background);
  border-bottom: 1px solid var(--gray300);
`;

const BackButton = styled.button`
  border-radius: 3.125rem;
  background: var(--white);

  color: var(--black);
  cursor: pointer;
  padding: 0.625rem;
  gap: 0.625rem;
  display: inline-flex;
  align-items: center;
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

const HeaderTitle = styled.h1`
  ${body_large}
  color: var(--black);
`;

const MenuImage = styled.img`
  width: 100%;
  height: 16.875rem;
  flex-shrink: 0;
  object-fit: cover;
  background: var(--gray100);
  display: block;
`;

const ImageButtonContainer = styled.div`
  position: relative; /* 자식 요소의 absolute 기준점 */
  width: 100%;
`;

const ContentSection = styled.div`
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.75rem;
`;

const MenuInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-self: flex-start; /* 부모 컨테이너의 왼쪽 정렬 */
`;

const MenuName = styled.h2`
  ${display_large}
  color: var(--black);
  margin: 0;
`;

const MenuDescription = styled.p`
  ${display_medium}
  color: var(--gray700);
`;

const MenuPrice = styled.div`
  ${display_large}
  color: var(--black);
`;

const PriceQuantitySection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 양끝 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  align-self: stretch; /* 부모 컨테이너의 전체 너비 사용 */
`;

const QuantityControls = styled.div`
  display: flex;
  padding: 0.25rem 0.75rem;
  align-items: center;
  gap: 1.25rem;

  border-radius: 0.625rem;
  border: 1px solid var(--Gray300, #d9d9d9);
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

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const QuantityDisplay = styled.span`
  ${display_large}
  width: 1rem;
  color: var(--Black, #222);
`;
