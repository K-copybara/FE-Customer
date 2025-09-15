import React from 'react';
import styled from 'styled-components';
import { display_medium } from '../../styles/font';

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
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.7 15.3C9.98333 15.5833 10.0667 15.9 9.95 16.25C9.83333 16.6 9.6 16.8417 9.25 16.975C8.91667 17.0917 8.6 17 8.3 16.7L1.3 9.725C1.08333 9.50833 0.975 9.26667 0.975 9C0.975 8.73333 1.08333 8.49167 1.3 8.275L8.3 1.3C8.58333 1.01667 8.9 0.933332 9.25 1.05C9.6 1.16667 9.83333 1.4 9.95 1.75C10.0833 2.08333 10 2.4 9.7 2.7L3.425 9L9.7 15.3ZM2 10V8H18C18.4167 8 18.7 8.16667 18.85 8.5C19.0167 8.83333 19.0167 9.16667 18.85 9.5C18.7 9.83333 18.4167 10 18 10H2Z" fill="#222222"/>
          </svg>
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
  font-weight: 600;
  color: var(--black);
  text-align: center;
  margin: 0;
`;
