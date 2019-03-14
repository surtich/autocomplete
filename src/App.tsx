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
      Math.floor(Math.random() * 3) * 1000 + 2000
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let didCancel = false;
    search(village).then(result => {
      if (!didCancel) {
        setVillages(result);
      }
      setLoading(false);
    });
    return () => {
      didCancel = true;
    };
  }, [village]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
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
      <div>{loading && <span>loading...</span>}</div>
      <div>{villages.length && <span>Total: {villages.length}</span>}</div>
      <Villages villages={villages} />
    </div>
  );
};

export default App;
