import {BalanceByLocationStock} from 'components/transactions/types';
import {useStockPrices} from 'state/stocks';

export const useStockValue = (stocks: Omit<BalanceByLocationStock, 'money_location_id'>[]) => {
    const stockPrices = useStockPrices();

    return stocks.reduce((acc, stock) => acc + stock.stock_units * (stockPrices.get(stock.stock_id) ?? 0), 0);
};
