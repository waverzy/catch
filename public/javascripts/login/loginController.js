/**
 * Created by waver on 2017/5/9.
 */
define(['main'], function(main) {
    function init() {
        $('.nav').hide();
        initWidget();
        $('.div-footer').show();
    }

    function initWidget() {
        $('#btn-login').on('click', function () {
            if(!$('#password').val() || !$('#username').val())  {
                $('#warning').text('请输入用户名和密码！');
                $('#warning').show();
                return;
            }
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