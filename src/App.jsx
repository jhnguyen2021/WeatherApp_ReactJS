import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import WeatherAppSErvice from "./WeatherAppService";

function App() {
  const [count, setCount] = useState(0);

  return <WeatherAppSErvice />;
}

export default App;
