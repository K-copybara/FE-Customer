import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    devtools((set, get) => ({
      storeName: null,
      storeId: null,
      tableId: null,
      customerKey: null,
      sessionId: null,
      expiresAt: null,

      setUser: ({ storeId, tableId, customerKey, expiresAt }) => {
        set({ storeId, tableId, customerKey, expiresAt });
      },
      getUser: () => {
        const { storeId, tableId, customerKey, expiresAt } = get();

        return { storeId, tableId, customerKey, expiresAt };
      },
      setSessionId: (id) => set({ sessionId: id }),
      setStoreName: (name) => set({ storeName: name }),

      clearUser: () => {
        set({
          storeId: null,
          tableId: null,
          customerKey: null,
          expiresAt: null,
        });
      },
    })),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
