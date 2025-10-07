import styled from 'styled-components';
import { extractTime } from '../../utils/formatTime';
import { body_medium, body_small } from '../../styles/font';

export const UserMessage = ({ msg }) => {
  return (
    <Container>
      <Time>{extractTime(msg.sentAt)}</Time>
      <Text>{msg.content}</Text>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-left: auto;
`;

const Text = styled.div`
  display: flex;
  max-width: 16.125rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  padding: 0.625rem;
  border-radius: 0.625rem 0.625rem 0 0.625rem;
  border: 1px solid var(--Secondary, #8298ff);
  background: #fff;
  ${body_medium}
`;

const Time = styled.p`
  color: var(--gray700);
  ${body_small}
`;
