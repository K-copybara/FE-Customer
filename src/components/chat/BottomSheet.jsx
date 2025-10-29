import { useRef } from 'react';
import styled from 'styled-components';
import { body_large } from '../../styles/font';

export default function BottomSheet({
  items,
  isExpanded,
  toggleSheet,
  sendMessage,
}) {
  const sheetRef = useRef(null);

  return (
    <Sheet ref={sheetRef} $isExpanded={isExpanded}>
      <HandleArea onClick={(e) => toggleSheet(e)}>
        <Handle />
      </HandleArea>

      <ContentArea>
        <ItemList>
          {items.map((item, index) => (
            <ListItem key={index} onClick={() => sendMessage(item)}>
              <ItemText>{item}</ItemText>
            </ListItem>
          ))}
        </ItemList>
      </ContentArea>
    </Sheet>
  );
}

const Sheet = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white;
  border-radius: 1.875rem 1.875rem 0 0;
  box-shadow: 0 -4px 20px rgba(130, 152, 255, 0.1);
  transition: ${(props) => (props.$isDragging ? 'none' : 'all 0.3s ease-out')};
  height: ${(props) => (props.$isExpanded ? '400px' : '120px')};
  transform: ${(props) =>
    props.$isDragging ? `translateY(${props.$translateY}px)` : 'none'};
`;

const HandleArea = styled.div`
  width: 100%;
  padding: 16px 0 8px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Handle = styled.div`
  width: 48px;
  height: 6px;
  background: #d1d5db;
  border-radius: 9999px;
  margin: 0 auto 16px;
`;

const ContentArea = styled.div`
  overflow-y: auto;
  padding: 0 12px 12px;
  height: calc(100% - 80px);

  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ItemList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const ItemText = styled.span`
  color: #374151;
  ${body_large}
`;
