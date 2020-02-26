import React, { useState, useReducer, useEffect, useContext } from 'react';
import io from 'socket.io-client';

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var SocketContext = React.createContext(null);
var SocketProvider = function SocketProvider(_ref) {
  var uri = _ref.uri,
      children = _ref.children,
      reducer = _ref.reducer,
      _ref$initialState = _ref.initialState,
      initialState = _ref$initialState === void 0 ? {} : _ref$initialState;

  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      socket = _useState2[0],
      setSocket = _useState2[1];

  var _useReducer = useReducer(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  useEffect(function () {
    var newSocket = io.connect(uri);
    var emit = newSocket.io.emit.bind(newSocket.io);

    newSocket.io.emit = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var eventType = args[0],
          event = args[1];

      if (eventType === 'packet') {
        var _event$data = event.data,
            data = _event$data === void 0 ? [] : _event$data;

        var _data = _slicedToArray(data, 2),
            eventName = _data[0],
            payload = _data[1];

        var action = {
          type: eventName,
          payload: payload
        };
        dispatch(action);
      }

      return emit.apply(void 0, args);
    };

    setSocket(newSocket);
    return function () {
      setSocket(null);
      return newSocket.disconnect();
    };
  }, []);
  return React.createElement(SocketContext.Provider, {
    value: {
      socket: socket,
      state: state
    }
  }, children);
};
var useSocket = function useSocket() {
  var _useContext = useContext(SocketContext),
      socket = _useContext.socket;

  return socket;
};
var useSocketState = function useSocketState() {
  var _useContext2 = useContext(SocketContext),
      state = _useContext2.state;

  return state;
};
var useEmitEvent = function useEmitEvent(eventName) {
  var socket = useSocket();
  return function (data) {
    return socket.emit(eventName, data);
  };
};

export { SocketProvider, useEmitEvent, useSocket, useSocketState };
//# sourceMappingURL=SocketProvider.js.map
