export default function Person({ person, handleDelete }) {
  return (
    <p>
      {person.name} {person.number} 
      <button 
        onClick={() => handleDelete(person.id, person.name)
      }>delete</button></p>
  );
}