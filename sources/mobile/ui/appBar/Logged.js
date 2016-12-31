import React from 'react';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {IconMenu, IconButton, MenuItem} from 'material-ui';

const Logged = (rawProps) => {
    const {onLogout, ...props} = rawProps;

    return (
        <IconMenu
            {...props}
            iconButtonElement={
              <IconButton><MoreVertIcon color="white"/></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
            <MenuItem primaryText="Logout" onClick={onLogout}/>
        </IconMenu>
    );
};

export default Logged;