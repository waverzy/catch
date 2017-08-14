/**
 * Created by waver on 2017/8/14.
 */
require.config({
    paths: {
        jquery: '../lib/jquery.min'
    }
});

define('main', ['jquery'], function(JQuery) {
    var $ = Dom7;
    $(document).on('pageBeforeInit', function(e) {
        var page = e.detail.page;
        // var ua = window.navigator.userAgent.toLowerCase();
        // if(ua.match(/MicorMessenger/i) == 'micromessenger'){
        //     $('.navbar_none').css('display', 'none');
        //     $('.page-gap').css('padding-top', '0px');
        // }
        var controllerName = page.name;
        require(['../' + controllerName + '/' + controllerName + 'Controller'], function(controller){
            controller.init();
        });
    });

    var f7 = new Framework7();
    var mainView = f7.addView('.view-main');
    return {
        f7: f7,
        mainView: mainView,
        jquery: JQuery
    };
});
