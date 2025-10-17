export default function Button({ handleClick, value }) {
  return (
    <button onClick={handleClick} value={value}>{value}</button>
  );
}