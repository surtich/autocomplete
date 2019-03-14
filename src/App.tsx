import React from "react";
import { from, fromEvent, Observable, Subscription } from "rxjs";
import { debounceTime, map, switchMap, tap } from "rxjs/operators";
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
    searching: false,
    village: "",
    villages: []
  };

  village$: Observable<Village[]> | undefined;
  subscriptionVillage$: Subscription | undefined;
  villageRef: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);
    this.villageRef = React.createRef();
  }

  componentDidMount() {
    this.village$ = fromEvent<React.ChangeEvent<HTMLInputElement>>(
      this.villageRef.current as HTMLInputElement,
      "input"
    ).pipe(
      map((event: React.ChangeEvent<HTMLInputElement>) => event.target.value),
      tap(village => {
        this.setState({
          searching: true,
          village
        });
      }),
      debounceTime(250),
      tap(() => console.log("Starting search....")),
      switchMap(village => from(search(village)))
    );

    this.subscriptionVillage$ = this.village$.subscribe(villages => {
      console.log("End search!");
      this.setState({
        searching: false,
        villages
      });
    });
  }

  componentWillUnmount() {
    if (this.subscriptionVillage$) {
      this.subscriptionVillage$.unsubscribe();
    }
  }

  render() {
    const { searching, village, villages } = this.state;
    return (
      <div className="App">
        <input
          type="text"
          placeholder="village"
          defaultValue={village}
          ref={this.villageRef}
        />
        <div>{searching && <span>searching...</span>}</div>
        <div>{villages.length && <span>Total: {villages.length}</span>}</div>
        <Villages villages={villages} />
      </div>
    );
  }
}

export default App;
