import styled from 'styled-components';

export const LoadingChat = () => {
  return (
    <Container>
      <Dot />
      <Dot />
      <Dot />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 0.3rem;
  background: var(--white);
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  width: fit-content;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6a7df0;
  animation: blink 1.4s infinite both;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0% {
      opacity: 0.2;
      transform: translateY(0px);
    }
    20% {
      opacity: 1;
      transform: translateY(-2px);
    }
    100% {
      opacity: 0.2;
      transform: translateY(0px);
    }
  }
`;
