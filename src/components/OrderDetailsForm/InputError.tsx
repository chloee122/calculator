import { ErrorIcon, ErrorMessage } from "../styles/InputError.styled";

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
    <ErrorMessage {...framer_error} role="alert">
      <ErrorIcon />
      {message}
    </ErrorMessage>
  );
}

export default InputError;
