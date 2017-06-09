/**
 * Created by waver on 2017/5/9.
 */
define(['main'], function(main) {
    function init() {
        $('.nav').hide();
        initWidget();
    }

    function initWidget() {
        $('#btn-login').on('click', function () {
            var password = $.md5($('#password').val());
            main.$.ajax({
                type: 'post',
                url: '/login',
                cache: false,
                data: {
                    name: $('#username').val(),
                    password: password
                },
                success: function (output) {
                    if (output.msg == 'success') {
                        window.location.href = '/check';
                    } else {
                        $('#warning').text(output.msg);
                        $('#warning').show();
                    }
                }
            });
        });
    }

    return {
        init: init
    }
});