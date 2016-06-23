/**
 * Created by hong on 2016-06-23.
 */

const config = require('./config');

var proxy = (function() {
    var proxy_index = 0;
    var proxy_list = config.proxy;
    var proxy_length = proxy_list.length;

    function getProxy() {
        console.log('���Ͻø��');
        return 'http://' + proxy_list[proxy_index];
    }

    function resetProxy() {
        proxy_index = (proxy_index + 1 <= proxy_length) ? ++proxy_index : 0;
        return getProxy();
    }

    return {
        get: getProxy,
        reset: resetProxy
    }
})();

module.exports = proxy;