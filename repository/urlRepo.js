const Url = require('../models/Url');

const saveUrl = async (shortId, originalUrl) => {
    const newUrl = new Url({
        shortUrl: shortId,
        originalUrl: originalUrl
    })

    return await newUrl.save();
}

const getUrlByShortId = async (shortId) => {
    return await Url.findOne({shortUrl: shortId});
}

const incrementCount = async (urlDoc) => {
    urlDoc.clickCount++;
    return await urlDoc.save();
}

module.exports = {saveUrl, getUrlByShortId, incrementCount};