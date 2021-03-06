import IconBlock from '@material-ui/icons/Block';
import IconLock from '@material-ui/icons/Lock';
import {TAccount, AccountStatus} from 'accounts/defs';
import * as React from 'react';

export const AccountDisplay = (moneyLocation: TAccount) => {
    const IconComponent = StatusToIconComponent[moneyLocation.status];

    return (
        <span title={moneyLocation.name}>
            <IconComponent
                style={{
                    fontSize: '1rem',
                    position: 'relative',
                    top: 2,
                    left: -1,
                }}
            />
            {moneyLocation.name}
        </span>
    );
};

const StatusToIconComponent: Record<AccountStatus, any> = {
    closed: IconBlock,
    locked: IconLock,
    open: 'i',
};
