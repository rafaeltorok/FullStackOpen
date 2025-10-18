function Notification({ displayData, listSize }) {
  if (!displayData && listSize > 0) {
    return (
      <div role="status">
        <h2>Too many matches, please be more specific</h2>
      </div>
    );
  }
  return null;
}

export default Notification;