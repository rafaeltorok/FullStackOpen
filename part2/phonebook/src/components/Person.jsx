export default function Person({ person, handleDelete }) {
  return (
    <li>
      <button 
        onClick={() => handleDelete(person.id, person.name)
      }>delete</button>
      {person.name} {person.number} 
    </li>
  );
}