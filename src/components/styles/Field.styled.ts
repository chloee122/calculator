import styled from "styled-components";

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #333;
  font-weight: bold;
`;

export const Input = styled.input<{ $isInvalid?: boolean }>`
  height: 40px;
  padding: 0 10px;
  font-size: 1rem;

  border: 1px solid ${(props) => (props.$isInvalid ? "red" : "#ccc")};
  box-shadow: ${(props) =>
    props.$isInvalid ? "0 0 0 2px rgba(255, 0, 0, 0.2)" : "none"};
  border-radius: 4px;
  outline: none;

  &:focus {
    border: 1px solid ${(props) => (props.$isInvalid ? "red" : "#0078d7")};
    box-shadow: ${(props) =>
      props.$isInvalid
        ? "0 0 0 2px rgba(255, 0, 0, 0.2)"
        : "0 0 0 2px rgba(0, 120, 215, 0.2)"};
  }

  &::placeholder {
    color: #aaa;
  }
`;
