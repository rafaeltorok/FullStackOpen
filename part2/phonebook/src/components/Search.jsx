export default function Search({ search, handleSearch }) {
  return (
    <div>
      <h2>Search</h2>
      <div>
        <label htmlFor='search-field'>filter shown with </label>
        <input id='search-field' value={search} onChange={handleSearch} />
      </div>
    </div>
  );
}