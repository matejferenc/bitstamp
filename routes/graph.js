const express = require('express');
const router = express.Router();

/* GET graph listing. */
router.get('/', function(req, res, next) {
    res.render('graph', { title: 'Graph', data: {
            x: [1, 2, 3, 4, 5],
            y: [1, 2, 4, 8, 16]
        }
    });
});

module.exports = router;
