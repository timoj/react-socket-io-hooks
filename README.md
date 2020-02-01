# React Socket.io Hooks

## SocketProvider

SocketProvider connects to a websocket server and begins
listening to emitted events. All emitted events will hit
a reducer and update state.

### Props

* `uri: string` - The location of the websocket server
* `reducer: (state, action) => {}` - A reducer function to
  handle incoming events
  * `action: { type: string, payload: any }`
* `initialState` - The initial state of the application (defaults to `{}`)

```js
const reducer = (state, action) => {
  console.log(action)
  return state;
};

export default function App() {
  return (
    <SocketProvider
      uri="http://localhost:7891"
      reducer={reducer}
      initialState={{}}>
      <h1>Hello World</h1>
    </SocketProvider>
  );
}
```

## useSocket

This hook returns the connected socket

```js
export const Counter = () => {
  const socket = useSocket();
}
```

## useSocketState

This hook returns the current state;

```js
export const Counter = () => {
  const socket = useSocketState();
}
```

## useEmitEvent

This hook returns the a function to emit and event to the
websocket server

```js
export const Counter = () => {
  const emitEvent = useEmitEvent('MY_EVENT');
}
```

## Example

```js
import React from 'react';
import {
  SocketProvider,
  useSocketState,
  useEmitEvent
} from 'react-socket-io-hooks';

const reducer = (state, action) => {
  switch(action.type) {
    case 'UPDATED_COUNT':
      return { count: action.payload };
    default:
      return state;
  }
}

const Counter = () => {
  const increment = useEmitEvent('INCREMENT');
  const decrement = useEmitEvent('DECREMENT');

  return (
    <>
      <button onClick={() => decrement()}>Decrement</button>
      <button onClick={() => increment()}>Increment</button>
    </>
  )
}

const Display = () => {
  const state = useSocketState();
  console.log(state)
  return (
    <p>{state.count}</p>
  );
}

export default function App() {

  return (
    <SocketProvider
      uri="http://localhost:7891"
      reducer={reducer}
      initialState={{ count: 0 }}>
      <Counter />
      <Display />
    </SocketProvider>
  );
}
```

```js
const http = require('http').createServer();
const io = require('socket.io')(http);

let count = 0;

io.on('connection', socket => {
  socket.emit('UPDATED_COUNT', count);

  socket.on('INCREMENT', () => {
    count++;
    socket.emit('UPDATED_COUNT', count);
    socket.broadcast.emit('UPDATED_COUNT', count);
  })

  socket.on('DECREMENT', () => {
    count--;
    socket.emit('UPDATED_COUNT', count);
    socket.broadcast.emit('UPDATED_COUNT', count);
  })
});

http.listen(7891)
```
