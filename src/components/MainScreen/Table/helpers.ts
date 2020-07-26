import {TransactionModel} from 'components/transactions/types';
import {formatYMD} from 'utils/dates';
import {Classes} from 'components/BaseTable';
import {TransactionStatus} from 'defs';

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

    if (formatYMD(item.created_at) === today) {
        classes.push(Classes.todayRow);
    }

    if (item.sum < 0) {
        classes.push(Classes.withdrawRow);
    }

    if (item.sum > 0) {
        classes.push(Classes.depositRow);
    }

    if (item.status !== TransactionStatus.finished) {
        classes.push(Classes.pendingRow);
    }

    if (item.hidden) {
        classes.push(Classes.hiddenRow);
    }

    if (selectedIds.includes(item.id)) {
        classes.push(Classes.selectedRow);
    }

    return classes.join(' ');
};

export const getTrProps = ({
    onReceiveSelectedIds,
    onEdit,
    selectedIds,
    onChangeContextMenu,
    item,
}: {
    item: TransactionModel;
    onChangeContextMenu: (props: {
        display: boolean;
        top?: number;
        left?: number;
    }) => void;
    onReceiveSelectedIds: (ids: number[]) => void;
    onEdit: () => void;
    selectedIds: number[];
}) => ({
    className: getTrClassName(item, {selectedIds}),
    onDoubleClick: () => {
        if (item.persist !== false) {
            onReceiveSelectedIds([item.id]);
            onEdit();
        } else {
            onReceiveSelectedIds([]);
        }
    },
    onClick(event: MouseEvent) {
        onChangeContextMenu({display: false});

        let nextSelected = selectedIds;

        if (event.metaKey || event.ctrlKey) {
            if (item.persist !== false) {
                if (selectedIds.includes(item.id)) {
                    nextSelected = nextSelected.filter((id) => id !== item.id);
                } else {
                    nextSelected = nextSelected.concat(item.id);
                }
            } else {
                return;
            }
        } else {
            nextSelected = item.persist !== false ? [item.id] : [];
        }

        onReceiveSelectedIds(nextSelected);
    },
    onContextMenu: (event: MouseEvent) => {
        event.preventDefault();

        if (item.persist !== false) {
            onChangeContextMenu({
                display: true,
                left: event.clientX,
                top: event.clientY,
            });

            if (!selectedIds.includes(item.id)) {
                onReceiveSelectedIds([item.id]);
            }
        }
    },
});
