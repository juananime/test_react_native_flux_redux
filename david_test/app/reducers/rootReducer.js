/**
 * Created by Fabacus on 09/02/2017.
 */
import {combineReducers} from "redux";

import auth from "./AuthReducer";
import paco from "./PacoReducer";

const rootReducer = combineReducers({
  auth, paco

});

export default rootReducer;
