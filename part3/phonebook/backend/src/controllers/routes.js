import express from 'express';
import { Person } from '../models/Person.js';

const phonebookRouter = express.Router();

// GET all people from the Phonebook
phonebookRouter.get('/api/persons', async (request, response, next) => {
  try {
    const people = await Person.find({});
    return response.json(people);
  } catch (err) {
    next(err);
  }
});

// GET a single person by the id
phonebookRouter.get('/api/persons/:id', async (request, response, next) => {
  try {
    const personToFind = await Person.findById(request.params.id);

    if (personToFind) {
      return response.json(personToFind);
    } else {
      response.status(404).end(); // Valid ID, but doesn't exist
    }
  } catch (err) {
    next(err);
  }
});

// POST a new person into the Phonebook
phonebookRouter.post('/api/persons', async (request, response, next) => {
  try {
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

    const newPerson = new Person ({
      name: name.trim(),
      number: number.trim()
    });

    // Checks for a duplicated entry
    const people = await Person.find({});
    for (const person of people) {
      if (person.name.toLowerCase() === newPerson.name.toLowerCase()) {
        return response.status(409).json({ message: `${newPerson.name} is already on the Phonebook` });
      }
    }

    await newPerson.save();
    return response.json(newPerson);
  } catch (err) {
    next(err);
  }
});

// PUT: updates a phone number from the Phonebook
phonebookRouter.put('/api/persons/:id', async (request, response, next) => {
  try {
    // First, check if the number has been properly sent in the request
    let number = request.body.number;

    // Checks if any of the fields are missing from the request
    if (typeof number !== 'string') {
      return response.status(400).json({ message: 'The number is required' });
    }

    number = number.trim();

    // Checks if the string was made of whitespaces only
    if (!number) {
      return response.status(400).json({ message: 'The number is required' });
    }

    // Gets the id and checks if is valid
    const id = request.params.id;
    const personToUpdate = await Person.findById(id);

    if (personToUpdate) {
      const updatedPerson = await Person.findByIdAndUpdate(
        id,
        { name: personToUpdate.name, number: number },
        { new: true }
      );
      return response.json(updatedPerson);
    } else {
      response.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

// DELETE a person by the id
phonebookRouter.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const personToFind = await Person.findById(id);

    if (personToFind) {
      await Person.findByIdAndDelete(id);
      response.status(204).end();
    } else {
      response.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

// GET information about the Phonebook
phonebookRouter.get('/info', async (request, response, next) => {
  try {
    const personsList = await Person.find({});
    return response.send(`Phonebook has info for ${personsList.length} people ${new Date()}`);
  } catch (err) {
    next(err);
  }
});

export default phonebookRouter;