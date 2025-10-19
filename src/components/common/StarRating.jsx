import React from 'react';
import styled from 'styled-components';

import Filledstar from '../../assets/icon/filledstar-icon.svg?react';
import Emptystar from '../../assets/icon/emptystar-icon.svg?react';

const StarRating = ({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];

  const EmptyStar = () => (
    <Emptystar />
  );

  const FilledStar = () => (
    <Filledstar />
  );
  return (
    <StarContainer>
      {stars.map((star) => (
        <Star
          key={star}
          onClick={() => onRatingChange(star)}
        >
          {star <= rating ? <FilledStar /> : <EmptyStar />}
        </Star>
      ))}
    </StarContainer>
  );
};

export default StarRating;

const StarContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 2rem;
  color: var(--gray300);
  cursor: pointer;
`;

const Star = styled.span`
  color: ${(props) => (props.$active ? 'var(--yellow)' : 'inherit')};
  transition: color 0.2s;
`;