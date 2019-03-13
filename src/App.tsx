import React, { useEffect, useState } from "react";
import "./App.css";
import allVillages from "./villages.json";

type Village = {
  readonly id: string;
  readonly name: string;
};

const search = (village: string): Promise<Village[]> =>
  new Promise(resolve =>
    setTimeout(
      () =>
        resolve(
          village.trim()
            ? allVillages.filter(({ name }) =>
                name.toLowerCase().includes(village.toLowerCase())
              )
            : []
        ),
      Math.floor(Math.random() * 3) * 1000
    )
  );

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
  const [villages, setVillages] = useState([] as Village[]);
  useEffect(() => {
    search(village).then(result => setVillages(result));
  }, [village]);
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
      <Villages villages={villages} />
    </div>
  );
};

export default App;
