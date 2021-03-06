import {Drawer, Theme, useMediaQuery} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import React, {ReactNode} from 'react';
import {stickyHeaderHeight} from 'app/styles/stickyHeaderHeight';

export const SmartDrawer = ({
    children,
    ...props
}: {
    onClose: undefined | (() => void);
    open: boolean;
    children: ReactNode;
}) => {
    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'), {noSsr: true});
    const cls = useSmartDrawerStyles();

    return (
        <Drawer classes={cls} anchor={isSmall ? 'bottom' : 'right'} {...props}>
            {children}
        </Drawer>
    );
};

const useSmartDrawerStyles = makeStyles((theme) => ({
    paper: {
        [theme.breakpoints.down('sm')]: {
            top: stickyHeaderHeight,
        },
    },
}));
