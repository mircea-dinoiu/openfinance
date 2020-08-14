import {
    AppBar,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Tab,
    Tabs,
    Toolbar,
    Typography,
} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import IconExitToApp from '@material-ui/icons/ExitToApp';
import IconMenu from '@material-ui/icons/Menu';
import IconRefresh from '@material-ui/icons/Refresh';
import IconVisibility from '@material-ui/icons/Visibility';
import IconVisibilityOff from '@material-ui/icons/VisibilityOff';
import {CurrenciesDrawerContent} from 'components/currencies/CurrenciesDrawerContent';
import {MuiSelectNative} from 'components/dropdowns';
import {ShiftDateOption} from 'defs';
import {spacingNormal, spacingSmall, stickyHeaderHeight} from 'defs/styles';
import {paths} from 'js/defs';
import React, {useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useCurrencies} from 'state/currencies';
import {usePrivacyToggle} from 'state/privacyToggle';
import {useProjects, useSelectedProject} from 'state/projects';
import {shiftDateBack, shiftDateForward} from 'utils/dates';
import {makeUrl, mapUrlToFragment} from 'utils/url';
import {
    useBootstrap,
    useRefreshWidgetsDispatcher,
    useScreenSize,
} from '../../state/hooks';

const MAX_TIMES = 10;

export const getShiftBackOptions = (
    date: string,
    by: ShiftDateOption,
): Date[] =>
    new Array(MAX_TIMES)
        .fill(null)
        .map((each, index) => shiftDateBack(date, by, index + 1));

export const getShiftForwardOptions = (
    date: string,
    by: ShiftDateOption,
): Date[] =>
    new Array(MAX_TIMES)
        .fill(null)
        .map((each, index) => shiftDateForward(date, by, index + 1));

export const TopBar = (props: {onLogout: () => void}) => {
    const [privacyToggle, setPrivacyToggle] = usePrivacyToggle();
    const refreshWidgets = useRefreshWidgetsDispatcher();
    const user = useBootstrap();
    const currencies = useCurrencies();
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const isCurrenciesDrawerReady = () => user != null && currencies != null;
    const history = useHistory();
    const location = useLocation();
    const project = useSelectedProject();
    const tabs = [
        paths.transactions,
        paths.categories,
        paths.accounts,
        paths.accountTypes,
    ];
    const screenSize = useScreenSize();

    const onClickRefresh = () => {
        refreshWidgets();
    };

    const projects = useProjects();
    const selectedProject = useSelectedProject();
    const cls = useStyles();

    return (
        <>
            <AppBar position="sticky">
                <Toolbar className={cls.toolbar} disableGutters={true}>
                    <Typography variant="h6" color="inherit">
                        {projects.length ? (
                            <Paper className={cls.paper}>
                                <MuiSelectNative
                                    onChange={(o) => {
                                        const url = new URL(
                                            window.location.href,
                                        );

                                        url.searchParams.set(
                                            'projectId',
                                            o.value.toString(),
                                        );

                                        window.location.href = mapUrlToFragment(
                                            url,
                                        );
                                    }}
                                    options={projects.map((p) => ({
                                        label: p.name,
                                        value: p.id,
                                    }))}
                                    value={{
                                        value: selectedProject.id,
                                    }}
                                    valueType="number"
                                />
                            </Paper>
                        ) : (
                            document.title
                        )}
                    </Typography>
                    {screenSize.isLarge && (
                        <Paper className={cls.tabs}>
                            <Tabs
                                value={tabs.indexOf(location.pathname)}
                                onChange={(event, index) => {
                                    history.push(
                                        makeUrl(tabs[index], {
                                            projectId: project.id,
                                        }),
                                    );
                                }}
                            >
                                <Tab label="Transactions" />
                                <Tab label="Categories" />
                                <Tab label="Accounts" />
                                <Tab label="Account Types" />
                            </Tabs>
                        </Paper>
                    )}
                    <div
                        style={{
                            flex: 1,
                        }}
                    >
                        <div style={{float: 'right', display: 'flex'}}>
                            {user && (
                                <IconButton
                                    onClick={() => setDrawerIsOpen(true)}
                                >
                                    <IconMenu htmlColor="white" />
                                </IconButton>
                            )}
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={drawerIsOpen}
                onClose={() => setDrawerIsOpen(false)}
            >
                <List>
                    <ListItem
                        button
                        onClick={() => setPrivacyToggle(!privacyToggle)}
                    >
                        <ListItemIcon>
                            {privacyToggle ? (
                                <IconVisibilityOff />
                            ) : (
                                <IconVisibility />
                            )}
                        </ListItemIcon>
                        <ListItemText primary="Privacy Mode" />
                    </ListItem>
                    <ListItem button onClick={onClickRefresh}>
                        <ListItemIcon>
                            <IconRefresh />
                        </ListItemIcon>
                        <ListItemText primary="Reload" />
                    </ListItem>
                    <ListItem button onClick={props.onLogout}>
                        <ListItemIcon>
                            <IconExitToApp />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                    <Divider />
                    {isCurrenciesDrawerReady() && (
                        <ListItem disableGutters>
                            <CurrenciesDrawerContent />
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </>
    );
};

const useStyles = makeStyles({
    toolbar: {
        backgroundColor: grey[900],
        paddingRight: spacingNormal,
        paddingLeft: spacingNormal,
        minHeight: stickyHeaderHeight,
    },
    paper: {
        padding: `${spacingSmall} ${spacingNormal}`,
    },
    tabs: {
        backgroundColor: 'transparent',
        color: grey[100],
        left: '50%',
        position: 'absolute',
        transform: 'translateX(-50%)',
    },
});
