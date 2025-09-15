import React from "react";
import styled from "styled-components";
import MenuItem from "../MenuItem";

const MenuList = ({ menus }) => {
  return (
    <List>
      {menus.map(menu => (
        <MenuItem key={menu.id} menu={menu} />
      ))}
    </List>
  );
};

export default MenuList;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
