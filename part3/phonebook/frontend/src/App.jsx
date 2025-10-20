import { useState, useEffect } from 'react';
import personService from './services/persons';
import Search from './components/Search';
import AddForm from './components/AddForm';
import Numbers from './components/Numbers';
import Notification from './components/Notification';


const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState('');
  const [messageType, setMessageType] = useState('');

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

  const handleNumberUpdate = async (personId, updatedNumber) => {
    const personToUpdate = persons.find(p => p.id === personId);
    if (!personToUpdate) return;

    try {
      const updatedPerson = { ...personToUpdate, number: updatedNumber.trim() };
      const returnedPerson = await personService.updateNumber(personId, updatedPerson);
      setPersons(persons.map(p => (p.id !== returnedPerson.id ? p : returnedPerson)));
      handleNotification('success-message', `${returnedPerson.name}'s number has been updated!`);
    } catch (err) {
      console.error(err);

      handleNotification('error-message', `${personToUpdate.name}'s has already been removed from server`);
      setPersons(persons.filter(p => p.id !== personId));
    }
  }

  const handleNotification = (type, message) => {
    setMessageType(type);
    setNotification(message);
    setTimeout(() => {
      setMessageType('');
      setNotification('');
    }, 5000);
  }

  // Checks for invalid input, such as empty fields
  const verifyData = () => {
    // Verifies if both fields have been filled
    if (!newName.trim() || !newNumber.trim()) {
      handleNotification('error-message', 'All fields are required');
      return false;
    }
    return true;
  };

  const checkDuplicates = async () => {
    for (const person of persons) {
      if (person.name.toLowerCase() === newName.toLowerCase().trim()) {
        const confirm = window.confirm(`${newName.trim()} is already added to the Phonebook, replace the old number with a new one?`);
        if (confirm) {
          await handleNumberUpdate(person.id, newNumber.trim());
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
        const isDuplicate = await checkDuplicates();
        if (!isDuplicate) {
          const newPerson = { name: newName.trim(), number: newNumber.trim() }
          const savedPerson = await personService.storeData(newPerson);
          setPersons(persons.concat(savedPerson));
          setNewName('');
          setNewNumber('');
          handleNotification('success-message', `${savedPerson.name} was added to the Phonebook`);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Checks if the ID is still present on the server database before attempting to remove it
  const verifyId = async (id) => {
    try {
      const person = await personService.getDataById(id);
      if (!person) {
        return false;
      }
      return person;
    } catch (err) {
      console.error(err);
    }
  }

  const handleDelete = async (id, name) => {
    try {
      const personToRemove = await verifyId(id);
      if (!personToRemove) {
        handleNotification('error-message', `${name} was already removed from the server`);
        setPersons(persons.filter(p => p.id !== id));
        return;
      }
      const confirm = window.confirm(`Remove ${name} from the Phonebook?`);
      if (confirm) {
        await personService.removeData(id);
        setPersons(persons.filter(p => p.id !== id));
        handleNotification('success-message', `${name} was removed from the Phonebook`);
      }
    } catch (err) {
      console.error('Error removing person: ', err);
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification
        messageType={messageType}
        notification={notification}
      />
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