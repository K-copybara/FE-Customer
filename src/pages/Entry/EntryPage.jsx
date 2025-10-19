import styled from 'styled-components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { getCustomerKey } from '../../api/client';

const EntryPage = () => {
  const { setUser, clearUser } = useUserStore();
  const navigate = useNavigate();

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);

  useEffect(() => {
    const storeParam = params.get('st');
    const tableParam = params.get('tb');

    if (storeParam && tableParam) {
      const fetchCustomerKey = async () => {
        const storeId = Number(atob(storeParam));
        const tableId = Number(atob(tableParam));

        const res = await getCustomerKey(storeId, tableId);
        setUser(res);

        navigate('/', { replace: true });
      };

      fetchCustomerKey();
    } else {
      clearUser();
    }
  }, [navigate, setUser, clearUser]);

  return <Layout>{'세션이 만료되었습니다.\nQR코드로 재접속해주세요.'}</Layout>;
};

export default EntryPage;

const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--background);
  position: relative;
`;
