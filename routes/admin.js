var globals = require('../globals');
var express = require('express');
var markdown = require('markdown-js');
var router = express.Router();
var post = require('../models/posts').post;


router.post(/^\/admin\/posts\/([0-9A-Za-z-_]*)$/, function(req, res, next) {

    console.log(req.body);

    if (!req.session || !req.session.user) {
        res.redirect('/login');
        return;
    }

    var query = {
            id: req.params[0]
        },
        sort = {
            time: -1
        };

    var delete_post = req.body["delete"],
        set = {
            title: req.body['title'] || '',
            id: req.body['id'] || req.params[0],
            content: req.body['content'] || '',
            tags: req.body['tags'].split(",") || [],
            location: req.body['location'] || '',
        };

    if (delete_post == "DELETE") {
        /*delete post*/
        post.remove(query).exec(function(err) {
            if (!err) {
                res.redirect('/admin/posts');
            } else {
                var err = new Error(err);
                next(err);
            };
        });

    } else {

        set.content = set.content.replace(/\r\n/mg, "\n");

        if (req.params[0] == 'new') {
            post.count(function(err, count) {
                if (set.id == 'new') {
                    set.id = Number(count) + 1;
                }
                set.views = 0;
                set.time = new Date().valueOf();

                console.log(set);

                post.create(set, function(err) {
                    if (err) throw new Error(err);
                });
            });
        } else {

            /* update post */
            post.update(query, {
                $set: set
            }, function(err) {
                if (err) throw new Error(err);
            });
        }

        var id = req.body['id'] || req.params[0];

        res.redirect('/admin/posts');
    }

    /*

        post.find(query).sort(sort).exec(function(err, data) {
            if (err) return handleError(err);
            data.forEach(
                function(item) {
                    item.href = "/admin/posts/" + item.id;
                }
            );
            res.render('admin.posts.edit.ejs', {
                globals: globals,
                router: [{
                    title: "ADMIN",
                    url: "/admin",
                }, {
                    title: "POSTS",
                    url: "/admin/posts",
                }, {
                    title: data[0].title,
                    url: "",
                }],
                notification: "Saved successfully",
                posts: data,
            });
        });
    */
});

router.get(/^\/admin\/([a-z]+)(?:[\/]*)([0-9A-Za-z-_]*)$/, function(req, res, next) {

    if (!req.session || !req.session.user) {
        res.redirect('/login');
        return;
    }

    switch (req.params[0]) {
        case "dashboard":
            res.render('admin.dashboard.ejs', {
                globals: globals,
                router: [{
                    title: "ADMIN",
                    url: "",
                }, {
                    title: "DASHBOARD",
                    url: "",
                }],
                thinHeader: true,
            });
            break;
        case "posts":
            if (!!req.params[1]) {
                var query = {
                        id: req.params[1]
                    },
                    sort = {
                        time: -1
                    };

                if (!req.params[1] || req.params[1] == 'new') {
                    res.render('admin.posts.edit.ejs', {
                        globals: globals,
                        router: [{
                            title: "ADMIN",
                            url: "/admin",
                        }, {
                            title: "POSTS",
                            url: "/admin/posts",
                        }, {
                            title: "NEW",
                            url: "",
                        }],
                        thinHeader: true,
                        notification: "",
                        posts: [{
                            id: "",
                            title: "",
                            content: "",
                            tags: [],
                            location: "",
                        }],
                    });
                } else {
                    post.find(query).sort(sort).exec(function(err, data) {
                        if (err) return handleError(err);
                        data.forEach(
                            function(item) {
                                item.href = "/admin/posts/" + item.id;
                            }
                        );
                        res.render('admin.posts.edit.ejs', {
                            globals: globals,
                            router: [{
                                title: "ADMIN",
                                url: "/admin",
                            }, {
                                title: "POSTS",
                                url: "/admin/posts",
                            }, {
                                title: data[0].title,
                                url: "",
                            }],
                            thinHeader: true,
                            notification: null,
                            posts: data,
                        });
                    });
                }
            } else {
                var query = {},
                    sort = {
                        time: -1
                    };
                post.find(query).sort(sort).exec(function(err, data) {
                    data.forEach(
                        function(item) {
                            item.href = "/admin/posts/" + item.id;
                        }
                    );
                    res.render('admin.posts.ejs', {
                        globals: globals,
                        router: [{
                            title: "ADMIN",
                            url: "",
                        }, {
                            title: "POSTS",
                            url: "",
                        }],
                        thinHeader: true,
                        posts: data,
                    });
                });
            };

            break;
        default:
            break;
    }

});

module.exports = router;
