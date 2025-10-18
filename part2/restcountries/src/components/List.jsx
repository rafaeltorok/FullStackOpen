function List({ country, listSize, handleButtonClick }) {
  if (listSize > 1) {
    return (
      <li>{country} <button onClick={handleButtonClick}>show</button></li>
    );
  }
}

export default List;