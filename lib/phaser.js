/**
 * Created by hong on 2016-06-20.
 */

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const config = require('./config');
const List = require('../model/list');
const View = require('../model/view');
const Comment = require('../model/comment');

const Proxy = require('./proxy');
var cookieJar = request.jar();

module.exports = {

    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************
     @LIST

    */



    // 리스트 페이지 파싱
    list: function(id, page, callback) {
        var ListArray = [];
        var option = {
            uri: config.dc.list + '?id=' + id + "&page=" + page
        };

        request(option, function(err, res, html) {
            var $ = cheerio.load(html);
            $('.list_thead').find('.tb').each(function() {
                var list = $(this);
                ListArray.push(
                    new List(
                            /*       idx */ list.find('.t_notice').text(),
                            /*     title */ list.find('.t_subject a').eq(0).text(),
                            /*   comment */ list.find('.t_subject a').eq(1).text(),
                            /* loginUser */ list.find('.t_writer').attr('user_id'),
                            /*      name */ list.find('.t_writer').attr('user_name'),
                            /*      date */ list.find('.t_date').text(),
                            /*      read */ list.find('.t_hits').eq(0).text(),
                            /*       hit */ list.find('.t_hits').eq(1).text(),
                            /*       img */ list.find('.right_nick > img').attr('src'),
                            /*      icon */ list.find('.icon_pic_n').text()
                    )
                );
            });

            callback(ListArray);
        });
    },
    /*

    *************************************************************************************************************************************************************************************************************************************************************************************************************

    */




    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************
     @SEARCH

    */



    // 서치 페이지 파싱
    search: function(id, page, s_type, s_keyword, callback) {
        var SearchArray = [];
        var option = {
            uri: config.dc.list + '?id=' + id + "&page=" + page + "&s_type=" + s_type +  "&s_keyword=" +  encodeURI(s_keyword)
        };

        request(option, function(err, res, html) {
            if(err) {return 1}
            var $ = cheerio.load(html);
            $('.list_thead').find('.tb').each(function() {
                var list = $(this);
                SearchArray.push(
                    new List(
                        /*       idx */ list.find('.t_notice').text(),
                        /*     title */ list.find('.t_subject a').eq(0).text(),
                        /*   comment */ list.find('.t_subject a').eq(1).text(),
                        /* loginUser */ list.find('.t_writer').attr('user_id'),
                        /*      name */ list.find('.t_writer').attr('user_name'),
                        /*      date */ list.find('.t_date').text(),
                        /*      read */ list.find('.t_hits').eq(0).text(),
                        /*       hit */ list.find('.t_hits').eq(1).text(),
                        /*       img */ list.find('.right_nick > img').attr('src'),
                        /*      icon */ list.find('.icon_pic_n').text()

                    )
                );
            });

            callback(SearchArray);
        });
    },


    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************

    */



    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************
     @VIEW

    */

    // 뷰 페이지 파싱
    view: function(id, idx, page, callback) {
        var option = {
            uri: config.dc.view + '?id=' + id + '&no=' + idx + '&page' + page
        };

        request(option, function(err, res, html) {
            var $ = cheerio.load(html);
            var view = new View(
                /*       idx */ idx,
                /*     title */ $('.w_top_left .wt_subject dd').text(),
                /*  contents */ $('.s_write table').html(),
                /*      name */ $('.w_top_left dl').eq(1).find('.user_layer').text(),
                /*      read */ $('.w_top_left dl .dd_num').eq(0).text(),
                /*   comment */ $('.w_top_left dl .dd_num').eq(1).text(),
                /*      date */ $('.w_top_right ul li').eq(0).text(),
                /*        ip */ $('.w_top_right ul li').eq(1).text(),
                /*       img */ $('.w_top_left dl').eq(1).find('.right_nick > img').attr('src')
            );

            callback(view);
        });
    },



    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************

    */




    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************
     @COMMENT_VIEW

    */

    // 댓글 페이지 파싱
    comment: function(id, idx, callback) {
        var option = {
            uri: config.dc.comment + "?id=" + id + "&no=" + idx + "&com_page=1&write=write",
            preambleCRLF: true,
            headers: {
                'referer': 'http://m.dcinside.com/view.php?id=' + id  + '&no=' + idx + '&page=1'
            }
        };

        request(option, function(err, res, html) {
            var CommentArray = [];
            var $ = cheerio.load(html);
            var table = $('.list_best');
            table.find('.best').each(function() {
                var li = $(this);
                CommentArray.push(
                    new Comment(
                        /*       idx */ idx,
                        /*      name */ li.find('.id').text(),
                        /*  contents */ li.find('.txt').text(),
                        /*      date */ li.find('.date').text(),
                        /*        ip */ li.find('.ip').text(),
                        /*        img */ li.find('.id').find('.nick_comm').attr('class')
                    )
                );
            });
            callback(CommentArray);
        });
    },



    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************

    */




    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************
     @COMMENT_WRITE

    */




    // 댓글 쓰기
    comment_write: function(id, idx, string, proxy, callback) {

        var option = {
            uri: config.dc.comment_write,
            json: true,
            headers: {
                'referer': 'http://m.dcinside.com/view.php?id=' + id  + '&no=' + idx + '&page=1',
                'content-type' : 'application/x-www-form-urlencoded'
            },
            body: string,
        };

        if(proxy) {
            option.proxy = Proxy.get();
        }

        request.post(option, function(err, res, obj) {
            if(err) {return;}
            callback(obj, idx);
        });
    },


    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************

    */





    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************
     @WRITE_VIEW

    */




    // 쓰기 페이지 파싱
    writePage: function(id, proxy, callback) {
        var option = {
            uri: config.dc.write_page + '?id=' + id ,
            jar: cookieJar
        };

        if(proxy) {
            option.proxy = Proxy.get();
        }

        request(option, function(err, res, html) {
            var $ = cheerio.load(html);
            var hidden =
            {
                ci_t: $("input[name=ci_t]").attr("value"),
                r_key: $('#r_key').val(),
                block_key: $('#block_key').val()
            };
            callback(hidden);
        });
    },



    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************

    */




    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************
     @BLOCK_KEY

    */
    
    
    

    getBlock: function(id, ci_t, block_key, string, proxy, callback) {
        var self = this;
        var option = {
            uri: config.dc.block,
            headers: {
                'Host': "gall.dcinside.com",
                'Origin': 'http://gall.dcinside.com',
                "Accept": "*/*",
                'Referer': 'http://gall.dcinside.com/board/write/?id=' + id,
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': "XMLHttpRequest",
                'cookie': 'ci_c=' + ci_t
            },
            'body': string
        };

        if(proxy) {
            option.proxy = Proxy.get();
        }

        request.post(option, function(err, res, html) {
            if(html.length == 0) {
                self.getBlock(id, ci_t, block_key, string, proxy, callback)
            } else {
                callback(html);
            }
        });
    },




    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************

    */




    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************
     @WRITE

    */
    

    article_write: function(id, string, proxy, callback) {
        var option = {
            uri: config.dc.article_submit,
            json: true,
            headers: {
                'Host': "gall.dcinside.com",
                'Origin': 'http://gall.dcinside.com',
                "Accept": "*/*",
                'Referer': 'http://gall.dcinside.com/board/write/?id=' + id,
                'content-type' : 'application/x-www-form-urlencoded',
                'X-Requested-With': "XMLHttpRequest"
            },
            body: string
        };

        if(proxy) {
            option.proxy = Proxy.get();
        }

        request.post(option, function(err, res, json) {
            if(err) {return;}
            callback(json);
        });
    }




    /*

     *************************************************************************************************************************************************************************************************************************************************************************************************************

    */

 };


