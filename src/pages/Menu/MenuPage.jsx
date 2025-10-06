import styled from 'styled-components';
import { useState, useRef, useEffect, useCallback, createRef, Fragment} from 'react';
import { display_medium } from "../../styles/font";
import Header from '../../components/common/Header';
import FullBottomButton from "../../components/common/FullBottomButton";
import CategoryTabs from "../../components/common/CategoryTabs";
import MenuItem from '../../components/common/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useStore } from '../../hooks/useStore';

const MenuPage = () => {
  const { storeInfo, menuData, categories } = useStore(); //
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(0);

  // 각 카테고리 섹션에 대한 ref 생성
  const sectionRefs = useRef([]);
  useEffect(() => {
    sectionRefs.current = categories.map((_, i) => sectionRefs.current[i] ?? createRef());
}, [categories]);


  // 카테고리 선택 시 해당 섹션으로 스크롤
  const handleCategorySelect = (index) => {
    setSelectedCategory(index);
    if (sectionRefs.current[index] && sectionRefs.current[index].current) {
      sectionRefs.current[index].current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleScroll = useCallback(() => {
    // 브라우저 호환성 확인
    if (typeof window === 'undefined') return;
    
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const sections = sectionRefs.current;
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i].current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        
        // sticky tabs 높이(약 80px) 고려
        if (scrollY >= sectionTop - 120) {
          setSelectedCategory(i);
          break;
        }
      }
    }
  }, []);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    // 브라우저 환경 체크
    if (typeof window === 'undefined') return;

    // 초기 스크롤 위치 확인
    handleScroll();

    // 패시브 리스너로 성능 최적화
    const options = { passive: true };
    window.addEventListener('scroll', handleScroll, options);
    
    return () => {
      window.removeEventListener('scroll', handleScroll, options);
    };
  }, [handleScroll]);

   // 메뉴 아이템 클릭 시 상세 페이지로 이동
  const handleMenuClick = (menu) => {
    navigate(`/menu/${menu.id}`);
  };

  const handleOrder = () => {
    navigate('/cart');
  };


  
  const handleAIChat = () => {
    navigate('/chat'); // ChatPage로 이동
  };

  // 또는 더미 사용 (개발 중일 때)

  return (
    <Layout>
      <ScrollableContent>
      <Header
        storeName={storeInfo.storeName}
        tableNumber={storeInfo.tableNumber}
        noticeText={storeInfo.noticeText}
      />
    
      <StickyTabs>
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </StickyTabs>

      <MainContent>
        {categories.map((category, index) => (
          <Fragment key={category}>
            {/* index가 0보다 클 때만 (즉, 두 번째 카테고리부터) 구분선 추가 */}
            {index > 0 && <CategorySpacer />}
            <CategorySection 
              ref={sectionRefs.current[index]}
            >
              <CategoryTitle>{category}</CategoryTitle>
            </CategorySection>
                {menuData[category]?.map(menu => (
                  <MenuItem 
                    key={menu.id} 
                    menu={menu}
                    onClick={() => handleMenuClick(menu)}
                  />
                ))}

            
          </Fragment>
        ))}
      </MainContent>
      </ScrollableContent>
      <AIButton onClick={handleAIChat}>
        AI 챗봇
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C10.4167 22 8.90833 21.6333 7.475 20.9L4.575 21.625C4.075 21.7583 3.63333 21.75 3.25 21.6C2.86667 21.4333 2.59167 21.1583 2.425 20.775C2.25833 20.3917 2.24167 19.95 2.375 19.45L3.1 16.525C2.36667 15.0917 2 13.5833 2 12C2 10.1833 2.45 8.50833 3.35 6.975C4.25 5.44167 5.45833 4.23333 6.975 3.35C8.50833 2.45 10.1833 2 12 2C13.8167 2 15.4917 2.45 17.025 3.35C18.5583 4.23333 19.7667 5.44167 20.65 6.975C21.55 8.50833 22 10.1833 22 12C22 13.8167 21.55 15.4917 20.65 17.025C19.7667 18.5417 18.5583 19.75 17.025 20.65C15.4917 21.55 13.8167 22 12 22ZM4.3 19.925C4.26667 20.075 4.18333 20.0833 4.05 19.95C3.91667 19.8167 3.91667 19.7333 4.05 19.7L7.425 18.875C7.525 18.8417 7.625 18.8333 7.725 18.85C7.84167 18.8667 7.95 18.9083 8.05 18.975C8.66667 19.3083 9.3 19.5667 9.95 19.75C10.6 19.9167 11.2833 20 12 20C13.5 20 14.8583 19.65 16.075 18.95C17.2917 18.25 18.25 17.2917 18.95 16.075C19.65 14.8583 20 13.5 20 12C20 10.5 19.65 9.14167 18.95 7.925C18.25 6.70833 17.2917 5.75 16.075 5.05C14.8583 4.35 13.5 4 12 4C10.5 4 9.14167 4.35 7.925 5.05C6.70833 5.75 5.75 6.70833 5.05 7.925C4.35 9.14167 4 10.5 4 12C4 12.7167 4.08333 13.4 4.25 14.05C4.43333 14.7 4.69167 15.3333 5.025 15.95C5.15833 16.15 5.19167 16.35 5.125 16.55L4.3 19.925Z" fill="white"/>
        </svg>
      </AIButton>
      {cartItems.length > 0 && (
        <FullBottomButton onClick={handleOrder}>
          장바구니 · {totalPrice.toLocaleString()}원
        </FullBottomButton>
        )}
    </Layout>
  );
};

export default MenuPage;

// 스타일 컴포넌트들은 동일...
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background);
  position: relative;
`;

const MainContent = styled.main`
  padding: 0 1rem; /* 좌우 여백 1rem 적용 */
  margin-bottom: 5rem;
  box-sizing: border-box;
`;

const ScrollableContent = styled.div`
  flex: 1; /* Header를 제외한 나머지 모든 공간을 차지 */
  overflow-y: auto; /* 이 영역만 세로 스크롤이 가능해짐 */
  -webkit-overflow-scrolling: touch; /* 모바일에서 부드러운 스크롤 */
`;

const StickyTabs = styled.div`
  position: sticky;
  background: var(--background);
  width: 100%;
  top: 0; 
`;

const CategorySection = styled.section`
  display: flex;
  padding-top: 1.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
`;

const CategoryTitle = styled.h2`
  ${display_medium}
  flex: 1 0 0;
  color: var(--black);
  margin: 0.25rem 0  0;
`;

const CategorySpacer = styled.div`
  height: 0.5rem;
  margin-left: -1rem;
  margin-right: -1rem;
  background: var(--Gray100, #FAFAFC);
`;

const AIButton = styled.button`
  ${display_medium}
  display: flex;
  padding: 0.625rem 0.75rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.875rem;
  background: var(--Primary, #190EAA);
  box-shadow: 0 4px 10px 0 rgba(31, 18, 212, 0.15);
  color: var(--white);
  cursor: pointer;
  position: absolute;
  bottom: 1.25rem;
  right: 1rem;

  svg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;