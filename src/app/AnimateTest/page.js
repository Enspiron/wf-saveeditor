"use client"
import React from 'react';
import styled from 'styled-components';

const ConicImageWrapper = styled.div`
  position: relative;
  z-index: 0;
  width: 56px;
  height: 56px;
  margin: 20px;
  border-radius: 10px;
  overflow: hidden;
  padding: 0.3rem;

  &::before {
    content: '';
    position: absolute;
    z-index: -2;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    background-color: #f66fff;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(transparent, rgba(254, 240, 255, 1), transparent 30%);
    animation: rotate 0.75s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    left: 6px;
    top: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    background: #000;
    border-radius: 5px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }

  @keyframes opacityChange {
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ConicImageContent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  &:hover {
    animation: opacityChange 5s infinite linear;
  }
`;


const Page = () => {
    return (
        <div>
            <ConicImageWrapper>
                <ConicImageContent
                    src="https://eliya-bot.herokuapp.com/img/assets/item/equipment/sword_0070_epuration.png"
                />
            </ConicImageWrapper>
        </div>
    );
};

export default Page;