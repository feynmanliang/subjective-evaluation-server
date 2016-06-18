import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {INITIAL_STATE} from '../src/core';
import makeStore from '../src/store';

describe('store', () => {

    it('is a Redux store configured with the correct reducer', () => {
        const store = makeStore();
        expect(store.getState()).to.equal(INITIAL_STATE);

        const questions = fromJS([
            {
                experimentId: 2,
                choices: ['JCB1', 'sample0', 'sample1'],
                correctIndex: 0
            },
            {
                experimentId: 2,
                choices: ['sample2', 'JCB2', 'sample3'],
                correctIndex: 1
            }
        ]);
        store.dispatch({
            type: 'SET_QUESTIONS',
            questions
        });
        expect(store.getState()).to.equal(INITIAL_STATE.mergeDeep(fromJS({
            questions
        })));
    });

});
