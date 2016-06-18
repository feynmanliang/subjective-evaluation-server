import {Map,List,fromJS} from 'immutable';

export const INITIAL_STATE = fromJS({
    questions: [],
    responses: [],
    active: undefined
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
        active: questions.size > 0 ?
            {
                question: questions.first(),
            } :
            undefined,
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
