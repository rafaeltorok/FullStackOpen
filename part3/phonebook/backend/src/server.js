import fs from 'fs';
import express from 'express';
const app = express();

app.use(express.json());

// Reads the data from the database file and stores it into an array
const fileData = fs.readFileSync('./db.json');
let personsList = JSON.parse(fileData);

// Support function to fetch a determined person by the id number
const findPerson = (id) => {
  return personsList.find(p => p.id === id);
};

// Generates an id between 0 and 1000, while avoiding collisions
const generateId = () => {
  let id;
  do {
    id = String(Math.floor(Math.random() * 1000000));
  } while (personsList.find(p => p.id === id));
  return id;
};

// Checks for duplicate entries
const isDuplicate = (personToStore) => {
  for (const person of personsList) {
    if (person.name.toLowerCase() === personToStore.name.toLowerCase()) return true;
  }
  return false;
}

// GET all people from the Phonebook
app.get('/api/persons', (request, response) => {
  response.json(personsList);
});

// GET a single person by the id
app.get('/api/persons/:id', (request, response) => {
  const personToFind = findPerson(request.params.id);

  if (personToFind) {
    response.json(personToFind);
  } else {
    response.status(404).end();
  }
});

// POST a new person into the Phonebook
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body || {};

  if (!name || !number) {
    return response.status(400).json({ message: 'Name and number cannot be empty' });
  }

  const newPerson = {
    id: generateId(),
    name: name.trim(),
    number: number.trim()
  };

  if (isDuplicate(newPerson)) {
    return response.status(409).json({ message: `${newPerson.name} is already on the Phonebook` });
  }

  personsList.push(newPerson);
  fs.writeFileSync('./db.json', JSON.stringify(personsList, null, 2));
  return response.json(newPerson);
});

// DELETE a person by the id
app.delete('/api/persons/:id', (request, response) => {
  const personToFind = findPerson(request.params.id);

  if (personToFind) {
    personsList = personsList.filter(p => p.id !== request.params.id);
    fs.writeFileSync('./db.json', JSON.stringify(personsList, null, 2));
    response.status(204).end();
  } else {
    response.status(404).end();
  }
})

// GET information about the Phonebook
app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${personsList.length} people ${new Date()}`);
});

const port = 3001;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});