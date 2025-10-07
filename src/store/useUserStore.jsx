import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    devtools((set, get) => ({
      storeId: null,
      tableId: null,
      customerKey: null,
      sessionId: null,
      expiry: null,

      setUser: ({ storeId, tableId, customerKey }) => {
        const threeHours = 3 * 60 * 60 * 1000;
        const expiry = Date.now() + threeHours;

        set({ storeId, tableId, customerKey, expiry });
      },
      getUser: () => {
        const { storeId, tableId, customerKey } = get();

        return { storeId, tableId, customerKey };
      },
      setSessionId: (id) => set({ sessionId: id }),

      clearUser: () => {
        set({ storeId: null, tableId: null, customerKey: null, expiry: null });
      },
    })),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
