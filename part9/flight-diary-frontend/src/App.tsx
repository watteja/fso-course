import { useState, useEffect } from "react";
import { DiaryEntry } from "./types";
import { getAllEntries } from "./diaryService";

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllEntries().then((entries) => setDiaryEntries(entries));
  }, []);

  return (
    <>
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

export default App;
