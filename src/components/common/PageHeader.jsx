import React from 'react';
import styled from 'styled-components';
import { title_large } from '../../styles/font';
import ARROW_LEFT from '../../assets/arrow_left.svg?react';

const PageHeader = ({
  title,
  onClick,
  showBackButton = true,
  rightElement = null,
}) => {
  return (
    <Header>
      {showBackButton ? (
        <BackButton onClick={onClick}>
          <ARROW_LEFT />
        </BackButton>
      ) : (
        <div></div>
      )}

      <HeaderTitle>{title}</HeaderTitle>

      {rightElement || <div></div>}
    </Header>
  );
};

export default PageHeader;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 1rem 1rem;
  background: var(--background);
  border-bottom: 1px solid var(--gray300);
`;

const BackButton = styled.div`
  cursor: pointer;
`;

const HeaderTitle = styled.h1`
  ${title_large}
  color: var(--black);
  text-align: center;
  margin: 0;
`;
