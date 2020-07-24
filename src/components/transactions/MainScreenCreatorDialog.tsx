import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {ButtonProgress} from 'components/loaders';

import {ErrorSnackbar, SuccessSnackbar} from 'components/snackbars';
import {dialog} from 'defs/styles';
import {parseCRUDError} from 'parsers';
import * as React from 'react';
import {useMoneyLocations, useBootstrap} from 'state/hooks';
import {
    Accounts,
    TransactionForm,
    TransactionFormDefaults,
    TransactionModel,
    Bootstrap,
} from 'types';

type TypeProps = {
    getFormDefaults: (props: {
        user: Bootstrap;
        mls: Accounts;
    }) => TransactionFormDefaults;
    formToModel: Function;
    entityName: string;
    onReceiveNewRecord: (r: TransactionModel) => void;
    formComponent: React.ComponentType<{
        initialValues: TransactionFormDefaults;
        onFormChange: (form: TransactionForm) => void;
    }>;
    onRequestCreate: Function;
    onCancel: () => void;
    classes: {};
    open: boolean;
};

const MainScreenCreatorDialogWrapped = (props: TypeProps) => {
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<React.ReactNode>(null);
    const [success, setSuccess] = React.useState<React.ReactNode>(null);
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
        setSuccess(null);
        setSaving(true);

        try {
            const response = await props.onRequestCreate([
                props.formToModel(data, {
                    user,
                }),
            ]);
            const json = response.data;

            setSuccess(`The ${props.entityName} was successfully created`);
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
        <Dialog open={props.open} classes={props.classes}>
            <DialogTitle>{`Create ${props.entityName}`}</DialogTitle>
            <DialogContent style={{overflow: 'visible'}}>
                <Form
                    onFormChange={(nextFormData) => setFormData(nextFormData)}
                    initialValues={formDefaults}
                />
                {error && <ErrorSnackbar message={error} />}
                {success && <SuccessSnackbar message={success} />}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    disabled={saving}
                    onClick={props.onCancel}
                    style={{marginRight: 5}}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    disabled={saving}
                    color="primary"
                    onClick={save}
                    style={{float: 'right'}}
                >
                    {saving ? <ButtonProgress /> : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const MainScreenCreatorDialog = withStyles(dialog)(
    MainScreenCreatorDialogWrapped,
);
