const {mapSearchToMatchAgainst} = require('../../helpers/search');
const {sql} = require('../../models');
const {QueryTypes} = require('sequelize');

exports.getExpenseDescriptions = async (req, res) => {
    const query = req.query;

    res.json({
        suggestions: await sql.query(
            `
SELECT
   item,
   COUNT(item) as usages 
FROM
   expenses 
WHERE
   (:search = '' OR MATCH(expenses.item) AGAINST(:search IN BOOLEAN MODE))
   AND created_at <= :endDate 
   AND project_id = :projectId 
GROUP BY
   item 
ORDER BY
   usages DESC LIMIT 10`,
            {
                replacements: {
                    endDate: query.end_date,
                    projectId: req.projectId,
                    search: mapSearchToMatchAgainst(query.search),
                },
                type: QueryTypes.SELECT,
            },
        ),
    });
};

exports.getCategories = async (req, res) => {
    const search = req.query.search;

    if ('string' === typeof search && search.trim().length) {
        const row = await sql.query(
            `
SELECT DISTINCT
   category_id 
FROM
   expenses 
   JOIN
      category_expense 
      ON category_expense.expense_id = expenses.id 
WHERE
   project_id = :projectId 
   AND MATCH(expenses.item) AGAINST(:search IN BOOLEAN MODE)`,
            {
                replacements: {
                    projectId: req.projectId,
                    search: mapSearchToMatchAgainst(search),
                },
                type: QueryTypes.SELECT,
            },
        );

        return res.json({
            suggestions: row.map((row) => row.category_id),
        });
    }

    res.json({suggestions: []});
};
