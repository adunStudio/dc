/**
 * Created by hong on 2016-06-20.
 */
var cls = require("../lib/class");

var View = cls.Class.extend({
    init: function(idx, title, contents, name, read, comment, date, ip, img) {
        this.idx = idx;
        this.title = title;
        this.contents = contents;
        this.name = name;
        this.read = read;
        this.comment = comment;
        this.date = date;
        this.ip = ip;
        this._initName(img);
    },

    _initName: function(img) {
        if(img) {
            this.img = '<img src="' + img + '" border="0" width="12" height="15" style="margin-left: 3px;">';
        }
    }


});

module.exports = View;



