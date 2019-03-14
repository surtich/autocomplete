import React from "react";
import { from, Subject } from "rxjs";
import { debounceTime, switchMap, tap } from "rxjs/operators";
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

const Activate = ({
  activate,
  isActive
}: {
  activate: (isActive: boolean) => void;
  isActive: boolean;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    activate(e.target.value === "active");
  };
  return (
    <div>
      <label>
        <input
          type="radio"
          name="activate"
          value="active"
          checked={isActive}
          onChange={handleChange}
        />
        Active
      </label>
      <label>
        <input
          type="radio"
          name="activate"
          value="inactive"
          checked={!isActive}
          onChange={handleChange}
        />
        Inactive
      </label>
    </div>
  );
};

class App extends React.Component {
  state = {
    isActive: true,
    searching: false,
    village: "",
    villages: []
  };

  village$: Subject<string>;

  constructor(props: any) {
    super(props);
    this.village$ = new Subject();
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const village = e.target.value;
    this.setState({
      village
    });
    if (this.village$ && !this.village$.isStopped) {
      this.village$.next(village);
    }
  };

  activate = (isActive: boolean) => {
    this.setState(
      {
        isActive
      },
      () => {
        if (isActive) {
          this.village$ = new Subject();

          this.village$.subscribe({
            complete: () => console.log("Unsubscribed")
          });

          this.village$
            .pipe(
              tap(village => {
                this.setState({
                  searching: true
                });
              }),
              debounceTime(250),
              tap(() => console.log("Starting search....")),
              switchMap(village => from(search(village)))
            )
            .subscribe(villages => {
              console.log("End search!");
              this.setState({
                searching: false,
                villages
              });
            });
        } else {
          this.village$.complete();
          this.village$.unsubscribe();
        }
      }
    );
  };

  componentDidMount() {
    this.activate(true);
  }

  componentWillUnmount() {
    this.village$.complete();
    this.village$.unsubscribe();
  }

  render() {
    const { isActive, searching, village, villages } = this.state;
    return (
      <div className="App">
        <input
          type="text"
          placeholder="village"
          onChange={this.handleChange}
          value={village}
        />
        <Activate activate={this.activate} isActive={isActive} />
        <div>{searching && <span>searching...</span>}</div>
        <div>{villages.length && <span>Total: {villages.length}</span>}</div>
        <Villages villages={villages} />
      </div>
    );
  }
}

export default App;
