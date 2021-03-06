import {createAction, createReducer} from '@reduxjs/toolkit';
import {createXHR} from 'app/fetch';
import {GlobalState, LazyLoadedState, LazyLoadedStateWithFetch} from 'app/state/defs';
import {makeUrl} from 'app/url';
import {useSelectedProject} from 'projects/state';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

export const makeCrudReducer = <T>({
    initialState,
    name,
    route,
    parse,
}: {
    initialState: T;
    name: string;
    route: string;
    parse?: (a: T) => T;
}) => {
    const Action = {
        set: `${name}/set`,
    };

    const reducer = createReducer<LazyLoadedState<T>>(
        {
            data: initialState,
            isLoaded: false,
            projectId: NaN,
            isLoading: false,
        },
        {
            [Action.set]: (
                state,
                {
                    payload,
                }: {
                    payload: LazyLoadedState<T>;
                },
            ) => payload,
        },
    );
    const actionSet = createAction<LazyLoadedState<T>>(Action.set);
    const useIt = (): LazyLoadedStateWithFetch<T> => {
        const {data, isLoaded, isLoading, projectId: projectIdLoaded} = useSelector((s: GlobalState) => s[name]);
        const dispatch = useDispatch();
        const project = useSelectedProject();
        const projectId = project.id;
        const fetch = async () => {
            dispatch(
                actionSet({
                    data,
                    isLoaded,
                    projectId,
                    isLoading: true,
                }),
            );

            const r = await createXHR<T>({
                url: makeUrl(route, {projectId: project.id}),
            });

            dispatch(
                actionSet({
                    data: parse ? parse(r.data) : r.data,
                    isLoaded: true,
                    projectId,
                    isLoading: false,
                }),
            );
        };

        useEffect(() => {
            if (!isLoaded || projectId !== projectIdLoaded) {
                if (!isLoading) {
                    fetch();
                }
            }
        }, [projectId, projectIdLoaded, isLoading, isLoaded]);

        return {
            fetch,
            data,
            isLoaded,
            isLoading,
            projectId,
        };
    };

    return {
        hook: useIt,
        reducer,
    };
};
