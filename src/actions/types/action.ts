import {Dispatcher} from '@flux/types/store';

export type ActionExecuter = (dispatch: Dispatcher) => void;
