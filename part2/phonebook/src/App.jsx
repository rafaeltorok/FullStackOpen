import { useState, useEffect } from 'react';
import personService from './services/persons';
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
        const data = await personService.getData();
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

  const handleNumberUpdate = async (person) => {
    try {
      const returnedPerson = await personService.updateNumber(person.id, { ...person, number: newNumber.trim() });
      setPersons(persons.map((person) => (person.id !== returnedPerson.id ? person : returnedPerson)));
    } catch (err) {
      console.error(err);
    }
  }

  // Checks for invalid input, such as empty fields
  const verifyData = () => {
    // Verifies if both fields have been filled
    if (!newName.trim() || !newNumber.trim()) {
      alert('All fields are required');
      return false;
    }
    return true;
  };

  const checkDuplicates = async () => {
    for (const person of persons) {
      if (person.name.toLowerCase() === newName.toLowerCase().trim()) {
        const confirm = window.confirm(`${newName.trim()} is already added to the Phonebook, replace the old number with a new one?`);
        if (confirm) {
          await handleNumberUpdate(person);
        }
        return true;
      }
    }
    // If no duplicate was found, proceed to add a new person to the Phonebook
    return false;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // If the data verified is valid, proceed to add a new person
    if (verifyData()) {
      try {
        if (!checkDuplicates()) {
          const newPerson = { name: newName.trim(), number: newNumber.trim() }
          const savedPerson = await personService.storeData(newPerson);
          setPersons(persons.concat(savedPerson));
          setNewName('');
          setNewNumber('');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id, name) => {
    try {
      const confirm = window.confirm(`Remove ${name} from the Phonebook?`);
      if (confirm) {
        await personService.removeData(id);
        setPersons(persons.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Error removing person: ', err);
    }
  }

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
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default App;