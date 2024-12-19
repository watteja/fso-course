import { useState, useEffect } from "react";
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";
import { getAllEntries, createEntry } from "./diaryService";

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllEntries().then((entries) => setDiaryEntries(entries));
  }, []);

  const addEntry = async (entry: NewDiaryEntry) => {
    const newEntry = await createEntry(entry);
    setDiaryEntries(diaryEntries.concat(newEntry));
  };

  return (
    <>
      <EntryForm onAddEntry={addEntry} />

      <h3>Diary entries</h3>
      {diaryEntries.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </>
  );
}

const Entry = ({ entry }: { entry: DiaryEntry }) => (
  <>
    <h4>{entry.date}</h4>
    <div>visibility: {entry.visibility}</div>
    <div>weather: {entry.weather}</div>
  </>
);

interface EntryFormProps {
  onAddEntry: (entry: NewDiaryEntry) => void;
}

const EntryForm = ({ onAddEntry }: EntryFormProps) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");

  const handleAddEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onAddEntry({
      date,
      visibility: visibility as Visibility,
      weather: weather as Weather,
      comment,
    });
  };

  return (
    <>
      <h3>Add new entry</h3>
      <form onSubmit={handleAddEntry}>
        <div>
          <label>date</label>
          <input
            type="text"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          <label>visibility</label>
          <input
            type="text"
            value={visibility}
            onChange={(event) => setVisibility(event.target.value)}
          />
        </div>
        <div>
          <label>weather</label>
          <input
            type="text"
            value={weather}
            onChange={(event) => setWeather(event.target.value)}
          />
        </div>
        <div>
          <label>comment</label>
          <input
            type="text"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button>add</button>
      </form>
    </>
  );
};

export default App;
