import { motion } from "framer-motion";
import styled from "styled-components";
import { MdError } from "react-icons/md";

export const ErrorMessage = styled(motion.span)`
  color: red;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  gap: 4px;
`;

export const ErrorIcon = styled(MdError)`
  font-size: 1.2rem;
`;
