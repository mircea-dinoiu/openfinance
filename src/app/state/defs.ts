import {Accounts} from 'accounts/defs';
import {TCategories} from 'categories/defs';
import {TCurrencies} from 'currencies/defs';
import {TInventory} from 'inventories/defs';
import {TProperty} from 'properties/defs';
import {Snackbar} from 'snackbars/defs';
import {TStock} from 'stocks/defs';
import {TBootstrap} from 'users/defs';
import {Summary} from 'summary/state';

export enum Action {
    UPDATE_STATE = 'UPDATE_STATE',
    SET_USERS = 'SET_USERS',
    SET_DISCRETE = 'SET_DISCRETE',
    REFRESH_WIDGETS = 'REFRESH_WIDGETS',

    SHOW_SNACKBAR = 'SHOW_SNACKBAR',
    HIDE_SNACKBAR = 'HIDE_SNACKBAR',

    SUMMARY_ASSIGNED = '@summary/assigned',
}

export type LazyLoadedState<D> = {
    isLoaded: boolean;
    isLoading: boolean;
    projectId: number;
    data: D;
};

export type LazyLoadedStateWithFetch<D> = LazyLoadedState<D> & {
    fetch: () => Promise<void>;
};
export type GlobalState = {
    currencies: TCurrencies;
    privacyToggle: boolean;

    categories: TCategories;
    moneyLocations: Accounts;
    refreshWidgets: string;
    user: TBootstrap;
    snackbars: Snackbar[];
    summary: Summary;
    stocks: TStock[];
    inventories: TInventory[];
    properties: LazyLoadedState<TProperty[]>;
};
