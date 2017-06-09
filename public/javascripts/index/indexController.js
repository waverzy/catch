/**
 * Created by waver on 2017/6/8.
 */
define(['main'], function(main) {
    function init() {
        initMenu();
        initWidget();
    }

    function initMenu() {
        $('.nav .active').removeClass('active');
        $('#menu-index').addClass('active');
        $('#menu-logout').show();
    }

    function initWidget() {
        $('#a-logout').on('click', function () {
            main.$.ajax({
                type:'post',
                url:'/index/logout',
                cache:false,
                data:{},
                success:function(){
                    window.location.href = '/login';
                }
            });
        });
    }

        return {
        init: init
    }
});