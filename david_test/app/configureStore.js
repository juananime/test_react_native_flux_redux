/**
 * Created by Fabacus on 09/02/2017.
 */
import { Provider } from 'react-redux';
import {createStore, applyMiddleware, combineReduxers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
const loggerMiddleware = createLogger({ predicate:(getState, action) => __DEV__});
import reducer from './reducers/rootReducer';
import createSagaMiddleware from 'redux-saga'
import dataSaga from './sagas/sagas'


const sagaMiddleware = createSagaMiddleware()
export default function configureStore(initalState) {

   // return createStore(reducer, initalState,enhancer);
    return {
        ...createStore(reducer, initalState, applyMiddleware(thunkMiddleware,sagaMiddleware,loggerMiddleware)),
        runSaga: sagaMiddleware.run(dataSaga)
    }

}
