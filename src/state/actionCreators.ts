import {Action} from 'state/defs';
import {Bootstrap, GlobalState, Snackbar} from 'types';

export const updateState = (state: Partial<GlobalState>) => ({
    type: Action.UPDATE_STATE,
    state,
});

export const setUsers = (users: null | Bootstrap) => ({
    type: Action.SET_USERS,
    value: users,
});

export const refreshWidgets = () => ({type: Action.REFRESH_WIDGETS});

export const showSnackbar = (value: Snackbar) => ({
    type: Action.SHOW_SNACKBAR,
    value,
});
export const hideSnackbar = (value: string) => ({
    type: Action.HIDE_SNACKBAR,
    value,
});
