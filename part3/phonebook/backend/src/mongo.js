import mongoose from 'mongoose';
import { Person } from './models/Person.js';

mongoose.set('strictQuery', false);

const argv = process.argv;

if (argv.length < 3) {
  console.log('Usage:\n  node mongo.js <password>                # list all\n  node mongo.js <password> "<name>" <number>  # add');
  process.exit(1);
}

const password = argv[2];
const name = argv[3];
const number = argv[4];

const url = `mongodb+srv://admin:${encodeURIComponent(password)}@phonebookcontacts.ibbds.mongodb.net/?retryWrites=true&w=majority&appName=phonebookContacts`;

async function main() {
  try {
    await mongoose.connect(url);
    if (!name && !number) {
      // list all
      const persons = await Person.find({});
      console.log('phonebook:');
      persons.forEach(p => {
        console.log(`${p.name} ${p.number}`);
      });
    } else {
      // add new person
      const person = new Person({ name, number });
      await person.save();
      console.log(`added ${name} number ${number} to phonebook`);
    }
  } catch (err) {
    console.error('DB error:', err);
  } finally {
    await mongoose.connection.close();
  }
}

main();
