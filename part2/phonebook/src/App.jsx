import { useState, useEffect } from 'react';
import getData from './services/persons';
import Search from './components/Search';
import AddForm from './components/AddForm';
import Numbers from './components/Numbers';


const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setPersons(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

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