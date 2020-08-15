import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {SmartDrawer} from 'components/drawers';
import {ButtonProgress} from 'components/loaders';

import {ErrorSnackbar} from 'components/snackbars';
import {TransactionForm, TransactionModel} from 'components/transactions/types';
import {dialog} from 'defs/styles';
import {parseCRUDError} from 'parsers';
import * as React from 'react';
import {useBootstrap, useMoneyLocations} from 'state/hooks';
import {Accounts, Bootstrap} from 'types';

type TypeProps = {
    getFormDefaults: (props: {
        user: Bootstrap;
        mls: Accounts;
    }) => TransactionForm;
    formToModel: Function;
    entityName: string;
    onReceiveNewRecord: (r: TransactionModel) => void;
    formComponent: React.ComponentType<{
        initialValues: TransactionForm;
        onFormChange: (form: TransactionForm) => void;
        onSubmit: () => void;
    }>;
    onRequestCreate: Function;
    onCancel: () => void;
    classes: {};
    open: boolean;
};

const MainScreenCreatorDialogWrapped = (props: TypeProps) => {
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<React.ReactNode>(null);
    const user = useBootstrap();
    const mls = useMoneyLocations();
    const formDefaults = React.useMemo(
        () =>
            props.getFormDefaults({
                user,
                mls,
            }),
        [props, user, mls],
    );
    const [formData, setFormData] = React.useState(
        props.getFormDefaults({
            user,
            mls,
        }),
    );

    const save = async () => {
        const data = formData;

        setError(null);
        setSaving(true);

        try {
            const response = await props.onRequestCreate([
                props.formToModel(data, {
                    user,
                }),
            ]);
            const json = response.data;

            setSaving(false);

            props.onReceiveNewRecord(json[0]);
        } catch (e) {
            if (e.response) {
                setError(parseCRUDError(e.response.data));
                setSaving(false);
            } else {
                setError(e.message);
                setSaving(false);
            }
        }
    };

    const Form = props.formComponent;

    return (
        <SmartDrawer
            open={props.open}
            onClose={saving ? undefined : props.onCancel}
        >
            <DialogTitle>{`Create ${props.entityName}`}</DialogTitle>

            <DialogContent dividers={true}>
                <Form
                    onFormChange={(nextFormData) => setFormData(nextFormData)}
                    initialValues={formDefaults}
                    onSubmit={save}
                />
                {error && <ErrorSnackbar message={error} />}
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    disabled={saving}
                    onClick={props.onCancel}
                    fullWidth={true}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    disabled={saving}
                    color="primary"
                    onClick={save}
                    fullWidth={true}
                >
                    {saving ? <ButtonProgress /> : 'Create'}
                </Button>
            </DialogActions>
        </SmartDrawer>
    );
};

export const MainScreenCreatorDialog = withStyles(dialog)(
    MainScreenCreatorDialogWrapped,
);
