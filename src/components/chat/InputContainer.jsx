import styled from 'styled-components';
import { body_medium } from '../../styles/font';
import SEND_BUTTON from '../../assets/chat_button.svg?react';

export default function InputContainer({ message, setMessage, onClickButton }) {
  return (
    <Container>
      <InputText value={message} onChange={(e) => setMessage(e.target.value)} />
      <ButtonWrapper
        onClick={(e) => {
          e.preventDefault();
          onClickButton();
        }}
      >
        <SEND_BUTTON />
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;

  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding: 1rem;

  background-color: var(--white);
  box-shadow: 0 -4px 10px 0 rgba(130, 152, 255, 0.3);
  z-index: 100;
`;

const InputText = styled.input`
  display: flex;

  width: 20rem;
  height: 2.5rem;

  padding: 0.8rem 1rem;
  align-items: center;

  border: 1.5px solid var(--secondary);
  &:focus {
    outline: none;
  }
  border-radius: 3.125rem;

  color: var(--black);
  background-color: var(--gray100);
  ${body_medium}
`;

const ButtonWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;
