import React from 'react';
import styled from 'styled-components';
import { title_large } from '../../styles/font';

const FullBottomButton = ({ children, onClick, disabled = false, style }) => (
  <ButtonWrapper style={style}>
    <Button onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  </ButtonWrapper>
);

export default FullBottomButton;

const ButtonWrapper = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  padding: 1rem;
  background: var(--background);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  right: 0;

  box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  ${title_large}
  width: 100%;
  height: 3rem;
  background: var(--primary, #190eaa);
  color: #fff;
  border: none;
  border-radius: 0.625rem;
  cursor: pointer;
  /* disabled 상태 */
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &:hover {
    background: var(--secondary);
  }
`;
