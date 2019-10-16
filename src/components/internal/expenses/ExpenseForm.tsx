import {findCurrencyById} from 'helpers/currency';
import {objectValuesOfSameType} from 'utils/collection';

import React, {PureComponent} from 'react';
import {
    Avatar,
    Badge,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
    Radio,
    RadioGroup,
    Slider,
    TextField,
    withStyles,
} from '@material-ui/core';
import RepeatOptions from 'defs/repeatOptions';
import {createXHR} from 'utils/fetch';
import routes from 'defs/routes';
import {useSelector} from 'react-redux';
import {MultiSelect, SingleSelect} from 'components/Select';
import {gridGap, screenQuerySmall} from 'defs/styles';
import {DateTimePicker} from '@material-ui/pickers';
import {CancelToken} from 'axios';
import {sumArray} from 'js/utils/numbers';
import {sortBy} from 'lodash';
import styled from 'styled-components';
import {
    TypeCategories,
    TypeCurrencies,
    TypeMoneyLocations,
    TypePreferences,
    TypeTransactionForm,
    TypeUsers,
} from 'types';
import {makeUrl} from 'utils/url';
import {PERC_MAX, PERC_STEP} from 'js/defs';

const boxStyle = {
    padding: '10px 0',
};
const badgeStyle = {
    root: {
        lineHeight: '16px',
    },
    badge: {
        top: 0,
        right: 0,
        position: 'relative',
        margin: '0 5px',
        height: 16,
        lineHeight: '16px',
        width: 'auto',
        padding: '0 5px',
        borderRadius: 3,
    },
};
// @ts-ignore
const StyledBadge = withStyles(badgeStyle)(Badge);

type TypeProps = {
    initialValues: TypeTransactionForm;
    onFormChange: Function;
    moneyLocations: TypeMoneyLocations;
    currencies: TypeCurrencies;
    preferences: TypePreferences;
    user: TypeUsers;
    categories: TypeCategories;
};

export const setChargedPersonValueFactory = (
    id,
    value,
    {userIdsStringified, adjust = true},
) => (prevState) => {
    const step = PERC_STEP;
    const nextChargedPersons = {
        ...userIdsStringified.reduce((acc, idString) => {
            acc[idString] = 0;

            return acc;
        }, {}),
        ...prevState.chargedPersons,
        [id]: value,
    };

    if (adjust) {
        let diffToMax;

        while (
            (diffToMax =
                PERC_MAX - sumArray(objectValuesOfSameType(nextChargedPersons)))
        ) {
            for (const key in nextChargedPersons) {
                if (key !== id) {
                    nextChargedPersons[key] += diffToMax > 0 ? step : -step;
                    break;
                }
            }
        }
    }

    return {
        chargedPersons: nextChargedPersons,
    };
};

const FormControlLabelInline = styled(FormControlLabel)`
    display: inline-block;
`;

class ExpenseForm extends PureComponent<TypeProps, TypeTransactionForm> {
    // @ts-ignore
    descriptionSuggestionsCancelSource = CancelToken.source();
    categoriesCancelSource;

    state = {
        descriptionSuggestions: [],
        descriptionNewOptionText: this.props.initialValues.description || '',
        ...this.props.initialValues,
    };

    setState(state) {
        this.props.onFormChange({...this.state, ...state});

        return super.setState(state);
    }

    // eslint-disable-next-line no-unused-vars
    bindSelect({valueKey, onChange = (string) => {}}) {
        return {
            onChange: (value) => {
                this.setState({
                    [valueKey]: value,
                });

                onChange(value);
            },
            value: this.state[valueKey],
        };
    }

    get descriptionNewOptions() {
        const text = this.state.descriptionNewOptionText;
        const arr = [];

        if (text) {
            arr.push({
                value: text,
                label: text,
            });
        }

        const initialDescription = this.props.initialValues.description;

        if (initialDescription && initialDescription !== text) {
            arr.push({
                value: initialDescription,
                label: initialDescription,
            });
        }

        return arr;
    }

    renderSum() {
        return (
            <SumContainer>
                <div>
                    <TextField
                        label="Currency"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={
                            this.state.paymentMethod
                                ? findCurrencyById(
                                      this.props.moneyLocations.find(
                                          (each) =>
                                              each.id ==
                                              this.state.paymentMethod,
                                          // @ts-ignore
                                      ).currency_id,
                                      this.props.currencies,
                                  ).iso_code
                                : null
                        }
                        fullWidth={true}
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        disabled={true}
                    />
                </div>
                <div>
                    <TextField
                        label="Sum"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.sum}
                        fullWidth={true}
                        type="number"
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        onChange={(event) =>
                            this.setState({sum: event.target.value})
                        }
                    />
                </div>
                <div>
                    <TextField
                        label="Weight (grams)"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.weight}
                        fullWidth={true}
                        type="number"
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        onChange={(event) =>
                            this.setState({weight: event.target.value})
                        }
                    />
                </div>
            </SumContainer>
        );
    }

    renderDescription() {
        const valueKey = 'description';

        return (
            <SingleSelect
                label="Name"
                {...this.bindSelect({
                    valueKey,
                    onChange: this.handleDescriptionChange,
                })}
                onInputChange={this.handleDescriptionInputChange}
                options={this.descriptionNewOptions.concat(
                    this.state.descriptionSuggestions.map(
                        (each: {usages: number; item: string}) => ({
                            value: each.item,
                            label: (
                                <StyledBadge
                                    color="primary"
                                    badgeContent={each.usages}
                                >
                                    {each.item}
                                </StyledBadge>
                            ),
                        }),
                    ),
                )}
                inputValue={this.state.descriptionNewOptionText}
            />
        );
    }

    handleNotesChange = (event) => {
        this.setState({notes: event.target.value});
    };

    renderDetails() {
        return (
            <TextField
                value={this.state.notes}
                label="Details"
                multiline
                margin="none"
                fullWidth={true}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleNotesChange}
            />
        );
    }

    fetchDescriptionSuggestions = async (search) => {
        if (!search) {
            return;
        }

        if (this.descriptionSuggestionsCancelSource) {
            this.descriptionSuggestionsCancelSource.cancel();
        }

        // @ts-ignore
        this.descriptionSuggestionsCancelSource = CancelToken.source();

        const response = await createXHR({
            url: makeUrl(routes.suggestion.expense.descriptions, {
                search,
                end_date: this.props.preferences.endDate,
            }),
            cancelToken: this.descriptionSuggestionsCancelSource.token,
        });
        const descriptionSuggestions = response.data;

        this.setState({
            descriptionSuggestions,
        });
    };

    handleDescriptionInputChange = (value, {action}) => {
        if (action === 'input-change') {
            this.setState({
                descriptionNewOptionText: value,
            });

            this.fetchDescriptionSuggestions(value);
        }
    };

    handleDescriptionChange = async (search) => {
        if (search) {
            if (this.categoriesCancelSource) {
                this.categoriesCancelSource.cancel();
            }

            // @ts-ignore
            this.categoriesCancelSource = CancelToken.source();

            const response = await createXHR({
                url: makeUrl(routes.suggestion.expense.categories, {
                    search,
                }),
                cancelToken: this.categoriesCancelSource.token,
            });
            const categories = response.data;

            this.setState((prevState) => ({
                categories: prevState.categories
                    ? prevState.categories
                    : categories,
            }));
        }
    };

    renderDateTime() {
        return (
            <DateTimePicker
                label="Date & Time"
                value={this.state.date}
                onChange={(value) => this.setState({date: value})}
                showTodayButton
                style={{width: '100%'}}
                ampm={false}
            />
        );
    }

    renderAccount() {
        return (
            <SingleSelect
                label="Account"
                {...this.bindSelect({
                    valueKey: 'paymentMethod',
                })}
                options={sortBy(this.props.moneyLocations, 'name').map(
                    (map) => ({
                        value: map.id,
                        label: map.name,
                    }),
                )}
            />
        );
    }

    renderChargedPersons() {
        const sortedUsers = sortBy(
            this.props.user.list,
            (each) => each.full_name,
        );
        const {chargedPersons} = this.state;
        const step = PERC_STEP;
        const userIdsStringified = sortedUsers.map((user) => String(user.id));

        return (
            <List
                subheader={
                    <ListSubheader disableGutters={true}>
                        Distribution per Person
                    </ListSubheader>
                }
                disablePadding={true}
                dense={true}
            >
                {sortedUsers.map((user) => {
                    const id = String(user.id);

                    return (
                        <ListItem key={id} disableGutters={true}>
                            <ListItemAvatar>
                                <Avatar
                                    style={{margin: 0}}
                                    alt={user.full_name}
                                    src={user.avatar}
                                />
                            </ListItemAvatar>

                            <Slider
                                value={chargedPersons[id] || 0}
                                valueLabelFormat={(value) => `${value}%`}
                                step={step}
                                marks={true}
                                onChange={(event, value) =>
                                    this.setState(
                                        setChargedPersonValueFactory(
                                            id,
                                            value,
                                            {
                                                userIdsStringified,
                                            },
                                        ),
                                    )
                                }
                                valueLabelDisplay="on"
                            />

                            <ListItemText
                                style={{
                                    textAlign: 'right',
                                }}
                            >
                                {user.full_name}
                            </ListItemText>
                        </ListItem>
                    );
                })}
            </List>
        );
    }

    renderCategories() {
        return (
            <MultiSelect
                label="Categories"
                {...this.bindSelect({
                    valueKey: 'categories',
                })}
                filterOption={(option, search) =>
                    option.data.filterText
                        .toLowerCase()
                        .includes(search.toLowerCase())
                }
                options={sortBy(this.props.categories, 'name').map((each) => ({
                    value: each.id,
                    label: (
                        <StyledBadge
                            color="primary"
                            badgeContent={each.expenses}
                        >
                            {each.name}
                        </StyledBadge>
                    ),
                    filterText: each.name,
                }))}
            />
        );
    }

    renderRepeat() {
        return (
            <RepeatContainer>
                <div>
                    <SingleSelect
                        label="Repeat"
                        {...this.bindSelect({
                            valueKey: 'repeat',
                        })}
                        options={RepeatOptions.map((arr) => ({
                            value: arr[0],
                            label: arr[1],
                        }))}
                    />
                </div>
                <div>
                    <TextField
                        label="Occurrences"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.repeatOccurrences}
                        fullWidth={true}
                        type="number"
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        onChange={(event) =>
                            this.setState({
                                repeatOccurrences: event.target.value,
                            })
                        }
                        disabled={this.state.repeat == null}
                    />
                </div>
            </RepeatContainer>
        );
    }

    render() {
        return (
            <div>
                <div style={boxStyle}>{this.renderDescription()}</div>
                <div style={boxStyle}>{this.renderDetails()}</div>
                <div style={boxStyle}>{this.renderSum()}</div>
                <div style={boxStyle}>{this.renderAccount()}</div>
                <div style={boxStyle}>{this.renderDateTime()}</div>
                <div style={boxStyle}>{this.renderCategories()}</div>
                <div style={boxStyle}>{this.renderChargedPersons()}</div>
                <div style={boxStyle}>{this.renderRepeat()}</div>
                <StatusFlagsContainer>
                    <div>{this.renderStatus()}</div>
                    <div>{this.renderFlags()}</div>
                </StatusFlagsContainer>
            </div>
        );
    }

    renderFlags() {
        return (
            <>
                <FormLabel>Flags</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.hidden}
                                onChange={(event) =>
                                    this.setState({
                                        hidden: event.target.checked,
                                    })
                                }
                                color="primary"
                                value="hidden"
                            />
                        }
                        label="Archived"
                    />
                </FormGroup>
            </>
        );
    }

    renderStatus() {
        return (
            <>
                <FormLabel>Status</FormLabel>
                <RadioGroup
                    value={this.state.status}
                    onChange={this.handleChangeStatus}
                    row
                >
                    <FormControlLabelInline
                        value="pending"
                        control={<Radio color="primary" />}
                        label="Pending"
                    />
                    <FormControlLabelInline
                        value="finished"
                        control={<Radio color="primary" />}
                        label="Posted"
                    />
                </RadioGroup>
            </>
        );
    }

    handleChangeStatus = (event) => {
        this.setState({status: event.target.value});
    };
}

export default (ownProps) => {
    const stateProps = useSelector(
        ({currencies, preferences, categories, moneyLocations, user}) => ({
            currencies,
            categories,
            preferences,
            moneyLocations,
            user,
        }),
    );

    return <ExpenseForm {...ownProps} {...stateProps} />;
};

const StatusFlagsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 11fr;

    @media ${screenQuerySmall} {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }
`;

const SumContainer = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: 1fr 1fr 1fr;
`;

const RepeatContainer = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: 1fr 1fr;
`;