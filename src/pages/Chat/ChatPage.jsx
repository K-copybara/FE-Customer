import styled from 'styled-components';
import PageHeader from '../../components/common/PageHeader';
import InputContainer from '../../components/chat/InputContainer';
import { useEffect, useRef, useState } from 'react';
import { ChatContainer } from '../../components/chat/ChatContainer';
import { useNavigate } from 'react-router-dom';
import { getChatList, postChatSession } from '../../api/chat';
import { useUserStore } from '../../store/useUserStore';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import BottomSheet from '../../components/chat/BottomSheet';

const startChat = {
  messageId: 0,
  role: 'BOT',
  content: '안녕하세요! AI 챗봇 Semini에요.\n어떻게 도와드릴까요?',
  sentAt: new Date().toISOString(),
};

const examples = [
  '가장 인기있는 메뉴가 무엇인가요?',
  '안 매운 메뉴 추천해주세요.',
  '반찬 좀 리필해주세요.',
  '땅콩 알러지가 있는데, 땅콩이 안들어간 메뉴 있나요?',
  '3명이서 먹을건데 어떻게 먹으면 좋을까요?',
];

const ChatPage = () => {
  const { storeId, tableId, customerKey, sessionId, setSessionId } =
    useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [messageList, setMessageList] = useState([]); // 메시지 목록
  const [message, setMessage] = useState(''); // 내가 보낼 메시지
  const [isExpanded, setIsExpanded] = useState(false); //예시 질문 바텀시트 활성화
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
        setMessageList([...res, startChat]);
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
    const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
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
      onWebSocketClose: (evt) => {
        console.warn('웹소켓 종료', evt);
      },
    });
    stompRef.current = stompClient;
    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [customerKey]);

  const sendMessage = (faq) => {
    const text = typeof faq === 'string' ? faq : message.trim();
    if (!text) return;
    if (!(stompRef.current && stompRef.current.connected)) return;

    const messageData = {
      customerKey,
      role: 'CUSTOMER',
      content: text,
      sentAt: new Date().toISOString(),
    };

    setMessageList((prev) => [...prev, messageData]);
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
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSheet = (event) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Container onClick={() => setIsExpanded(false)}>
      <PageHeader title={'Semini'} onClick={() => navigate(-1)} />
      <ChatContainer
        messageList={messageList}
        bottomRef={bottomRef}
        isLoading={isLoading}
      />
      <BottomSheet
        items={examples}
        isExpanded={isExpanded}
        toggleSheet={toggleSheet}
        sendMessage={sendMessage}
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
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background-color: #f0f3ff;
  position: relative;
`;
