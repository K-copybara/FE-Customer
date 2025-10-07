import styled from 'styled-components';
import SEMINI from '../../assets/semini.svg?react';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';

export const ChatContainer = ({
  messageList,
  topRef,
  bottomRef,
  scrollRef,
}) => {
  const groupMessages = (chatData) => {
    if (!chatData || chatData.length === 0) {
      return [];
    }

    const sortedData = [...chatData].reverse(); //데이터가 최신순으로 오는 경우

    const grouped = sortedData.reduce((acc, current) => {
      const lastGroup = acc[acc.length - 1];

      if (!lastGroup || current.role !== lastGroup.role) {
        acc.push({
          role: current.role,
          messages: [current],
        });
      } else {
        lastGroup.messages.push(current);
      }

      return acc;
    }, []);

    return grouped;
  };

  const grouped = groupMessages(messageList);
  console.log(grouped);

  return (
    <Container ref={scrollRef}>
      <div ref={topRef} />

      {grouped.map((chatGroup, idx) =>
        chatGroup.role === 'BOT' ? (
          <Wrapper>
            <AIcon />
            <ChatGroup>
              {chatGroup.messages.map((msg, idx) => (
                <AIMessage key={`aichat-${idx}`} msg={msg} />
              ))}
            </ChatGroup>
          </Wrapper>
        ) : (
          <ChatGroup>
            {chatGroup.messages.map((msg, idx) => (
              <UserMessage key={`mychat-${idx}`} msg={msg} />
            ))}
          </ChatGroup>
        ),
      )}
      <div ref={bottomRef} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  flex: 1;
  padding: 1.5rem 1.25rem;

  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 0.5rem;
`;

const ChatGroup = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  margin: 0.5rem 0;
  gap: 0.5rem;
`;

const AIcon = styled(SEMINI)`
  margin-top: auto;
  margin-bottom: 0.5rem;
`;
