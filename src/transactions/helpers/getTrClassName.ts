import {Classes} from 'app/BaseTable';
import {TransactionModel} from 'transactions/defs';
import {formatYMD} from '../../app/dates/formatYMD';

const today = formatYMD(new Date());

export const getTrClassName = (
    item: TransactionModel,
    {
        selectedIds,
    }: {
        selectedIds: number[];
    },
): string => {
    const classes = [Classes.notSelectable];
    const formattedDate = formatYMD(item.created_at);

    if (formattedDate < today) {
        classes.push(Classes.pastRow);
    }

    if (item.hidden) {
        classes.push(Classes.hiddenRow);
    }

    if (selectedIds.includes(item.id)) {
        classes.push(Classes.selectedRow);
    }

    return classes.join(' ');
};
