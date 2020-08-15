const express = require('express');
const router = express.Router();
const fs = require('fs');
const defs = require('../../src/js/defs');

router.get(Object.values(defs.paths), (req, res) => {
    const csrfToken = req.csrfToken ? req.csrfToken() : '';

    fs.readFile('build/app.html', (err, contents) => {
        if (err) {
            res.send('Fatal error');
            console.error(err);
        } else {
            res.send(contents.toString().replace('%CSRF_TOKEN%', csrfToken));
        }
    });
});

module.exports = router;