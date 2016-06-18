import {fromJS} from 'immutable';

import {setQuestions, next, respond, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_QUESTIONS':
            return setQuestions(state, fromJS(action.questions));
        case 'NEXT':
            return next(state);
        case 'RESPOND':
            return state.update('active',
                                activeState => respond(activeState, fromJS(action.response)));
    }
    return state;
}
