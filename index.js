import 'babel-polyfill'

import fetch from 'isomorphic-fetch';

import {startServer} from './src/server';

export const store = makeStore();
startServer();
