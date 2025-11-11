import React from "react";
import styled from "styled-components";

const ScrollBtnContainer = styled.div`
  position: absolute;
  right: 30px;
  bottom: 84px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: top 0.1s ease-in-out;
`;

const TopButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

const BottomButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

interface ScrollToTopButtonProps {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}

export default function ScrollButton({
  scrollContainerRef,
}: ScrollToTopButtonProps) {
  const handleUpClick = () => {
    console.log("Top 버튼 클릭");
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownClick = () => {
    console.log("Bottom 버튼 클릭");
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <ScrollBtnContainer>
      <TopButton onClick={handleUpClick} aria-label="맨 위로">
        {/* 위쪽 화살표 SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 14l5-5 5 5"
            stroke="var(--color-gray-semi-dark)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </TopButton>
      <BottomButton onClick={handleDownClick} aria-label="맨 아래로">
        {/* 아래쪽 화살표 SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10l5 5 5-5"
            stroke="var(--color-gray-semi-dark)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </BottomButton>
    </ScrollBtnContainer>
  );
}
