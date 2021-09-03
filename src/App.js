import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { switchMap, map, flatMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { interval, Observable, Subject, BehaviorSubject } from 'rxjs';
import { timer, from } from 'rxjs';

const api = `https://randomuser.me/api/?results=5&seed=rx-react&nat=us&inc=name&noinfo`;
// const names$ = interval(5000).pipe(switchMap(() => ajax.getJSON(api)));

// ==========================================================
// const useObservable = observable => {
//   const [state, setState] = useState();
//   useEffect(() => {
//     const subscription = observable.subscribe(setState);
//     return () => subscription.unsubscribe();
//   }, []);
//   return state;
// };

// export default function App() {
//   const names$ = ajax.getJSON(api);

//   const names = useObservable(names$);

// =========================================================
// export default function App() {
//   const [names, setNames] = useState();
//   const names$ = ajax.getJSON(api);

//   useEffect(() => {
//     const subscription = names$.subscribe(setNames);
//     return () => subscription.unsubscribe();
//   }, []);

// =========================================================
// const fetchResults = {
//   results: [
//     { name: { title: 'Mr', first: 'Mason', last: 'Holmes' } },
//     { name: { title: 'Ms', first: 'Lena', last: 'Holmes' } },
//     { name: { title: 'Mr', first: 'John', last: 'Holmes' } }
//   ]
// };

// export default function App() {
//   const [names, setNames] = useState();

// const names$ = new Observable.create(observer => {
//   observer.next(fetchResults);
// });

// useEffect(() => {
//   names$.subscribe(setNames);
// }, []);

// =========================================================
// const fetchResults = {
//   results: [
//     { name: { title: 'Mr', first: 'Mason', last: 'Holmes' } },
//     { name: { title: 'Ms', first: 'Lena', last: 'Holmes' } },
//     { name: { title: 'Mr', first: 'John', last: 'Holmes' } }
//   ]
// };

// export default function App() {
//   const [names, setNames] = useState();
//   useEffect(() => {
//     const names$ = new Subject();
//     names$.subscribe(setNames);
//     names$.next(fetchResults);
//   }, []);

// ========================================================

export default function App() {
  function onLoad(req, res, rej) {
    if (req.status >= 200 && req.status < 300) {
      res(req.response);
    } else {
      rej({ ...req.response, status: req.status });
    }
  }

  function fetch(api) {
    const req = new XMLHttpRequest();
    return {
      promise: new Promise((res, rej) => {
        req.onload = function onLoadHandler() {
          onLoad(req, res, rej);
        };
        req.onerror = function onErrorHandler(e) {
          rej(e);
        };
        req.open('GET', api);
        req.send();
      })
    };
  }

  const req$ = () => {
    const { promise } = fetch(api);
    return from(promise).pipe(map(x => JSON.parse(x)));
  };

  const [names, setNames] = useState();
  useEffect(() => {
    req$().subscribe(x => setNames(x));
  }, []);

  const listNames = names?.results;
  console.log('listNames: ', listNames);

  return (
    <div className="App">
      <h1>RxJS with React</h1>
      <List items={listNames} />
    </div>
  );
}

const List = ({ items = [], loading = false }) => (
  <ul className={loading ? 'loading' : null}>
    {items.map((item, i) => {
      console.log('item: ', item);
      return <li key={i}>{item.name.first}</li>;
    })}
  </ul>
);

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
