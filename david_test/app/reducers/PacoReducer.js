import {
    PACO_TYPED
} from '../actions/types';


const INITIAL_STATE = {
    isPaco:false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PACO_TYPED: {
            return Object.assign({}, state, { isPaco: action.payload });
        }
        default:
            return state;
    }
};
