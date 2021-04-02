import {AlertProps} from '@material-ui/lab';
import {Accounts} from 'domain/accounts/defs';
import {Categories} from 'domain/categories/defs';
import {Currencies} from 'domain/currencies/defs';
import {Inventory} from 'domain/inventories/defs';
import {Property} from 'domain/properties/defs';
import {Stock} from 'domain/stocks/defs';
import {Bootstrap} from 'domain/users/defs';
import * as React from 'react';
import {LazyLoadedState} from 'state/defs';
import {Summary} from 'state/summary';

export type SnackbarProps = {
    message: React.ReactNode;
};

export type Snackbar = {
    id: string;
    severity: AlertProps['severity'];
} & SnackbarProps;

export type GlobalState = {
    currencies: Currencies;
    privacyToggle: boolean;

    categories: Categories;
    moneyLocations: Accounts;
    refreshWidgets: string;
    user: Bootstrap;
    snackbars: Snackbar[];
    summary: Summary;
    stocks: Stock[];
    inventories: Inventory[];
    properties: LazyLoadedState<Property[]>;
};
