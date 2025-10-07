import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_large, display_medium, body_large } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';
import Backarrow from '../../assets/icon/backarrow-icon.svg?react';
import Amountminus from '../../assets/icon/amountminus-icon.svg?react';
import Amountplus from '../../assets/icon/amountplus-icon.svg?react';

//임시로 이미지만 가져왔듬
import mandooSvg from '../../assets/mandoo.svg';
import { useUserStore } from '../../store/useUserStore';

const MenuDetailPage = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [menuDetail, setMenuDetail] = useState();
  const { getUser } = useUserStore();

  useEffect(() => {
    getUser();
    const getMenuDetail = async () => {
      //나중에 api 연결

      setMenuDetail({
        menuId: 101,
        menuName: '탄탄지 샐러드',
        menuPrice: 8600,
        menuInfo: '국내산 닭가슴살과 고구마무스, 건과일이 들어간 샐러드',
        menuPicture: mandooSvg,
      });
    };
    getMenuDetail();
  }, []);

  console.log('메뉴 아이디', menuId);

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

  //수량 변경
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  //장바구니 담기
  const handleAddToCart = async () => {
    // 장바구니 추가 api 연결
    navigate('/');
  };

  return (
    <Container>
      <ImageButtonContainer>
        <MenuImage src={menuDetail.menuPicture} alt={menuDetail.menuName} />
        <BackButton onClick={() => navigate('/')}>
          <Backarrow />
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
              <Amountminus />
            </QuantityButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton onClick={() => handleQuantityChange(1)}>
              <Amountplus />
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
