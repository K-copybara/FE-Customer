// ReviewPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { display_large, title_large } from '../../styles/font';
import FullBottomButton from '../../components/common/FullBottomButton';
import StarRating from '../../components/common/StarRating';
import PageHeader from '../../components/common/PageHeader';
import { postReview } from '../../api/review';

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

  const makePayload = (items, ratingsObj) => {
    // 누락(없거나 1 미만)된 항목 찾기
    const missing = items.filter(
      (it) => !(it.menuId in ratingsObj) || Number(ratingsObj[it.menuId]) < 1,
    );

    if (missing.length > 0) {
      return { error: missing.map((m) => m.menuId) };
    }

    // 요구 포맷으로 변환
    const reviews = items.map((it) => ({
      menuId: it.menuId,
      score: Number(ratingsObj[it.menuId]),
    }));

    return { reviews };
  };

  const handleCompleteClick = async () => {
    const { reviews, error } = makePayload(order.items, ratings);

    if (error) {
      alert(`모든 메뉴에 평점을 입력해주세요.`);
      return;
    }

    const data = { reviews };
    try {
      const res = await postReview(order.orderId, data);
      navigate('/reviewcomplete', { state: { orderId: order.orderId } });
    } catch (err) {
      console.error(err);
      alert('리뷰 제출에 실패했습니다. 다시 시도해주세요');
    }
  };

  return (
    <Container>
      <PageHeader
        title="리뷰 쓰기"
        onClick={() => navigate(-1)}
        showBackButton={true}
      />

      <Content>
        <OrderNumberText>
          주문번호 {order.orderId.split('-')[0]}
        </OrderNumberText>
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
  ${title_large}
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
