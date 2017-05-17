/**
 * Created by Fabacus on 09/02/2017.
 */
import {combineReducers} from "redux";

import auth from "./AuthReducer";

const rootReducer = combineReducers({
  auth,

});

export default rootReducer;
