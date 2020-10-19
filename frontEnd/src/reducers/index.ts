import * as todoReducer from "./todo";

import { Todo } from "../model";
import { combineReducers } from "redux";

export interface RootState {
	todoList: Todo[];
}

export default () =>
	combineReducers({
		...todoReducer,
	});
