import { Routes, Route } from 'react-router-dom';
import MenuPage from './pages/Menu/MenuPage';
import MenuDetailPage from './pages/MenuDetail/MenuDetailPage';
import HistoryPage from './pages/History/HistoryPage';
import CartPage from './pages/Cart/CartPage';
import ChatPage from './pages/Chat/ChatPage';
import ReviewPage from './pages/Review/ReviewPage';
import ReviewCompletePage from './pages/Review/ReviewCompletePage';
import OrderCompletePage from './pages/Cart/OrderCompletePage';
import PaymentFail from './pages/Payment/PaymentFail';
import PaymentSuccess from './pages/Payment/PaymentSuccess';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/menu/:menuId" element={<MenuDetailPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/reviewcomplete" element={<ReviewCompletePage />} />
      <Route path="/ordercomplete" element={<OrderCompletePage />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/fail" element={<PaymentFail />} />
    </Routes>
  );
}

export default App;
