import {Tooltip as MaterialUITooltip} from '@material-ui/core';
import {spacingSmall} from 'defs/styles';
import * as React from 'react';
import {ReactNode} from 'react';

export const Tooltip = ({
    children,
    className,
    tooltip: title,
}: {
    children: React.ReactNode;
    className?: string;
    tooltip: ReactNode;
}) => (
    <MaterialUITooltip
        title={
            <div
                style={{
                    fontSize: '1rem',
                    lineHeight: 1,
                    padding: spacingSmall,
                }}
            >
                {title}
            </div>
        }
        disableFocusListener={true}
        placement="bottom"
    >
        <span className={className}>{children}</span>
    </MaterialUITooltip>
);
