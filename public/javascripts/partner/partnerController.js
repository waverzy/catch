/**
 * Created by waver on 2017/6/8.
 */
define(['main'], function(main) {
    function init() {
        initMenu()
    }

    function initMenu() {
        $('.nav .active').removeClass('active');
        $('#menu-partner').addClass('active');
    }

    return {
        init: init
    }
});