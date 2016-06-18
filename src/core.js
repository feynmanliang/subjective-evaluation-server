import {Map,List,fromJS} from 'immutable';

export const INITIAL_STATE = fromJS({
    questions: [],
    responses: [],
    active: {
        question: undefined,
        response: undefined
    }
});

export function setQuestions(state, questions) {
    return state.set('questions', questions);
}

export function next(state) {
    const questions = state.get('questions');
    const activeQuestion = state.getIn(['active','question']);
    const activeResponse = state.getIn(['active','response']);
    const responses = state.get('responses');

    return state.merge({
        active: {
            question: questions.size > 0 ? questions.first() : undefined,
            response: undefined
        },
        questions: questions.rest(),
        responses: (activeResponse && activeQuestion) ?
            responses.push(activeQuestion.merge(activeResponse)) : responses,
    });
}

export function respond(activeState, response) {
    return activeState.merge({
        response
    });
}
