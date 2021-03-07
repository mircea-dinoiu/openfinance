import {routes} from 'defs/routes';
import {makeCrudReducer} from 'state/utils';
import _ from 'lodash';

export type Property = {
    id: number;
    name: string;
    cost: number;
    market_value: number;
    currency_id: number;
};

const {reducer: propertiesReducer, hook: useProperties} = makeCrudReducer<Property[]>({
    initialState: [],
    name: 'properties',
    route: routes.properties,
    parse: (properties) => _.sortBy(properties, 'name'),
});

export {propertiesReducer, useProperties};