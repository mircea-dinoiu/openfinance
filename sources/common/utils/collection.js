// @flow weak

export const objectEntriesOfSameType = <A, B>(obj: {
    [key: A]: B,
    ...
}): Array<[A, B]> => ((Object.entries(obj): any): Array<[A, B]>);

export const objectValuesOfSameType = <A: string, B>(obj: {
    [key: A]: B,
    ...
}): Array<B> => ((Object.values(obj): any): Array<B>);
