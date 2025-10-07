import styled from "styled-components";
import { display_medium, display_small } from "../../styles/font";

const MenuItem = ({ menu, onClick }) => {
  return (
    <Item onClick={onClick}>
      <Info>
        <Name>{menu.menuName}</Name>
        <Desc>{menu.menuInfo}</Desc>
        <Price>{menu.menuPrice.toLocaleString()}원</Price>
      </Info>
      <Img src={menu.menuPicture} alt={menu.menuName} />
    </Item>
  );
};

export default MenuItem;

// 스타일 컴포넌트들은 이전과 동일...
const Item = styled.li`
  display: flex;
  justify-content: space-between; /* 텍스트와 이미지를 양 끝으로 */
  align-items: flex-start; /* 부모 컨테이너의 전체 너비 사용 */
  align-self: stretch; /* 부모 컨테이너의 전체 너비 사용 */
  padding: 1.25rem 0; /* 아이템 상하 여백 */
  gap: 1rem; /* 텍스트와 이미지 사이 간격 */
  cursor: pointer;
  background: var(--background); /* 배경색 투명하게 */
  border: none; /* 테두리 제거 */
  box-shadow: none; /* 그림자 제거 */
`;

const Img = styled.img`
  width: 6.875rem;
  height: 6.875rem;
  border-radius: 0.625rem;
  object-fit: cover;
  background-color: var(--gray100);
  flex-shrink: 0;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-right: 1rem;
  flex: 1;
  justify-content: space-between;
`;

const Name = styled.p`
  ${display_medium}
  color: var(--black);
  margin: 0 0 0.25rem 0;
`;

const Desc = styled.p`
  ${display_small}
  color: var(--gray700);
  margin: 0;
`;

const Price = styled.p`
  ${display_medium}
  color: var(--black);
  margin: 0.5rem 0 0 0;
`;
