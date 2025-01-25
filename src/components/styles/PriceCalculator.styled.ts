import { MdError } from "react-icons/md";
import styled from "styled-components";

export const PriceCalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TitleContainer = styled.div`
  padding: 18px;
  border-bottom: 1px solid #e4e4e4;
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 1.6rem;
  color: #009de0;
`;

export const ErrorContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #ffefee;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ErrorIcon = styled(MdError)`
  font-size: 2rem;
  color: #d9534f;
`;
