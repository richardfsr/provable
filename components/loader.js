import { SquareLoader } from "react-spinners";

export default function Loader({
  size = 50,
  color = "black",
  text,
}) {
  return (
    <>
      <SquareLoader
        size={size}
        color={color}
        loading={true}
      />
      {text && <p>{text}</p>}
    </>
  );
}
