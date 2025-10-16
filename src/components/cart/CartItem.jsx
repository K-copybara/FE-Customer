import styled from 'styled-components';
import { title_large, title_medium } from '../../styles/font';
import Amountplus from '../../assets/icon/amountplus-icon.svg?react';
import Amountminus from '../../assets/icon/amountminus-icon.svg?react';
import Delete from '../../assets/icon/delete-icon.svg?react';
import defaultImage from '../../assets/default.svg';

export const CartItem = ({ item, onChangeAmount, onRemove }) => {
  return (
    <Container key={item.menuId}>
      <ItemRow>
        <ItemImage
          src={item.menuPicture || defaultImage}
          alt={item.menuName}
          onError={(e) => (e.target.src = defaultImage)}
        />
        <ItemInfo>
          <ItemName>{item.menuName}</ItemName>

          <PriceQuantitySection>
            <ItemPrice>{item.price.toLocaleString()}원</ItemPrice>
            <QuantityControls>
              <QuantityButton
                onClick={() => onChangeAmount(item.cartItemId, item.amount - 1)}
                disabled={item.amount <= 1}
              >
                <Amountminus />
              </QuantityButton>
              <QuantityDisplay>{item.amount}</QuantityDisplay>
              <QuantityButton
                onClick={() => onChangeAmount(item.cartItemId, item.amount + 1)}
              >
                <Amountplus />
              </QuantityButton>
            </QuantityControls>
          </PriceQuantitySection>
        </ItemInfo>
      </ItemRow>
      <RemoveButton onClick={() => onRemove(item.cartItemId)}>
        <Delete />
      </RemoveButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  padding: 1.5rem 0 1.5rem 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--Gray100, #fafafc);
  position: relative;
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 0.625rem;
  object-fit: cover;
  background: var(--gray100);
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ItemName = styled.div`
  ${title_large}
  color: var(--black);
`;

const ItemPrice = styled.div`
  ${title_medium}
  color: var(--black);
`;

const QuantityControls = styled.div`
  display: flex;
  padding: 0.25rem 0.75rem;
  align-items: center;
  gap: 0.75rem;

  border-radius: 0.625rem;
  border: 1px solid var(--Gray300, #d9d9d9);
  background: var(--white);
`;

const QuantityButton = styled.button`
  background: none;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  color: var(--Gray700, #717171);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PriceQuantitySection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const QuantityDisplay = styled.span`
  ${title_medium}
  color: var(--black);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--gray500);
  cursor: pointer;
`;
