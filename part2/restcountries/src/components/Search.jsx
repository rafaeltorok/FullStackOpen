export default function Search({ onChange }) {
  return (
    <div>
      <form>
        <label htmlFor="search-field">find countries: </label>
        <input id="search-field" type="text" onChange={onChange} />
      </form>
    </div>
  );
}