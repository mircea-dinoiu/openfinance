import {isEqual} from 'lodash';
import * as React from 'react';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

import {Row, Col} from 'react-grid-system';

import {ErrorSnackbar, SuccessSnackbar} from 'common/components/snackbars';
import {ButtonProgress} from 'common/components/loaders';

import {parseCRUDError} from 'common/parsers';
import {dialog} from 'common/defs/styles';
import {
    TypeTransactionModel,
    TypeTransactionForm,
    TypeUsers,
} from 'common/types';

type TypeProps = {
    user: TypeUsers;
    onRequestUpdate: (
        data: TypeTransactionModel[],
    ) => Promise<{
        data: TypeTransactionModel[];
    }>;
    items: TypeTransactionModel[];
    modelToForm: (TypeTransactionModel) => TypeTransactionForm;
    formToModel: (
        TypeTransactionForm,
        {user: TypeUsers},
    ) => TypeTransactionModel;
    entityName: string;
    formComponent: React.ComponentType<{
        initialValues: TypeTransactionForm;
        onFormChange: (TypeTransactionForm) => void;
    }>;
    open: boolean;
    classes: {};
    onCancel: () => void;
    onSave: ({}) => void;
};

class MainScreenEditDialog extends React.PureComponent<
    TypeProps,
    {
        saving: boolean;
        success: React.ReactNode;
        error: React.ReactNode;
    }
> {
    state = {
        saving: false,
        success: null,
        error: null,
    };
    formData = this.props.items.map(this.props.modelToForm);
    initialData = this.props.items.map(this.props.modelToForm);

    getUpdates() {
        const updates = {};

        for (const key in this.initialData[0]) {
            if (!isEqual(this.initialData[0][key], this.formData[0][key])) {
                updates[key] = this.formData[0][key];
            }
        }

        return updates;
    }

    save = async () => {
        const data = this.formData;

        this.setState({
            error: null,
            success: null,
            saving: true,
        });

        try {
            const updates = this.getUpdates();

            console.info('[UPDATES]', updates);

            const response = await this.props.onRequestUpdate(
                data.map((each) =>
                    this.props.formToModel(
                        {...each, ...updates},
                        {
                            user: this.props.user,
                        },
                    ),
                ),
            );
            const json = response.data;

            this.setState({
                success: `The ${this.props.entityName} was successfully updated`,
                saving: false,
            });

            setTimeout(() => {
                this.setState({
                    error: null,
                    success: null,
                });
                this.props.onSave(json[0]);
            }, 500);
        } catch (e) {
            if (e.response) {
                this.setState({
                    error: parseCRUDError(e.response.data),
                    saving: false,
                });
            } else {
                this.setState({
                    error: e.message,
                    saving: false,
                });
            }
        }
    };

    render() {
        const Form = this.props.formComponent;

        return (
            <Dialog
                open={this.props.open}
                classes={this.props.classes}
                fullWidth={true}
            >
                <DialogTitle>{`Edit ${this.props.entityName}${
                    this.props.items.length === 1 ? '' : 's'
                }`}</DialogTitle>
                <DialogContent style={{overflow: 'visible'}}>
                    <Row>
                        <Form
                            onFormChange={(formData) =>
                                (this.formData[0] = formData)
                            }
                            initialValues={this.formData[0]}
                        />
                    </Row>
                    <Col>
                        {this.state.error && (
                            <ErrorSnackbar message={this.state.error} />
                        )}
                        {this.state.success && (
                            <SuccessSnackbar message={this.state.success} />
                        )}
                    </Col>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        disabled={this.state.saving}
                        onClick={this.props.onCancel}
                        style={{marginRight: 5}}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={this.state.saving}
                        color="primary"
                        onClick={this.save}
                        style={{float: 'right'}}
                    >
                        {this.state.saving ? (
                            <ButtonProgress />
                        ) : this.props.items.length === 1 ? (
                            'Update'
                        ) : (
                            'Update Multiple'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(dialog)(MainScreenEditDialog);