import "../styles/UsernameMessage.css";

type UsernameMessageProps = {
  username: string;
  isValid: boolean;
  loading: boolean;
};

export const UsernameMessage = ({
  username,
  isValid,
  loading,
}: UsernameMessageProps) => {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="UsernameMessage m-valid">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="UsernameMessage m-taken">That username is taken!</p>;
  } else {
    return <p></p>;
  }
};
