const express = require('express');
const router = express.Router();
const { shortenUrlHandler, redirectUrl } = require('../service/urlServices');


/* ****************************************************************************************************** */
/*                                            URL ROUTES                                                  */
/* ****************************************************************************************************** */

router.post('/shorten', shortenUrlHandler);

router.get('/:shortId', async (req, res, next) => {
    try {
        console.log(req.params);
        const originalUrl = await redirectUrl(req.params.shortId);
        res.redirect(originalUrl);
    } catch (error) {
        if (error.message === 'URL not found') {
            return res.status(404).json({
                error: {
                    message: 'Short URL not found'
                }
            });
        }
        next(error);
    }
});

module.exports = router;