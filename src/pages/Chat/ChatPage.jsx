import styled from 'styled-components';
import PageHeader from '../../components/common/PageHeader';
import InputContainer from '../../components/chat/InputContainer';
import { useState } from 'react';
import { ChatContainer } from '../../components/chat/ChatContainer';
import { useNavigate } from 'react-router-dom';

const dummyChat = [
  {
    messageId: 1,
    role: 'CUSTOMER',
    content: '네! 그때 뵙겠습니다 :)',
    sentAt: '2025-07-19 01:06',
  },
  {
    messageId: 2,
    role: 'BOT',
    content: '좋아요! 시간은 오후 3시 괜찮으세요?',
    sentAt: '2025-07-19 01:05',
  },
  {
    messageId: 1,
    role: 'CUSTOMER',
    content: '네! 그때 뵙겠습니다 :)',
    sentAt: '2025-07-19 01:06',
  },
  {
    messageId: 2,
    role: 'BOT',
    content: '좋아요! 시간은 오후 3시 괜찮으세요?',
    sentAt: '2025-07-19 01:05',
  },
  {
    messageId: 1,
    role: 'CUSTOMER',
    content: '그럼 이번 주 일요일 어때요?',
    sentAt: '2025-07-19 01:04',
  },
  {
    messageId: 2,
    role: 'BOT',
    content: '저는 주말 오후가 괜찮습니다!',
    sentAt: '2025-07-19 01:03',
  },
  {
    messageId: 1,
    role: 'CUSTOMER',
    content: '혹시 언제 수업 가능하실까요?',
    sentAt: '2025-07-19 01:02',
  },
  {
    messageId: 2,
    role: 'BOT',
    content: '안녕하세요~ 관심가져주셔서 감사합니다.',
    sentAt: '2025-07-19 01:01',
  },
  {
    messageId: 2,
    role: 'BOT',
    content: ' 감사합니다.',
    sentAt: '2025-07-19 01:01',
  },
  {
    messageId: 1,
    role: 'CUSTOMER',
    content: '안녕하세요! 피아노 강의 보고 연락드려요.',
    sentAt: '2025-07-19 01:00',
  },
];

const ChatPage = () => {
  const [messageList, setMessageList] = useState(dummyChat);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  return (
    <Container>
      <PageHeader title={'Semini'} onClick={() => navigate(-1)} />
      <ChatContainer messageList={messageList} />
      <InputContainer message={message} setMessage={setMessage} />
    </Container>
  );
};

export default ChatPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f3ff;
  position: relative;
`;
