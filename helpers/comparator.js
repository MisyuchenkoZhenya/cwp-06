const Article = require("../models/article").Article;
//const Comment = require("../models/comment").Comment;

const defaultValue = {
    "sortField": "date",
    "sortOrder": "desc"
}

function sort(payload, articles){
    const sortField = getFieldValue(payload, "sortField");
    const newArticles = articles.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
    });
    return payload["sortOrder"] === "asc" ? newArticles : newArticles.reverse();
}

function getFieldValue(payload, field){
    console.log(payload);
    console.log(field);
    let sortField;
    if((field in payload) && (payload[field] in new Article({}).getArticle())){
        sortField = payload[field].toString();
    }
    else{
        sortField = defaultValue[field];
    }

    return sortField;
}

module.exports.sort = sort;
