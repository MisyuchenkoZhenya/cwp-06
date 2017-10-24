const artcl = require('../models/article');
const cmmnt = require('../models/comment');
const sort = require('./comparator').sort;
const Err = require('./errors').Errors;
const LOG = require('./logger').LOG;

const handlers = {
    '/articles/readall': articlesReadall,
    '/articles/read': articlesRead,
    '/articles/create': articlesCreate,
    '/articles/update': articlesUpdate,
    '/articles/delete': articlesDelete,
    '/comments/create': commentsCreate,
    '/comments/delete': commentsDelete,
};

function articlesReadall(req, res, payload, articles, cb) {
    const result = sort(payload, articles);
    cb(null, result, articles);
}

function articlesRead(req, res, payload, articles, cb) {
    let context = {};
    const index = articles.length > 0 ? articles.findIndex((elem) => elem.id === payload.id) : -1;

    if(index !== undefined && index >= 0){
        context = articles[index];
    }
    else{
        context = logError(411);
    }
    cb(null, context, articles);
}

function articlesCreate(req, res, payload, articles, cb) {
    try{
        let article = new artcl.Article(payload);
        if(!isCorrectFields(article.getArticle())){
            throw (err);
        }
        articles.push(article.getArticle());

        cb(null, article.getArticle(), articles);  
    }
    catch(Error){
        cb(Err[400], {}, articles);          
    }
    
}

function articlesUpdate(req, res, payload, articles, cb) {
    let context = {};
    
    try{
        const index = articles.length > 0 ? articles.findIndex((elem) => elem.id === payload.id) : -1;
        
        if(index !== undefined && index >= 0){
            articles[index] = updateArticle(articles[index], payload.update);
            context = {"Result": "Article updated"};
        }
    }
    catch(Error){
        context = logError(400);
    }
  
    cb(null, context, articles);
}

function articlesDelete(req, res, payload, articles, cb) {
    let context = {};
    const index = articles.length > 0 ? articles.findIndex((elem) => elem.id === payload.id) : -1;

    if(index !== undefined && index >= 0){
        delete articles[index];
        context = {"Result": "Article deleted"};
    }
    else{
        context = logError(411);
    }
    cb(null, context, articles);
}

function commentsCreate(req, res, payload, articles, cb) {
    try{
        let comment = new cmmnt.Comment(payload);
        if(!isCorrectFields(comment.getComment())){
            throw (err);
        }
        let context = {};
        const index = articles.length > 0 ? articles.findIndex((elem) => elem.id === comment.getArticleId()) : -1;
    
        if(index !== undefined){
            context = comment.getComment();
            articles[index].comments.push(context);
        }
        else{
            context = logError(411);
        }
        cb(null, context, articles);
    }
    catch(Error){
        cb(Err[400], {}, articles);
    }
}

function commentsDelete(req, res, payload, articles, cb) {
    let comment_index;
    let context = Err[412];
    articles.forEach((elem) => {
        comment_index = getCommentIndex(elem, payload.id);
        if(comment_index !== -1){
            elem.comments.splice(comment_index, 1);
            context = {"Result": "Comment deleted"};
        }
    });
  
    cb(null, context, articles);
}

function notFound(req, res, payload, articles, cb) {
    cb(Err[404], articles);
}

function getCommentIndex(article, comment_id){
    let index;
    if(article.comments.length > 0){
        index = article.comments.findIndex((elem) => elem.id === comment_id);   
    }
    else{
        index = -1;
    }
    return index;
}

function updateArticle(currentArticle, newArticle){
    try{
        for(let elem in newArticle){
            currentArticle[elem] = newArticle[elem];
        }
    }
    catch(Error){

    }
    return currentArticle;
}

function isCorrectFields(object){
    for(let elem in object){
        if(object[elem] === undefined) return false;
    }
    return true;
}

function logError(err){
    const Error = Err[err];
    LOG(`Error(${Error.code}): ${Error.message}.`);
    return Err[err];
}

module.exports.handlers = handlers;
module.exports.notFound = notFound;
  