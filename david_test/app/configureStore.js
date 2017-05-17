/**
 * Created by Fabacus on 09/02/2017.
 */
import { Provider } from 'react-redux';
import {createStore, applyMiddleware, combineReduxers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
const loggerMiddleware = createLogger({ predicate:(getState, action) => __DEV__});
import reducer from './reducers/rootReducer';

export default function configureStore(initalState) {
    const enhancer = compose(
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    );

    return createStore(reducer, initalState,enhancer);

}
