import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setQuestions, next, respond, INITIAL_STATE} from '../src/core';

describe('application logic', () => {
    describe('setQuestions', () => {
        it('adds the questions to the state', () => {
            const state = INITIAL_STATE;
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
            const nextState = setQuestions(state, questions);
            expect(nextState).to.equal(INITIAL_STATE.merge(fromJS({ questions })));
        });
    });

    describe('next', () => {
        it('takes the next question for evaluating', () => {
            const state = INITIAL_STATE.mergeDeep(fromJS({
                questions: [
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
                ]
            }));
            const nextState = next(state);
            expect(nextState).to.equal(INITIAL_STATE.mergeDeep(fromJS({
                active: {
                    question: {
                        experimentId: 2,
                        choices: ['JCB1', 'sample0', 'sample1'],
                        correctIndex: 0
                    },
                },
                questions: [
                    {
                        experimentId: 2,
                        choices: ['sample2', 'JCB2', 'sample3'],
                        correctIndex: 1
                    }
                ],
            })));
        });

        it('saves active response to responses', () => {
            const activeResponse = Map({
                choiceIndex: 1
                // TODO: time spent on question and number of plays per choice
            });
            const state = INITIAL_STATE.merge(fromJS({
                active: {
                    question: {
                        experimentId: 2,
                        choices: ['JCB1', 'sample0', 'sample1'],
                        correctIndex: 0,
                    },
                    response: activeResponse
                },
                questions: []
            }));
            const nextState = next(state);
            expect(nextState).to.equal(INITIAL_STATE.merge(fromJS({
                responses: [
                    {
                        experimentId: 2,
                        choices: ['JCB1', 'sample0', 'sample1'],
                        correctIndex: 0,
                        choiceIndex: 1
                    }
                ],
                questions: []
            })));
        });
    });

    describe('respond', () => {
        it('creates a response for the question', () => {
            const state = fromJS({
                question: {
                    experimentId: 2,
                    choices: ['JCB1', 'sample0', 'sample1'],
                    correctIndex: 0
                },
            });
            const response = Map({
                choiceIndex: 1
                // TODO: time spent on question and number of plays per choice
            });
            const nextState = respond(state, response);
            expect(nextState).to.equal(fromJS({
                question: {
                    experimentId: 2,
                    choices: ['JCB1', 'sample0', 'sample1'],
                    correctIndex: 0,
                },
                response,
            }));
        });
    });
});
