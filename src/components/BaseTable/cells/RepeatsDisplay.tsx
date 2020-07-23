import * as React from 'react';
import {grey} from '@material-ui/core/colors';
import {RepeatOptions} from 'defs/repeatOptions';
import {useScreenSize} from 'state/hooks';
import {TransactionModel} from 'types';

export const RepeatsDisplay = ({item}: {item: TransactionModel}) => {
    const screenSize = useScreenSize();
    const repeatsText = item.repeat
        ? RepeatOptions.filter((each) => each[0] === item.repeat)[0][1]
        : '';
    const repeatsDisplay = (
        <span style={{fontSize: '1rem', color: grey[500]}}>
            {screenSize.isLarge
                ? repeatsText
                : repeatsText
                ? `Repeats ${repeatsText}`
                : 'Does not repeat'}
            {item.repeat_occurrences && (
                <>
                    <br />({item.repeat_occurrences} occurrences)
                </>
            )}
        </span>
    );

    return repeatsDisplay;
};
