import styled from "styled-components";

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 400px;
`;

export const Heading = styled.h1`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

export const Button = styled.button`
  height: 40px;
  border: none;
  padding: 5px 20px;
  border-radius: 7px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
  margin-top: 10px;

  &[id="getLocation"] {
    background-color: #ebf7fd;
    color: #009de0;
    min-width: 125.5px;
  }

  &[id="calculateDeliveryPrice"] {
    background-color: #009de0;
    font-weight: bold;
  }

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
