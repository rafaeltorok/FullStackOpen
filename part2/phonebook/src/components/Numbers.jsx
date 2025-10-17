import Person from './Person.jsx';

export default function Numbers({ search, persons, handleDelete }) {
  return (
    <div>
      <h2>Numbers</h2>
      {search.trim() ? (
        persons.filter(person => person.name.toLowerCase().includes(search)).map(person => (
          <Person
            key={person.id}
            person={person}
          />
        ))
      ) : (
        persons.map(person => (
          <Person
            key={person.id}
            person={person}
            handleDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}