/**
 * Created by hong on 2016-06-20.
 */
var cls = require("../lib/class");

var List = cls.Class.extend({
    init: function(idx, title, comment, user, name, date, read, hit, img, icon) {
        this.idx = idx;
        this.title = title;
        this.comment = comment;
        this.user = user ? true : false;
        this.name = name;
        this.date = date;
        this.read = read;
        this.hit = hit;
        this._initImg(img);
        this._initClass(icon);      // className
    },

    _initImg: function(img) {
        if(img) {
            this.img = img
        }
    },

    _initClass: function(icon) {
        if(!(this.idx > 0)) { // 공지
            this.className =  'success';
            return;
        }
        if(icon) {
            this.className =  'warning';
        } else {
            this.className =  'default';
        }

    }

});

module.exports = List;



