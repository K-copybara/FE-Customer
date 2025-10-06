import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    devtools((set) => ({
      cartItems: [],
      totalPrice: 0,
      isLoading: false,

      fetchCart: async () => {
        try {
          // const data = await getCartData();
          set({
            cartItems:
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
              ] || [],
            totalPrice: 50000 || 0,
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
