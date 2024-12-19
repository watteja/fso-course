import { useState, useEffect } from "react";
import axios from "axios";
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";
import { getAllEntries, createEntry } from "./diaryService";

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    getAllEntries().then((entries) => setDiaryEntries(entries));
  }, []);

  const notify = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  const addEntry = async (entry: NewDiaryEntry) => {
    try {
      const newEntry = await createEntry(entry);
      setDiaryEntries(diaryEntries.concat(newEntry));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        notify(error.response?.data || "Unknown error");
      } else {
        notify("Unknown error");
      }
    }
  };

  return (
    <>
      <h3>Add new entry</h3>
      <Notify errorMessage={errorMessage} />
      <EntryForm onAddEntry={addEntry} onError={notify} />

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
  onError: (message: string) => void;
}

const EntryForm = ({ onAddEntry, onError }: EntryFormProps) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>();
  const [weather, setWeather] = useState<Weather>();
  const [comment, setComment] = useState("");

  const handleAddEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!visibility || !date || !weather) {
      onError("Please fill in all required fields");
      return;
    }

    onAddEntry({
      date,
      visibility,
      weather,
      comment,
    });
  };

  return (
    <>
      <form onSubmit={handleAddEntry}>
        <div>
          <label>date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          <label>visibility</label>{" "}
          <label htmlFor="visibility-great">{Visibility.Great}</label>
          <input
            type="radio"
            name="visibility"
            id="visibility-great"
            value={Visibility.Great}
            onChange={() => setVisibility(Visibility.Great)}
          />
          <label htmlFor="visibility-good">{Visibility.Good}</label>
          <input
            type="radio"
            name="visibility"
            id="visibility-good"
            value={Visibility.Good}
            onChange={() => setVisibility(Visibility.Good)}
          />
          <label htmlFor="visibility-ok">{Visibility.Ok}</label>
          <input
            type="radio"
            name="visibility"
            id="visibility-ok"
            value={Visibility.Ok}
            onChange={() => setVisibility(Visibility.Ok)}
          />
          <label htmlFor="visibility-poor">{Visibility.Poor}</label>
          <input
            type="radio"
            name="visibility"
            id="visibility-poor"
            value={Visibility.Poor}
            onChange={() => setVisibility(Visibility.Poor)}
          />
        </div>
        <div>
          <label>weather</label>{" "}
          <label htmlFor="weather-sunny">{Weather.Sunny}</label>
          <input
            type="radio"
            name="weather"
            id="weather-sunny"
            value={Weather.Sunny}
            onChange={() => setWeather(Weather.Sunny)}
          />
          <label htmlFor="weather-rainy">{Weather.Rainy}</label>
          <input
            type="radio"
            name="weather"
            id="weather-rainy"
            value={Weather.Rainy}
            onChange={() => setWeather(Weather.Rainy)}
          />
          <label htmlFor="weather-cloudy">{Weather.Cloudy}</label>
          <input
            type="radio"
            name="weather"
            id="weather-cloudy"
            value={Weather.Cloudy}
            onChange={() => setWeather(Weather.Cloudy)}
          />
          <label htmlFor="weather-stormy">{Weather.Stormy}</label>
          <input
            type="radio"
            name="weather"
            id="weather-stormy"
            value={Weather.Stormy}
            onChange={() => setWeather(Weather.Stormy)}
          />
          <label htmlFor="weather-windy">{Weather.Windy}</label>
          <input
            type="radio"
            name="weather"
            id="weather-windy"
            value={Weather.Windy}
            onChange={() => setWeather(Weather.Windy)}
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

const Notify = ({ errorMessage }: { errorMessage: string }) => {
  if (!errorMessage) {
    return null;
  }
  return <p style={{ color: "red" }}>{errorMessage}</p>;
};

export default App;
