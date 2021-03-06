export enum StockType {
    CUSTOM = 'custom',
    MUTUAL_FUND = 'mf',
    ETF = 'etf',
    STOCK = 'stock',
    CRYPTO = 'crypto',
}

export enum StockPricingMethod {
    INFER = 'infer',
    MANUAL = 'manual',
    EXCHANGE = 'exchange',
}

export type TStock = {
    id: number;
    price: number;
    symbol: string;
    currency_id: number;
    type: StockType;
    pricing_method: StockPricingMethod;
};

export type TStockPrice = {
    stock_id: number;
    dated: string;
    price: number;
};
