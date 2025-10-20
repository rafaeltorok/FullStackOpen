import express from 'express';
import { getData, findPerson, generateId, isDuplicate, storeInDatabase } from '../utils/utils.js';

const phonebookRouter = express.Router();
let personsList = getData();

// GET all people from the Phonebook
phonebookRouter.get('/api/persons', (request, response) => {
  return response.json(personsList);
});

// GET a single person by the id
phonebookRouter.get('/api/persons/:id', (request, response) => {
  const personToFind = findPerson(request.params.id, personsList);

  if (personToFind) {
    return response.json(personToFind);
  } else {
    response.status(404).end();
  }
});

// POST a new person into the Phonebook
phonebookRouter.post('/api/persons', (request, response) => {
  let { name, number } = request.body || {};

  // Checks if any of the fields are missing from the request
  if (typeof name !== 'string' || typeof number !== 'string') {
    return response.status(400).json({ message: 'Both name and number are required' });
  }

  name = name.trim();
  number = number.trim();

  // Checks if the string was made of whitespaces only
  if (!name || !number) {
    return response.status(400).json({ message: 'Both name and number are required' });
  }

  const newPerson = {
    id: generateId(personsList),
    name: name.trim(),
    number: number.trim()
  };

  if (isDuplicate(newPerson, personsList)) {
    return response.status(409).json({ message: `${newPerson.name} is already on the Phonebook` });
  }

  personsList.push(newPerson);
  storeInDatabase(personsList);
  return response.json(newPerson);
});

// DELETE a person by the id
phonebookRouter.delete('/api/persons/:id', (request, response) => {
  const personToFind = findPerson(request.params.id, personsList);

  if (personToFind) {
    personsList = personsList.filter(p => p.id !== request.params.id);
    storeInDatabase(personsList);
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

// GET information about the Phonebook
phonebookRouter.get('/info', (request, response) => {
  return response.send(`Phonebook has info for ${personsList.length} people ${new Date()}`);
});

export default phonebookRouter;