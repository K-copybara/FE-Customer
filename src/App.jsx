import { Route, Routes } from 'react-router-dom';
import MenuPage from './pages/Menu/MenuPage';
import MenuDetailPage from './pages/MenuDetail/MenuDetailPage';
import HistoryPage from './pages/History/HistoryPage';
import CartPage from './pages/Cart/CartPage';
import ChatPage from './pages/Chat/ChatPage';
import ReviewPage from './pages/Review/ReviewPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/detail" element={<MenuDetailPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/review" element={<ReviewPage />} />
    </Routes>
  );
}

export default App;
