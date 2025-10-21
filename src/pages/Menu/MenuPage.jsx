import styled from 'styled-components';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  createRef,
  Fragment,
} from 'react';
import { title_large } from '../../styles/font';
import Header from '../../components/common/Header';
import FullBottomButton from '../../components/common/FullBottomButton';
import CategoryTabs from '../../components/common/CategoryTabs';
import MenuItem from '../../components/common/MenuItem';
import { useNavigate } from 'react-router-dom';
import AiIcon from '../../assets/icon/ai-icon.svg?react';
import { getCategoryInfo, getMenuAll, getStoreInfo } from '../../api/store';
import { useUserStore } from '../../store/useUserStore';
import { getCartData } from '../../api/cart';

const MenuPage = () => {
  const { storeId, tableId, customerKey, setStoreName } = useUserStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [storeInfo, setStoreInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await getStoreInfo(storeId, tableId);
        setStoreInfo(res);
        setStoreName(res.shopName);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStore();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCartData(storeId, customerKey);
        setCartData(res.items);
        setTotalPrice(res.totalPrice);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategoryInfo(storeId);
        setCategories(res);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMenu = async () => {
      try {
        const res = await getMenuAll(storeId);
        setMenuData(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategory();
    fetchMenu();
  }, []);

  // 각 카테고리 섹션에 대한 ref 생성
  const sectionRefs = useRef([]);
  useEffect(() => {
    sectionRefs.current = categories.map(
      (_, i) => sectionRefs.current[i] ?? createRef(),
    );
  }, [categories]);

  // 카테고리 선택 시 해당 섹션으로 스크롤
  const handleCategorySelect = (index) => {
    setSelectedCategory(index);
    if (sectionRefs.current[index] && sectionRefs.current[index].current) {
      sectionRefs.current[index].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleScroll = useCallback(() => {
    // 브라우저 호환성 확인
    if (typeof window === 'undefined') return;

    const scrollY =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
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
    navigate(`/menu/${menu.menuId}`);
  };

  const handleOrder = () => {
    navigate('/cart');
  };

  const handleAIChat = () => {
    navigate('/chat'); // ChatPage로 이동
  };

  // 메뉴 데이터를 카테고리별로 그룹화
  const getMenusByCategory = (categoryId) => {
    return menuData.filter((menu) => menu.category.categoryId === categoryId);
  };

  return (
    <Layout>
      <ScrollableContent>
        {storeInfo && (
          <Header
            shopName={storeInfo.shopName}
            tableId={storeInfo.tableId}
            notice={storeInfo.notice}
          />
        )}

        <StickyTabs>
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </StickyTabs>

        <MainContent>
          {categories.map((category, index) => {
            //해당 카테고리 메뉴만 필터링하기로 수정
            const categoryMenus = getMenusByCategory(category.categoryId);

            return (
              // key는 고유해야 하므로
              //categoryId를 key로 사용
              <Fragment key={category.categoryId}>
                {/* index가 0보다 클 때만 (즉, 두 번째 카테고리부터) 구분선 추가 */}
                {index > 0 && <CategorySpacer />}
                <CategorySection ref={sectionRefs.current[index]}>
                  {/*카테고리 이름으로 수정*/}
                  <CategoryTitle>{category.categoryName}</CategoryTitle>
                </CategorySection>
                {/*필터링된 메뉴 목록*/}
                {categoryMenus.map((menu) => (
                  <MenuItem
                    key={menu.menuId}
                    menu={menu}
                    onClick={() => handleMenuClick(menu)}
                  />
                ))}
              </Fragment>
            );
          })}
        </MainContent>
      </ScrollableContent>
      <AIButton onClick={handleAIChat} isCartVisible={cartData.length > 0}>
        AI 챗봇
        <AiIcon />
      </AIButton>
      {cartData.length > 0 && (
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
  &::-webkit-scrollbar {
    display: none;
  }
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
  ${title_large}
  flex: 1 0 0;
  color: var(--black);
  margin: 0.25rem 0 0;
`;

const CategorySpacer = styled.div`
  height: 0.5rem;
  margin-left: -1rem;
  margin-right: -1rem;
  background: var(--Gray100, #fafafc);
`;

const AIButton = styled.button`
  ${title_large}
  display: flex;
  padding: 0.625rem 0.75rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.875rem;
  background: var(--Primary, #190eaa);
  box-shadow: 0 4px 10px 0 rgba(31, 18, 212, 0.15);
  color: var(--white);
  cursor: pointer;
  position: absolute;
  bottom: ${(props) => (props.isCartVisible ? '5.75rem' : '1.25rem')};
  transition: bottom 0.3s ease-in-out;
  right: 1rem;
  z-index: 999;

  svg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
