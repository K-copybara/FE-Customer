import styled from 'styled-components';

const MenuPage = () => {
  return <Layout>메뉴페이지입니다.</Layout>;
};

export default MenuPage;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  padding: 0 1rem;
`;
