import {startServer} from './src/server';
import makeStore from './src/store';

export const store = makeStore();
startServer();
