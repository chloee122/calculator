import { motion } from "motion/react";
import { MdError } from "react-icons/md";

interface InputErrorProps {
  message?: string;
}

function InputError({ message }: InputErrorProps) {
  const framer_error = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2 },
  };

  if (!message) return null;

  return (
    <motion.p {...framer_error} style={{ color: "red" }}>
      <MdError />
      {message}
    </motion.p>
  );
}

export default InputError;
