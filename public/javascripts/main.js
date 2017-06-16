/**
 * Created by waver on 2017/4/27.
 */
require.config({
    paths: {
        jquery: 'lib/jquery.min',
        bootstrap: 'lib/bootstrap.min',
        md5: 'lib/jquery.md5',
        datetimepicker: 'lib/bootstrap-datetimepicker.min',
        datetimepickerzh: 'lib/bootstrap-datetimepicker.zh-CN'
    },
    shim : {
        bootstrap: {
            deps: ['jquery']
        },
        md5: {
            deps: ['jquery']
        },
        datetimepickerzh: {
            deps: ['datetimepicker']
        }
    }
});

define('main', ['jquery', 'bootstrap', 'md5'], function($) {
    $('.main-page').ready(function() {
        var controllerName = $('.main-page').attr('id');
        require([controllerName + '/' + controllerName + 'Controller'], function(controller){
            controller.init();
        })
    });
    return {
        $: $
    }
});

