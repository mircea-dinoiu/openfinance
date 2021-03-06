import {Chip, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Autocomplete} from '@material-ui/lab';
import {Api} from 'app/Api';
import {useCategories} from 'categories/state';
import {sortBy} from 'lodash';
import React from 'react';
import {useSelectedProject} from 'projects/state';
import {useReader} from 'app/fetch';
import {makeUrl} from 'app/url';

export const TransactionCategoriesField = ({
    values,
    onChange,
    description,
}: {
    values: number[];
    onChange: (v: number[]) => void;
    description: string;
}) => {
    const categories = useCategories();
    const options = sortBy(categories, 'name').map((each) => ({
        value: each.id,
        label: each.name,
    }));
    const project = useSelectedProject();
    const {response: suggestionsResponse} = useReader<{suggestions: number[]}>({
        url: makeUrl(Api.transactionsSuggestions.categories, {
            search: description,
            projectId: project.id,
        }),
        suspend: !description,
    });
    const suggestedIds = (suggestionsResponse?.data.suggestions ?? []).filter((id) => !values.includes(id));
    const cls = useStyles();

    return (
        <div>
            <Autocomplete<typeof options[0], true>
                renderInput={(params) => <TextField {...params} label="Categories" InputLabelProps={{shrink: true}} />}
                ChipProps={{
                    color: 'primary',
                }}
                multiple={true}
                getOptionLabel={(option) => option.label}
                options={options}
                value={options.filter((o) => values.includes(o.value))}
                onChange={(e, selectedOptions) => onChange(selectedOptions ? selectedOptions.map((o) => o.value) : [])}
            />
            {suggestedIds.length > 0 && (
                <div className={cls.suggestions}>
                    <em>Suggestions:</em>
                    {suggestedIds.map((sId) => (
                        <Chip
                            key={sId}
                            color="secondary"
                            variant="outlined"
                            className={cls.chip}
                            label={categories.find((c) => c.id === sId)?.name}
                            onClick={() => onChange(values.concat(sId))}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    suggestions: {
        marginTop: theme.spacing(2),
    },
    chip: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
}));
