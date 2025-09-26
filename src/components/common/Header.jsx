import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import {
  display_large,
  body_medium,
  body_large,
  display_small
} from "../../styles/font"; 

const LANGUAGES = ["한국어", "English"];

const Header = ({ storeName, tableNumber, noticeText }) => {
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

  if (!storeName || !tableNumber || !noticeText) {
    console.warn("Header 컴포넌트: storeName, tableNumber, noticeText props를 모두 전달해야 합니다.");
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
                <svg width="1rem" height="1rem" viewBox="0 0 16 16">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="var(--black)"
                    strokeWidth="0.094rem"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
          <TableText>{tableNumber}</TableText>
          <StoreTitle>{storeName}</StoreTitle>
        </StoreColumn>
        <OrderBtn type="button" onClick={() => navigate('/history')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 11.4167C17.5 11.625 17.4653 11.8125 17.3958 11.9792C17.3264 12.1319 17.2153 12.2847 17.0625 12.4375L12.4583 17.0625C12.3056 17.2153 12.1458 17.3264 11.9792 17.3958C11.8125 17.4653 11.625 17.5 11.4167 17.5H5.83333C5.23611 17.5 4.68056 17.3542 4.16667 17.0625C3.65278 16.7569 3.24306 16.3472 2.9375 15.8333C2.64583 15.3194 2.5 14.7639 2.5 14.1667V5.83333C2.5 5.23611 2.64583 4.68056 2.9375 4.16667C3.24306 3.65278 3.65278 3.25 4.16667 2.95833C4.68056 2.65278 5.23611 2.5 5.83333 2.5H14.1667C14.7639 2.5 15.3194 2.65278 15.8333 2.95833C16.3472 3.25 16.75 3.65278 17.0417 4.16667C17.3472 4.68056 17.5 5.23611 17.5 5.83333V11.4167ZM15.8333 5.83333C15.8333 5.30555 15.6875 4.89583 15.3958 4.60417C15.1042 4.3125 14.6944 4.16667 14.1667 4.16667H5.83333C5.31944 4.16667 4.90972 4.3125 4.60417 4.60417C4.3125 4.89583 4.16667 5.30555 4.16667 5.83333V14.1667C4.16667 14.6806 4.3125 15.0903 4.60417 15.3958C4.90972 15.6875 5.31944 15.8333 5.83333 15.8333H11.3125L15.8333 11.3125V5.83333ZM6.66667 12.5C6.31944 12.5 6.07639 12.3611 5.9375 12.0833C5.8125 11.8056 5.8125 11.5278 5.9375 11.25C6.07639 10.9722 6.31944 10.8333 6.66667 10.8333H10C10.3472 10.8333 10.5833 10.9722 10.7083 11.25C10.8472 11.5278 10.8472 11.8056 10.7083 12.0833C10.5833 12.3611 10.3472 12.5 10 12.5H6.66667ZM6.66667 9.16667C6.31944 9.16667 6.07639 9.02778 5.9375 8.75C5.8125 8.47222 5.8125 8.19444 5.9375 7.91667C6.07639 7.63889 6.31944 7.5 6.66667 7.5H13.3333C13.6806 7.5 13.9167 7.63889 14.0417 7.91667C14.1806 8.19444 14.1806 8.47222 14.0417 8.75C13.9167 9.02778 13.6806 9.16667 13.3333 9.16667H6.66667Z" fill="#222222"/>
          </svg>
          주문내역
        </OrderBtn>
      </MainInfoRow>
      <NoticeBox>
        <BellIcon>
          <svg width="1.125rem" height="1.125rem" viewBox="0 0 24 24">
            <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z" fill="var(--black)" />
            <path
              d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2z"
              fill="none"
              stroke="var(--black)"
              strokeWidth="0.094rem"
            />
          </svg>
        </BellIcon>
        <NoticeText>
          {noticeText}
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
