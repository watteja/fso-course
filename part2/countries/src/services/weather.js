import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

const getWeatherCity = (lat, lon) => {
  // API requests by city name has been deprecated:
  // https://openweathermap.org/current#geocoding
  // Use coordinates instead
  return axios
    .get(`${baseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    .then((response) => response.data);
};

export default { getWeatherCity };
