// ReviewPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_medium, display_large } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';
import StarRating from '../../components/common/StarRating';
import PageHeader from '../../components/common/PageHeader';

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state;

  const [ratings, setRatings] = useState({});

  // order 객체가 유효한지 확인
  if (!order || !order.orderId || !order.items) {
    return <div>잘못된 접근입니다.</div>;
  }

  const handleRatingChange = (menuId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [menuId]: rating,
    }));
  };

  const handleCompleteClick = () => {
    // 여기서 리뷰 데이터를 저장하는 로직을 호출
    console.log('리뷰 제출:', ratings);

    // 리뷰 완료 페이지로 이동
    navigate('/reviewcomplete', { state: { orderId: order.orderId } });
  };

  return (
    <Container>
      <PageHeader
        title="리뷰 쓰기"
        onClick={() => navigate(-1)}
        showBackButton={true}
      />

      <Content>
        <OrderNumberText>주문 번호 {order.orderId}</OrderNumberText>
        <ReviewItems>
          {order.items.map((item) => (
            <ReviewItem key={item.menuId}>
              <ImageNameConatainer>
                <ItemName>{item.menuName}</ItemName>
              </ImageNameConatainer>
              <StarDetails>
                <StarRating
                  rating={ratings[item.menuId] || 0}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.menuId, rating)
                  }
                />
              </StarDetails>
            </ReviewItem>
          ))}
        </ReviewItems>
      </Content>

      <FullBottomButton onClick={handleCompleteClick}>완료</FullBottomButton>
    </Container>
  );
};

export default ReviewPage;

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background);
  position: relative;
`;

const Content = styled.div`
  padding: 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const OrderNumberText = styled.div`
  ${display_medium}
  text-align: center;
  color: var(--black);
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const ReviewItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ReviewItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-direction: column;
`;

const ImageNameConatainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  align-self: stretch;
`;

const ItemImage = styled.img`
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 0.625rem;
  object-fit: cover;
  flex-shrink: 0; /* 이미지가 줄어들지 않도록 함 */
`;

const StarDetails = styled.div`
  display: flex;
  justify-content: center; /* 세로 중앙 정렬 */
  flex-grow: 1; /* 남은 공간을 채우도록 함 */
  align-items: center;
  width: 100%;
`;

const ItemName = styled.div`
  ${display_large}
  color: var(--black);
`;
