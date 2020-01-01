import {objectEntriesOfSameType} from 'utils/collection';
import extend from 'lodash/extend';

export function flattenObject(object: {}, prefix: string = '') {
    const propName = prefix ? `${prefix}.` : '';
    const ret = {};

    objectEntriesOfSameType(object).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            ret[key] = JSON.stringify(value);
        } else if ('object' === typeof value) {
            // @ts-ignore
            extend(ret, flattenObject(value, propName + key));
        } else {
            ret[propName + key] = value;
        }
    });

    return ret;
}