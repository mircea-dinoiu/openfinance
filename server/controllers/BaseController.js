const {isPlainObject} = require('lodash');
const Messages = require('../Messages');

module.exports = {
    async postDelete(req, res) {
        const {data} = req.body;

        if (Array.isArray(data)) {
            const output = [];

            for (const record of data) {
                if (isPlainObject(record) ) {
                    const model = await this.Model.findOne({where: {id: record.id}});

                    if (model) {
                        output.push(model.toJSON());

                        await model.destroy();
                    } else {
                        output.push({
                            id: Messages.ERROR_INVALID_ID
                        });
                    }
                } else {
                    output.push(Messages.ERROR_INVALID_RECORD);
                }
            }

            res.json(output);
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    },

    async getList(req, res) {
        const {error, json} = await this.Service.list(req.query);

        if (error) {
            res.status(400);
        }

        res.json(json);
    }
};