import {Box, CardHeader, Checkbox, useTheme} from '@material-ui/core';
import {makeStyles, styled, Theme} from '@material-ui/core/styles';
import {NumericValue} from 'app/formatters';
import {useCardHeaderStyles} from 'transactions/styles';
import {SummaryTotal} from 'transactions/SummaryTotal';
import {SummaryModel} from 'transactions/defs';
import {TCurrencyMap} from 'currencies/defs';
import {sortBy} from 'lodash';
import React, {ReactNode} from 'react';
import {colors} from 'app/styles/colors';

export const SummarySubCategory = <Ent,>(props: {
    excluded: {};
    currencies: TCurrencyMap;
    onToggleExcluded: (ids: string[]) => void;
    entities: Ent[];
    entityIdField: keyof Ent;
    entityNameField: keyof Ent;
    id: string;
    items: SummaryModel[];
    renderDescription?: (sm: SummaryModel) => ReactNode;
    shouldGroup: boolean;
}) => {
    const cardHeaderClasses = useCardHeaderStyles();
    const {shouldGroup, entities, id, entityIdField, entityNameField, items: itemsFromProps, renderDescription} = props;

    const items = sortBy(itemsFromProps, (item) => item.description);
    const cls = useStyles();
    const theme = useTheme();

    return (
        <Box paddingX={1} marginBottom={2}>
            {shouldGroup && (
                <CardHeader
                    classes={cardHeaderClasses}
                    style={{
                        padding: 0,
                        marginTop: Number(id) === 0 ? 5 : 0,
                        cursor: 'pointer',
                        color: theme.palette.text.primary,
                    }}
                    title={
                        Number(id) === 0 ? (
                            <em>Unclassified</em>
                        ) : (
                            entities.find((each) => (each[entityIdField] as any) == id)?.[entityNameField]
                        )
                    }
                />
            )}
            <ul className={cls.list}>
                {items.map((each) => (
                    <ListItem key={each.reference}>
                        <div>{renderDescription ? renderDescription(each) : each.description}</div>
                        <div>
                            <NumericValue value={each.cashValue} currency={Number(each.currencyId)} />
                        </div>
                        <Checkbox
                            className={cls.checkbox}
                            checked={!props.excluded[each.reference]}
                            onChange={() => props.onToggleExcluded([each.reference])}
                            color="default"
                        />
                    </ListItem>
                ))}
                <ListItem isTotal={true}>
                    <div>TOTAL</div>
                    <div style={{textAlign: 'right'}}>
                        <SummaryTotal summaryItems={items} excludedRecord={props.excluded} />
                    </div>
                    <div>
                        <Checkbox
                            className={cls.checkbox}
                            checked={items.every((item) => !props.excluded[item.reference])}
                            onChange={() => props.onToggleExcluded(items.map((item) => item.reference))}
                            color="default"
                        />
                    </div>
                </ListItem>
            </ul>
        </Box>
    );
};

const ListItem = styled('li')((props: {isTotal?: boolean; theme: Theme}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gridGap: props.theme.spacing(1),
    borderBottom: `1px solid ${colors.borderSecondary}`,
    padding: props.theme.spacing(1, 0),
    alignItems: 'center',
    '&:hover': {
        backgroundColor: colors.hover,
    },
    ...(props.isTotal ? {backgroundColor: colors.tableFoot, fontWeight: 500} : {}),
}));

const useStyles = makeStyles((theme) => ({
    checkbox: {
        padding: 0,
    },
    list: {
        padding: 0,
        margin: 0,
    },
}));
