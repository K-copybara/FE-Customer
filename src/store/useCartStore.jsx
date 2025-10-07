import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

//어디서든 장바구니 상태에 접근 가능쓰
export const useCartStore = create(
  //장바구니 데이터를 cart-storage이름으로 localStorage에 저장
  persist(
    devtools((set) => ({
      //기본상태
      cartItems: [],
      totalPrice: 0,
      isLoading: false,

      fetchCart: async () => {
        //추가
        set({ isLoading: true });
        try {
          // const data = await getCartData();
          set({
            cartId: 1,
            storeId: 1,
            customerKey: "nfc-session-uuid-1234",
            items:
              [
                {
                  cartItemId: 1,
                  menuId: 101,
                  menuName: '탄탄지 샐러드',
                  menuCategory: '메인메뉴',
                  menuPicture: 'https://example.com/salad.jpg',
                  amount: 2,
                  price: 1,
                },
              ], // []
            totalPrice: 50000, // 0
            isLoading: false,
          });
        } catch (err) {
          console.error('장바구니 로딩 실패', err);
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ cartItems: [], totalPrice: 0 });
      },
    })),
    {
      name: 'cart-storage',
    },
  ),
);
