import styled, { keyframes } from "styled-components";
import { MdOutlineDirectionsBike } from "react-icons/md";

export const PriceBreakdownContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #ebf7fd;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

export const Heading = styled.h1`
  margin-bottom: 10px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CourierIcon = styled(MdOutlineDirectionsBike)`
  font-size: 1.5rem;
  color: #009de0;
`;

export const PriceItem = styled.div`
  font-size: 1rem;
  margin-bottom: 8px;

  & span {
    font-weight: bold;
  }
`;

export const SkeletonLoadingEffect = keyframes`
  0% {
    background-position: -150% 0;
  }
  100% {
    background-position: 150% 0;
  }
`;

export const SkeletonItem = styled.div`
  height: 17px;
  margin: 10px 0;
  border-radius: 4px;
  background: linear-gradient(90deg, #d4eaf5 25%, #b9ddef 50%, #d4eaf5 75%);
  background-size: 200% 100%;
  animation: ${SkeletonLoadingEffect} 1.5s infinite;
`;
