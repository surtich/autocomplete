import React, { useState } from "react";
import "./App.css";
import villages from "./villages.json";

type Village = {
  readonly id: string;
  readonly name: string;
};

const search = (village: string): Village[] =>
  village.trim()
    ? villages.filter(({ name }) =>
        name.toLowerCase().includes(village.toLowerCase())
      )
    : [];

const Village = ({ id, name }: Village) => (
  <li style={{ width: "300px", textAlign: "left" }} key={id}>
    <span>{name}</span>
  </li>
);
const Villages = ({ villages }: { villages: Village[] }) => (
  <ul>{villages.map(Village)}</ul>
);

const App = () => {
  const [village, setVillage] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVillage(e.target.value);
  };
  return (
    <div className="App">
      <input
        type="text"
        placeholder="village"
        onChange={handleChange}
        value={village}
      />
      <Villages villages={search(village)} />
    </div>
  );
};

export default App;
