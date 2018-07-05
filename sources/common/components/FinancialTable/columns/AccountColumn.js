// @flow
import React from 'react';
import MoneyLocationDisplay from 'common/components/FinancialTable/cells/MoneyLocationDisplay';

const style = {textAlign: 'center'};

export default {
    Header: 'Account',
    accessor: (item) => <MoneyLocationDisplay item={item} />,
    id: 'account',
    //
    headerStyle: style,
    style
};
