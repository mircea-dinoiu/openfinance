import {useTemporarySnackbar} from 'app/snackbars';
import * as React from 'react';
import {useCallback} from 'react';

export const copyText = (value: string | number) => {
    const textarea = document.createElement('textarea');

    textarea.value = String(value);

    document.body.appendChild(textarea);

    textarea.select();

    const ok = document.execCommand('copy');

    document.body.removeChild(textarea);

    console.log('[copy]', value);

    return ok;
};

export const useCopyTextWithConfirmation = () => {
    const showSuccessSnackbar = useTemporarySnackbar('success');
    const showErrorSnackbar = useTemporarySnackbar('error');

    const callback = useCallback(
        (...args: Parameters<typeof copyText>) => {
            if (copyText(...args)) {
                showSuccessSnackbar(
                    <span>
                        Copied <strong>{args[0]}</strong> to clipboard
                    </span>,
                );
            } else {
                showErrorSnackbar('Unable to copy to clipboard');
            }
        },
        [showSuccessSnackbar, showErrorSnackbar],
    );

    return callback;
};
