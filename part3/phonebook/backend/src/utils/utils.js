import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('db.json');

// Reads the data from the database file and stores it into an array
const getData = () => {
  const fileData = fs.readFileSync(dbPath);
  return JSON.parse(fileData);
};

// Support function to fetch a determined person by the id number
const findPerson = (id, personsList) => {
  return personsList.find(p => p.id === id);
};

// Generates an id between 0 and 1000, while avoiding collisions
const generateId = (personsList) => {
  let id;
  do {
    id = String(Math.floor(Math.random() * 1000));
  } while (personsList.find(p => p.id === id));
  return id;
};

// Checks for duplicate entries
const isDuplicate = (personToStore, personsList) => {
  for (const person of personsList) {
    if (person.name.toLowerCase() === personToStore.name.toLowerCase()) return true;
  }
  return false;
}

const storeInDatabase = (personsList) => {
  fs.writeFileSync(dbPath, JSON.stringify(personsList, null, 2));
}

export { getData, findPerson, generateId, isDuplicate, storeInDatabase };