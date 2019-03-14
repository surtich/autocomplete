import React from "react";
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

class App extends React.Component {
  state = {
    village: "",
    villages: []
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const village = e.target.value;
    this.setState({ village });
    search(village).then(results => {
      this.setState({
        villages: results
      });
    });
  };

  render() {
    const { village, villages } = this.state;
    return (
      <div className="App">
        <input
          type="text"
          placeholder="village"
          onChange={this.handleChange}
          value={village}
        />
        <div>{villages.length && <span>Total: {villages.length}</span>}</div>
        <Villages villages={villages} />
      </div>
    );
  }
}

export default App;
