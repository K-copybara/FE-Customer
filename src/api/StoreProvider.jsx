// contexts/StoreProvider.jsx
import React from 'react';
import { StoreContext } from './StoreContext';
import mandooSvg from '../assets/mandoo.svg';

export const StoreProvider = ({ children }) => {
  // 가게 정보
  const storeInfo = {
    storeName: "딤딤섬 명동점",
    tableNumber: "12번 테이블",
    noticeText: (
      <>
        음식은 무제한 이용 가능합니다.
        <br />
        이용 시간은 3시간 입니다.
      </>
    )
  };

  // 메뉴 데이터
  const menuData = {
    "신메뉴": [
      {
        id: 1,
        name: "신메뉴 딤섬",
        description: "새로 출시된 특별한 딤섬",
        price: 9000,
        imgUrl: mandooSvg
      }
    ],
    "딤섬": [
      {
        id: 2,
        name: "탕신 딤섬",
        description: "새우와 돼지고기를 넣고 만든 딤섬으로 부드럽고 쫄깃한 식감이 일품",
        price: 8000,
        imgUrl: mandooSvg,
        icon: null
      },
      {
        id: 3,
        name: "딘타이펑 딤섬",
        description: "새우와 돼지고기를 넣고 만든 딤섬",
        price: 8000,
        imgUrl: mandooSvg,
        icon: null
      },
      {
        id: 4,
        name: "딘타이펑 딤섬",
        description: "새우와 돼지고기를 넣고 만든 딤섬",
        price: 8000,
        imgUrl: mandooSvg,
        icon: null
      },
      {
        id: 5,
        name: "딘타이펑 딤섬",
        description: "새우와 돼지고기를 넣고 만든 딤섬",
        price: 8000,
        imgUrl: mandooSvg,
        icon: null
      },
      {
        id: 6,
        name: "딘타이펑 딤섬",
        description: "새우와 돼지고기를 넣고 만든 딤섬",
        price: 8000,
        imgUrl: mandooSvg,
        icon: null
      },
      {
        id: 7,
        name: "딘타이펑 딤섬",
        description: "새우와 돼지고기를 넣고 만든 딤섬",
        price: 8000,
        imgUrl: mandooSvg,
        icon: null
      },
      {
        id: 8,
        name: "딘타이펑 딤섬",
        description: "새우와 돼지고기를 넣고 만든 딤섬으로 부드럽고 쫄깃한 식감이 일품",
        price: 8000,
        imgUrl: mandooSvg,
        icon: null
      }
    ],
    "창린": [
      {
        id: 9,
        name: "창린 요리",
        description: "전통 창린 스타일 요리",
        price: 12000,
        imgUrl: mandooSvg,
        icon: null
      }
    ],
    "광동식 바베큐": [
      {
        id: 10,
        name: "차슈",
        description: "광동식 바베큐 돼지고기",
        price: 15000,
        imgUrl: mandooSvg,
        icon: null
      }
    ],
    "사이드메뉴": [
      {
        id: 11,
        name: "만두",
        description: "집에서 만든 수제 만두",
        price: 6000,
        imgUrl: mandooSvg,
        icon: null
      }
    ]
  };

  const categories = ["신메뉴", "딤섬", "창린", "광동식 바베큐", "사이드메뉴"];

  // 메뉴 ID로 찾기 함수
  const getMenuById = (menuId) => {
    for (const category in menuData) {
      const menu = menuData[category].find(item => item.id === parseInt(menuId));
      if (menu) return menu;
    }
    return null;
  };

  const value = {
    storeInfo,
    menuData,
    categories,
    getMenuById
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
