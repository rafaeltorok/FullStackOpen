export default function AddForm({ newName, handleNameChange, newNumber, handleNumberChange, handleSubmit }) {
  return (
    <div>
      <h2>Add new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name-field'>name: </label>
          <input id='name-field' value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <label htmlFor='number-field'>number: </label>
          <input id='number-field' value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
}