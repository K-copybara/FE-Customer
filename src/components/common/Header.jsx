import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import {
  display_large,
  body_medium,
  body_large,
  display_small
} from "../../styles/font"; 

import Notice from '../../assets/icon/notice-icon.svg?react';
import Dropdown from '../../assets/icon/dropdown-icon.svg?react';
import Note from '../../assets/icon/note-icon.svg?react';

const LANGUAGES = ["한국어", "English"];

const Header = ({ shopName, tableId, notice }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (!shopName || !tableId || !notice) {
    console.warn("Header 컴포넌트: shopName, tableId, notice props를 모두 전달해야 합니다.");
    return null; // 또는 기본 UI 대신 null 반환
  }

  return (
    <HeaderContainer>
      <TopRow>
          <LanguageSelect ref={dropdownRef}>
            <LangButton
              onClick={() => setDropdownOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <LangText>{selectedLang}</LangText>
              <LangIcon $open={dropdownOpen}>
                <Dropdown />
              </LangIcon>
            </LangButton>
            {dropdownOpen && (
              <LangDropdown role="listbox">
                {LANGUAGES.map((lang) => (
                  <LangDropdownItem
                    key={lang}
                    $selected={lang === selectedLang}
                    role="option"
                    aria-selected={lang === selectedLang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setDropdownOpen(false);
                    }}
                  >
                    {lang}
                  </LangDropdownItem>
                ))}
              </LangDropdown>
            )}
          </LanguageSelect>
      </TopRow>
      <MainInfoRow>
        <StoreColumn>
          <TableText>{tableId}번 테이블</TableText>
          <StoreTitle>{shopName}</StoreTitle>
        </StoreColumn>
        <OrderBtn type="button" onClick={() => navigate('/history')}>
          <Note />
          주문내역
        </OrderBtn>
      </MainInfoRow>
      <NoticeBox>
        <BellIcon>
          <Notice />
        </BellIcon>
        <NoticeText>
          {notice}
        </NoticeText>
      </NoticeBox>
    </HeaderContainer>
  );
};

export default Header;


const HeaderContainer = styled.div`
  width: 100%;
  background: var(--background);
  box-sizing: border-box; 
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: flex-end; /* 내용물을 오른쪽 끝으로 보냄 */
`;

const StoreColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  align-items: flex-start;
`;

const TableText = styled.div`
  color: var(--gray500);
  ${body_large};
`;

const MainInfoRow = styled.div`
  display: flex;
  justify-content: space-between; /* 양쪽 끝으로 요소를 보냄 */
  align-items: flex-start; /* 세로 정렬 기준을 위로 */
`;

const StoreTitle = styled.div`
  color: var(--black);
  ${display_large};
`;

const LanguageSelect = styled.div`
  position: relative;
`;

const LangButton = styled.button`
  background: none;
  border: none;
  padding: 0 0.5rem 0 0;
  display: flex;
  align-items: center;
  color: var(--black);
  cursor: pointer;
  ${body_medium};
`;

const LangText = styled.span`
  margin-right: 0.125rem;
`;

const LangIcon = styled.span`
  display: flex;
  transition: transform 0.15s;
  svg {
    display: block;
  }
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "none")};
`;

const LangDropdown = styled.ul`
  position: absolute;
  top: 1.75rem;
  right: 0;
  min-width: 5.625rem;
  background: var(--background);
  border: 0.094rem solid var(--gray300);
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(60, 63, 88, 0.08);
  padding: 0.25rem 0;
  z-index: 10;
  list-style: none;
`;

const LangDropdownItem = styled.li`
  padding: 0.375rem 1.125rem;
  color: ${({ $selected }) => ($selected ? "var(--secondary)" : "var(--black)")};
  background: ${({ $selected }) => ($selected ? "var(--gray100)" : "var(--background)")};
  cursor: pointer;
  ${body_medium};

  &:hover {
    background: var(--gray100);
  }
`;

const OrderBtn = styled.button`
  background: var(--background);
  border: 1.5px solid var(--secondary);
  color: var(--black);
  border-radius: 0.625rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  ${body_large};
  padding: 0.62rem;

  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NoticeBox = styled.div`
  display: flex;
  align-items: flex-start;
  background: var(--gray100);
  border-radius: 0.625rem;
  padding: 0.875rem 0.75rem;
  gap: 0.438rem;
`;

const BellIcon = styled.span`
  display: flex;
  align-items: flex-start;
  margin-top: 0.125rem;
`;

const NoticeText = styled.div`
  color: var(--black);
  ${display_small};
`;
