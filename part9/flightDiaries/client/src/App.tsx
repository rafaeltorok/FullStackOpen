// Base dependencies
import { useEffect, useState } from 'react';
import { getAll, addNew } from './services/diaryService';

// Components
import AddForm from './components/AddForm';
import Entry from './components/Entry';
import Notification from './components/Notification';

// TypeScript types
import type { DiaryEntry, NewDiaryEntry } from '../../types/types';

// CSS styles
import './App.css';

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAll();
        setEntries(data);
      } catch (err: unknown) {
        if (err instanceof Error) console.error(err.message);
        else console.error(String(err));
      }
    }
    fetchData();
  }, []);

  async function addEntry(newEntry: NewDiaryEntry): Promise<void> {
    try {
      const response = await addNew(newEntry);
      setEntries(prevEntries => [ ...prevEntries, response ]);
      handleNotification("Diary entry added!", "success-message");
    } catch (err: unknown) {
      if (err instanceof Error) handleNotification(err.message, "error-message");
      else handleNotification(String(err), "error-message");
    }
  }

  function handleNotification(message: string, type: string): void {
    setNotification({ message: message, type: type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 5000);
  }

  return (
    <>
      <h1 className='main-page-title'>Flight diaries</h1>
      {notification && <Notification notification={notification}/>}
      <AddForm 
        addEntry={addEntry}
      />
      {entries.length === 0 && <h3>No diary entries available</h3>}
      {entries.map(entry => (
        <Entry
          key={entry.id}
          entry={entry}
        />
      ))}
    </>
  );
}

export default App;
