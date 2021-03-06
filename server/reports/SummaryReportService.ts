// @ts-nocheck
import {SummaryReportHelper} from './SummaryReportHelper';
import {extractIdsFromModel, extractUsersFromModel} from '../helpers';
import {sortBy} from 'lodash';

export const SummaryReportService = {
    getBalances({expenses, userIdToFullName, currencyIdToISOCode}) {
        const data = {byUser: []};
        const totalRemainingByUser = {};
        const totalRemainingByML = {};
        const users = SummaryReportHelper.getUniques(expenses.byUser);
        const mls = SummaryReportHelper.getUniques(expenses.byML);

        /**
         * Remaining present
         */
        mls.forEach((id) => {
            totalRemainingByML[id] = SummaryReportHelper.getRemainingSum(expenses.byML, id);
        });

        users.forEach((id) => {
            totalRemainingByUser[id] = SummaryReportHelper.getRemainingSum(expenses.byUser, id);
        });

        /**
         * Total remaining
         */
        Object.keys(totalRemainingByUser).forEach((reference) => {
            const sum = totalRemainingByUser[reference];
            const [id, currencyId] = reference.split(':').map(Number);

            if (sum !== 0) {
                data.byUser.push({
                    cashValue: sum,
                    reference,
                    description: `${userIdToFullName[id]} (${currencyIdToISOCode[currencyId]})`,
                    currencyId,
                });
            }
        });

        return {
            byUser: sortBy(data.byUser, 'description'),
        };
    },

    getTransactions({expenseRecords, userRecords, mlRecords, currencyIdToISOCode, mlIdToCurrencyId, html}) {
        const users = {};
        const mls = {};

        for (const record of expenseRecords) {
            const sum = record.sum;
            const recordUsers = extractUsersFromModel(record);
            const mlId = record.money_location_id;
            const currencyId = mlIdToCurrencyId[mlId];

            mls[mlId] = SummaryReportHelper.safeNum((mls[mlId] || 0) + sum);

            Object.entries(recordUsers).forEach(([userId, perc]) => {
                users[userId] = users[userId] || {};
                users[userId][currencyId] = SummaryReportHelper.safeNum(
                    (users[userId][currencyId] || 0) + (sum * perc) / 100,
                );
            });
        }

        const data = {
            byUser: [],
            byML: [],
        };

        userRecords.forEach((user) => {
            const id = user.id;

            if (users[id]) {
                Object.entries(users[id]).forEach(([currencyId, sum]) => {
                    data.byUser.push({
                        cashValue: sum,
                        description: `${user.full_name} (${currencyIdToISOCode[currencyId]})`,
                        reference: `${id}:${currencyId}`,
                        currencyId,
                    });
                });
            }
        });

        SummaryReportHelper.addMLEntries({
            html,
            data: data.byML,
            mls,
            mlRecords,
        });

        return data;
    },

    getExpensesByCategory({expenseRecords, categoryRecords, mlIdToCurrencyId, currencyIdToISOCode, userIdToFullName}) {
        const categories = {};
        const data = [];
        const categoryIdToRecord = categoryRecords.reduce((acc, each) => {
            acc[each.id] = each;

            return acc;
        }, {});

        for (const record of expenseRecords) {
            const users = extractUsersFromModel(record);
            const recordCategories = extractIdsFromModel(record, 'categoryIds');
            const sum = record.sum;
            const currencyId = mlIdToCurrencyId[record.money_location_id];
            const addData = function(categoryId, rawCatSum) {
                if (!categories[categoryId]) {
                    categories[categoryId] = {
                        users: {},
                    };
                }

                Object.entries(users).forEach(([id, perc]) => {
                    categories[categoryId].users[id] = categories[categoryId].users[id] || {};
                    categories[categoryId].users[id][currencyId] = categories[categoryId].users[id][currencyId] || 0;
                    categories[categoryId].users[id][currencyId] += (rawCatSum * perc) / 100;
                });
            };

            if (recordCategories.length > 0) {
                recordCategories.forEach((rawCategoryId) => {
                    let categoryId;

                    if (categoryIdToRecord[rawCategoryId]) {
                        categoryId = rawCategoryId;
                    } else {
                        categoryId = 0;
                    }

                    addData(categoryId, sum);
                });
            } else {
                addData(0, sum);
            }
        }

        const categoryIds = Object.keys(categories).map((id) => parseInt(id));

        categoryIds.sort((id1, id2) => {
            if (id1 == 0) {
                return -1;
            }

            if (id2 == 0) {
                return 1;
            }

            return categoryIdToRecord[id1].name > categoryIdToRecord[id2].name ? 1 : -1;
        });

        categoryIds.forEach((categoryId, index) => {
            Object.entries(categories[categoryId].users).forEach(([userId, currencies]) => {
                Object.entries(currencies).forEach(([currencyId, sum]) => {
                    data.push({
                        cashValue: sum,
                        description: `${userIdToFullName[userId]} (${currencyIdToISOCode[currencyId]})`,
                        reference: `${categoryId}:${userId}:${currencyId}`,
                        group: categoryId,
                        currencyId: Number(currencyId),
                        index,
                    });
                });
            });
        });

        return data;
    },
};
