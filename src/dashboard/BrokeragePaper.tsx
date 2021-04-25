import {CardHeader, Paper} from '@material-ui/core';
import IconStock from '@material-ui/icons/TrendingUp';
import {BaseTable} from 'app/BaseTable';
import {CostBasisCol, NameCol, RoiCol, RoiPercCol, ValueCol} from 'dashboard/columns';
import {DashboardGridWithSidebar} from 'dashboard/DashboardGridWithSidebar';
import {BrokerageAccount} from 'dashboard/defs';
import {CurrencyFilter} from 'dashboard/filters/CurrencyFilter';
import {groupBy} from 'lodash';
import React, {useState} from 'react';

export const BrokeragePaper = ({
    classes,
    brokerageWithTotal,
}: {
    brokerageWithTotal: BrokerageAccount[];
    classes: Record<string, string>;
}) => {
    const brokerageWithTotalGroupedByCurrencyId = groupBy(brokerageWithTotal, 'currency_id');
    const currencyIds = Object.keys(brokerageWithTotalGroupedByCurrencyId);
    const [currencyId, setCurrencyId] = useState(currencyIds[0]);

    return (
        <Paper className={classes.paper} data-testid="brokerage">
            <CardHeader
                className={classes.cardHeader}
                title={
                    <>
                        <IconStock /> Investment Accounts
                    </>
                }
            />
            <DashboardGridWithSidebar
                sidebar={
                    <>
                        <CurrencyFilter ids={currencyIds} selected={currencyId} onChange={(id) => setCurrencyId(id)} />
                    </>
                }
            >
                <BaseTable<BrokerageAccount>
                    defaultSorted={[{id: 'name', desc: false}]}
                    className={classes.table}
                    data={brokerageWithTotalGroupedByCurrencyId[currencyId]}
                    columns={ [NameCol, ValueCol, CostBasisCol, RoiCol, RoiPercCol]}
                />
            </DashboardGridWithSidebar>
        </Paper>
    );
};