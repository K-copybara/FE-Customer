import React from 'react';
import styled from 'styled-components';
import { display_medium } from '../../styles/font';
import Backarrow from '../../assets/icon/backarrow-icon.svg?react';

const PageHeader = ({ 
  title, 
  onClick, 
  showBackButton = true,
  rightElement = null 
}) => {
  return (
    <Header>
      {showBackButton ? (
        <BackButton onClick={onClick}>
          <Backarrow />
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

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--black);
  cursor: pointer;
  padding: 0.25rem;
  justify-self: start;
`;

const HeaderTitle = styled.h1`
  ${display_medium}
  color: var(--black);
  text-align: center;
  margin: 0;
`;
