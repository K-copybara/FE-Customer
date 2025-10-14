import styled from 'styled-components';
import PageHeader from '../../components/common/PageHeader';
import InputContainer from '../../components/chat/InputContainer';
import { useEffect, useRef, useState } from 'react';
import { ChatContainer } from '../../components/chat/ChatContainer';
import { useNavigate } from 'react-router-dom';
import { getChatList, postChatSession } from '../../api/chat';
import { useUserStore } from '../../store/useUserStore';
import { Client } from '@stomp/stompjs';

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

const startChat = {
  messageId: 0,
  role: 'BOT',
  content: '안녕하세요! AI 챗봇 Semini에요.\n어떻게 도와드릴까요?',
  sentAt: new Date(),
};

const ChatPage = () => {
  const { storeId, tableId, customerKey, sessionId, setSessionId } =
    useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [messageList, setMessageList] = useState([]); // 메시지 목록
  const [message, setMessage] = useState(''); // 내가 보낼 메시지
  const stompRef = useRef();
  const bottomRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        let id = sessionId;

        // 세션 아이디 없으면 생성
        if (!id) {
          const res = await postChatSession({ storeId, tableId, customerKey });
          id = res.sessionId;
          setSessionId(id);
        }

        // 메시지 목록 가져오기
        const res = await getChatList(id);
        //const res = dummyChat;
        setMessageList([startChat, ...res]);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    // 메시지 전송&수신 시 스크롤 맨 하단으로 이동
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    //stomp 웹소켓 연결
    const stompClient = new Client({
      brokerURL: `${import.meta.env.VITE_WEBSOCKET_URL}`,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        stompClient.subscribe(`/topic/chat/${customerKey}`, (message) => {
          console.log('🔔 메시지 수신됨:', message);
          try {
            const newChat = JSON.parse(message.body);
            setMessageList((prev) => [...prev, newChat]);
            setIsLoading(false);
          } catch (error) {
            console.error('구독 에러 : ', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP 오류', frame.headers['message']);
      },
    });
    stompRef.current = stompClient;
    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [customerKey]);

  const sendMessage = () => {
    console.log(message);
    if (stompRef.current && stompRef.current.connected && message.trim()) {
      const messageData = {
        customerKey,
        role: 'CUSTOMER',
        content: message,
      };

      const payload = JSON.stringify(messageData);

      try {
        stompRef.current.publish({
          destination: '/api/customer/chat.send',
          body: payload,
        });
        setMessage('');
        setIsLoading(true);
      } catch (err) {
        alert('메세지 전송 실패');
        console.error(err);
      }
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Container>
      <PageHeader title={'Semini'} onClick={() => navigate(-1)} />
      <ChatContainer
        messageList={messageList}
        bottomRef={bottomRef}
        isLoading={isLoading}
      />
      <InputContainer
        message={message}
        setMessage={setMessage}
        onClickButton={sendMessage}
      />
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
