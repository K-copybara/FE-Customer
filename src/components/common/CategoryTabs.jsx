import React, {useRef} from "react";
import styled from "styled-components";
import { title_medium } from "../../styles/font";

const CategoryTabs = ({ categories, selected, onSelect }) => {
  const scrollRef = useRef();
  const categoryRefs = useRef(categories.map(() => React.createRef()));
  // 마우스 휠로 가로 스크롤[web:3]
  const handleWheel = (e) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };
  // 탭 클릭 시 해당 카테고리로 스크롤
  const handleTabClick = (idx) => {
    onSelect(idx);
    // 외부에서 이 컴포넌트에 categoryRefs.current[idx]를 내려받고 section에 ref로 연결해야 스크롤 동작!
    if (categoryRefs.current[idx] && categoryRefs.current[idx].current) {
        categoryRefs.current[idx].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    };
  return (
    <TabsContainer 
      ref={scrollRef}
      onWheel={handleWheel}
    >
      {categories.map((category, idx) => (
        <TabItem
          key={category.categoryId} // categoryId를 key로 사용
          isSelected={selected === idx}
          onClick={() => handleTabClick(idx)}
          role="tab"
          aria-selected={selected === idx}
          tabIndex={selected === idx ? 0 : -1}
        >
          {/*카테고리 이름으로 변경*/}
          {category.categoryName}
        </TabItem>
      ))}
      <Divider />
    </TabsContainer>
  );
};

export default CategoryTabs;

// 스타일

const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 0.31rem;           
  width: 100%;             /* 페이지 너비 내 좌우 마진 뺀 최대 너비 */
  padding: 1rem;  
  scrollbar-width: none;   /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none;         /* Chrome/Safari */
  }
  align-self: stretch;
`;


const TabItem = styled.button`
  flex: 0 0 auto;
  padding: 0.375rem 1rem;  
  border-radius: 2rem;
  border: 2px solid ${({ isSelected }) => isSelected ? "var(--primary)" : "var(--gray300)"};
  background: ${({ isSelected }) => isSelected ? "var(--primary)" : "#fff"};
  color: ${({ isSelected }) => isSelected ? "#fff" : "var(--black)"};
  font-family: Pretendard, sans-serif;
  ${title_medium};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: background-color 0.25s, color 0.25s, border-color 0.25s;

  &:hover:not(:disabled) {
    background-color: ${({ isSelected }) => (isSelected ? "var(--primary)" : "var(--gray100)")};
  }
`;

const Divider = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 1px;
  background-color: var(--gray300);
`;
