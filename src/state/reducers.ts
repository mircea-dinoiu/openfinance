import {Actions} from 'state/actions';
import uniqueId from 'lodash/uniqueId';
import {getScreenQueries} from 'utils/getScreenQueries';
import {combineReducers} from 'redux';
import {parsePreferences, validatePreferences} from 'utils/preferences';
import {TypePreferences} from 'types';

const stateKeysWithoutReducers = [];
const screen = (state = getScreenQueries(), action) =>
    action.type === Actions.SET_SCREEN ? action.value : state;
const screenSize = (state = getScreenQueries(), action) =>
    action.type === Actions.SET_SCREEN ? action.value : state;
const refreshWidgets = (state = uniqueId(), action) =>
    action.type === Actions.REFRESH_WIDGETS ? uniqueId() : state;
const bindToUpdateState = (prop, defaultValue) => {
    stateKeysWithoutReducers.push(prop);

    return (state = defaultValue, action) => {
        if (action.type === Actions.UPDATE_STATE) {
            Object.keys(action.state).forEach((key) => {
                if (!stateKeysWithoutReducers.includes(key)) {
                    throw new Error(
                        `${key} has its own reducer. Please use action ${
                            Actions.UPDATE_STATE
                        } only for ${stateKeysWithoutReducers.join(', ')}`,
                    );
                }
            });

            if (action.state.hasOwnProperty(prop)) {
                return action.state[prop];
            }
        }

        return state;
    };
};
const user = (state = null, action) =>
    action.type === Actions.SET_USERS ? action.value : state;
const preferences = (state: TypePreferences = parsePreferences(), action) => {
    switch (action.type) {
        case Actions.UPDATE_PREFERENCES:
            return {...state, ...action.value};
    }

    return validatePreferences(state);
};
const snackbars = (state = [], action) => {
    switch (action.type) {
        case Actions.SHOW_SNACKBAR:
            return state.concat(action.value);
        case Actions.HIDE_SNACKBAR:
            return state.filter((snackbar) => snackbar.id !== action.value);
    }

    return state;
};
const title = bindToUpdateState('title', 'Loading...');
const currenciesDrawerOpen = bindToUpdateState('currenciesDrawerOpen', false);
const currencies = (state = null, action) => {
    if (action.type === Actions.SET_BASE_CURRENCY_ID) {
        return {
            ...state,
            default: action.value,
        };
    }

    if (action.type === Actions.UPDATE_CURRENCIES) {
        return {
            ...state,
            ...action.value,
        };
    }

    return state;
};
const categories = bindToUpdateState('categories', []);
const moneyLocations = bindToUpdateState('moneyLocations', []);
const moneyLocationTypes = bindToUpdateState('moneyLocationTypes', []);

export const combinedReducers = combineReducers({
    // @deprecated screen is a global in Window, use screenSize instead
    screen,
    screenSize,
    title,
    currenciesDrawerOpen,
    refreshWidgets,
    user,
    currencies,
    categories,
    moneyLocations,
    moneyLocationTypes,
    preferences,
    snackbars,
});
