import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {INITIAL_STATE} from '../src/core';
import reducer from '../src/reducer';

describe('reducer', () => {
    it('handles SET_QUESTIONS', () => {
        const initialState = INITIAL_STATE;
        const questions = [
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
        ];
        const action = {
            type: 'SET_QUESTIONS',
            questions
        };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(INITIAL_STATE.merge(fromJS({
            questions
        })));
    });

    it('handles NEXT', () => {
        const questions = [
            {
                experimentId: 2,
                choices: ['JCB1', 'sample0', 'sample1'],
                correctIndex: 0
            }
        ];
        const initialState = INITIAL_STATE.merge(fromJS({ questions }));
        const action = { type: 'NEXT' };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(INITIAL_STATE.mergeDeep(fromJS({
            active: {
                question: {
                    experimentId: 2,
                    choices: ['JCB1', 'sample0', 'sample1'],
                    correctIndex: 0
                },
            },
            questions: []
        })));
    });

    it('handles RESPOND', () => {
        const initialState = INITIAL_STATE.merge(fromJS({
            active: {
                question: {
                    experimentId: 2,
                    choices: ['JCB1', 'sample0', 'sample1'],
                    correctIndex: 0
                },
            },
            questions: []
        }));
        const response = {
            choiceIndex: 1
            // TODO: time spent on question and number of plays per choice
        };
        const action = { type: 'RESPOND', response };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(INITIAL_STATE.merge(fromJS({
            active: {
                question: {
                    experimentId: 2,
                    choices: ['JCB1', 'sample0', 'sample1'],
                    correctIndex: 0,
                },
                response
            },
            questions: []
        })));
    });

    it('handles undefined initial state', () => {
        const questions = [
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
        ];
        const action = { type: 'SET_QUESTIONS', questions };
        const nextState = reducer(undefined, action);
        expect(nextState).to.equal(INITIAL_STATE.merge(fromJS({
            questions
        })));
    });

    it('can be used with reduce', () => {
        const questions = [
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
        ];
        const response = {
            choiceIndex: 1
            // TODO: time spent on question and number of plays per choice
        };
        const actions = [
            {type: 'SET_QUESTIONS', questions },
            {type: 'NEXT'},
            {type: 'RESPOND', response },
            {type: 'NEXT'}
        ];
        const finalState = actions.reduce(reducer, undefined);

        expect(finalState).to.equal(INITIAL_STATE.mergeDeep(fromJS({
            responses: [
                {
                    experimentId: 2,
                    choices: ['JCB1', 'sample0', 'sample1'],
                    correctIndex: 0,
                    choiceIndex: 1
                }
            ],
            active: {
                question: {
                    experimentId: 2,
                    choices: ['sample2', 'JCB2', 'sample3'],
                    correctIndex: 1
                },
            },
            questions: []
        })));
    });
});
