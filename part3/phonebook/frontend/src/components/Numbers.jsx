import Person from './Person.jsx';

export default function Numbers({ search, persons, handleDelete }) {
  return (
    <div>
      <h2>Numbers</h2>
      {search.trim() ? (
        <ul>
          {persons.filter(person => person.name.toLowerCase().includes(search)).map(person => (
            <Person
              key={person._id}
              person={person}
            />
          ))}
        </ul>
      ) : (
        <ul>
          {persons.map(person => (
            <Person
              key={person._id}
              person={person}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}