const Article = require("../models/article").Article;

const defaultValue = {
    "sortField": "date",
    "sortOrder": "desc",
    "page": "1",
    "limit": "10"
}

function sort(payload, articles){
    const sortField = getFieldValue(payload, "sortField");
    let newArticles = articles.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
    });
    newArticles = sliceArray(payload, newArticles);
    return payload["sortOrder"] === "asc" ? newArticles : newArticles.reverse();
}

function getFieldValue(payload, field){
    let sortField;
    if((field in payload) && (payload[field] in new Article({}).getArticle()) && field !== "comments"){
        sortField = payload[field].toString();
    }
    else{
        sortField = defaultValue[field];
    }

    return sortField;
}

function sliceArray(payload, array){
    const page = "page" in payload ? +payload["page"] : +defaultValue["page"];
    const limit = "limit" in payload ? +payload["limit"] : +defaultValue["limit"];
    if(page <= 0 || limit <= 0) throw new Error();
    return array.slice((page - 1) * limit, page * limit);
}

module.exports.sort = sort;
