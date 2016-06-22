/**
 * Created by hong on 2016-06-20.
 */
var cls = require("../lib/class");

var Comment = cls.Class.extend({
    init: function(idx, name, contents, date, ip, img) {
        this.idx = idx;
        this.name = name.replace('[', '').replace(']', '');
        this.contents = contents;
        this.date = date;
        this.ip = ip;
        this._initImg(img);
    },

    _initImg: function(img) {
        if(img == 'nick_comm flow') {
            this.img = 'http://wstatic.dcinside.com/gallery/skin/gallog/g_fix.gif';
        } else if(img == 'nick_comm fixed') {
            this.img = 'http://wstatic.dcinside.com/gallery/skin/gallog/g_default.gif';
        }
    }

});

module.exports = Comment;