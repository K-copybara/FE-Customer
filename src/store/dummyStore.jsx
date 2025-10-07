import mandooSvg from '../assets/mandoo.svg';

// 가게 정보
export const storeInfo = {
  storeId: '1', // 추가
  tableId: 6, // tableNumber -> tableId
  shopName: '딤딤섬 명동점', //storeName -> shopName
  notice: ( //noticeText -> notice
    <>
      음식은 무제한 이용 가능합니다.
      <br />
      이용 시간은 3시간 입니다.
    </>
  ),
};

// 메뉴 데이터
export const menuData = [
    {
      menuId: 101, // id -> menuId
      menuName: '탄탄지 샐러드', // name -> menuName
      menuInfo: '국내산 닭가슴살과 고구마무스가 들어간 샐러드', // description -> menuInfo
      menuPrice: 8600, // price -> menuPrice
      menuPicture: mandooSvg, // imgUrl -> menuPicture
      category: {
        categoryId: 1,
        categoryName: '신메뉴',
      }
    },
    {
      menuId: 102,
      menuName: '탕신 딤섬',
      menuInfo: '새우와 돼지고기를 넣고 만든 딤섬으로 부드럽고 쫄깃한 식감이 일품',
      menuPrice: 8000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 2,
        categoryName: '딤섬',
      }
    },
    {
      menuId: 3,
      menuName: '딘타이펑 딤섬',
      menuInfo: '새우와 돼지고기를 넣고 만든 딤섬',
      menuPrice: 8000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 2,
        categoryName: '딤섬',
      }
    },
    {
      menuId: 4,
      menuName: '딘타이펑 딤섬',
      menuInfo: '새우와 돼지고기를 넣고 만든 딤섬',
      menuPrice: 8000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 2,
        categoryName: '딤섬',
      }
    },
    {
      menuId: 5,
      menuName: '딘타이펑 딤섬',
      menuInfo: '새우와 돼지고기를 넣고 만든 딤섬',
      menuPrice: 8000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 2,
        categoryName: '딤섬',
      }
    },
    {
      menuId: 6,
      menuName: '딘타이펑 딤섬',
      menuInfo: '새우와 돼지고기를 넣고 만든 딤섬',
      menuPrice: 8000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 2,
        categoryName: '딤섬',
      }
    },
    {
      menuId: 7,
      menuName: '딘타이펑 딤섬',
      menuInfo: '새우와 돼지고기를 넣고 만든 딤섬',
      menuPrice: 8000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 2,
        categoryName: '딤섬',
      }
    },
    {
      menuId: 8,
      menuName: '딘타이펑 딤섬',
      menuInfo: '새우와 돼지고기를 넣고 만든 딤섬으로 부드럽고 쫄깃한 식감이 일품',
      menuPrice: 8000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 2,
        categoryName: '딤섬',
      }
    },
    {
      menuId: 9,
      menuName: '창린 요리',
      menuInfo: '전통 창린 스타일 요리',
      menuPrice: 12000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 3,
        categoryName: '창린',
      }
    },
    {
      menuId: 10,
      menuName: '차슈',
      menuInfo: '광동식 바베큐 돼지고기',
      menuPrice: 15000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 4,
        categoryName: '광동식 바베큐',
      }
    },
    {
      menuId: 11,
      menuName: '만두',
      menuInfo: '집에서 만든 수제 만두',
      menuPrice: 6000,
      menuPicture: mandooSvg,
      category: {
        categoryId: 5,
        categoryName: '사이드메뉴',
      }
    },
    {
      menuId: 12,
      menuName: '물티슈',
      menuInfo: '한라산 고급 물티슈 제공해드림',
      menuPrice: 0,
      menuPicture: mandooSvg,
      category: {
        categoryId: 1234,
        categoryName: '요청사항',
      }
    }
];
 // 카테고리 목록에 categoryId, categoryName 추가
export const categories = [
  {categoryId: 1, categoryName: '신메뉴'},
  {categoryId: 2, categoryName: '딤섬'},
  {categoryId: 3, categoryName: '창린'},
  {categoryId: 4, categoryName: '광동식 바베큐'},
  {categoryId: 5, categoryName: '사이드메뉴'},
  {categoryId: 1234, categoryName: '요청사항'},
];
