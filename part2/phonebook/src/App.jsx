import { useState } from 'react';
import Search from './components/Search';
import AddForm from './components/AddForm';
import Numbers from './components/Numbers';


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trimStart());
  };

  // Checks for invalid input, such as empty fields or duplicated names
  const verifyData = () => {
    // Verifies if both fields have been filled
    if (!newName.trim() || !newNumber.trim()) {
      alert('All fields are required');
      return false;
    }

    // Checks for duplicated names
    for (const person of persons) {
      if (person.name.toLowerCase() === newName.toLowerCase().trim()) {
        alert(`${newName.trim()} is already added to the phonebook`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // If the data verified is valid, proceed to add a new person
    if (verifyData()) {
      setPersons(persons.concat({ name: newName.trim(), number: newNumber.trim() }));
      setNewName('');
      setNewNumber('');      
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Search
        search={search}
        handleSearch={handleSearch}
      />
      <AddForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <Numbers
        search={search}
        persons={persons}
      />
    </div>
  );
}

export default App;