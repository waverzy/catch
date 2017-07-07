/**
 * Created by waver on 2017/5/31.
 */
define(['main'], function(main) {
    function init() {
        initMenu();
        initWidget();
        $('.div-footer').show();
    }

    function initMenu() {
        $('.nav .active').removeClass('active');
        $('#menu-generate').addClass('active');
    }

    function initWidget() {
        $('#btn-msg').on('click', function () {
            if(!$('#ipt-mobile').val() || $('#ipt-mobile').val() == "") {
                return alert("请输入手机号！");
            }
            if(!/^1(3|4|5|7|8)[0-9]\d{8}$/.test($('#ipt-mobile').val())) {
                return alert("手机号有误！");
            }
            // 计时器
            var seconds = 60;
            // 处理获取验证码时发生的动作
            var handleCount = function() {
                $('#btn-msg').text(seconds-- + "秒后重发");
                $('#btn-msg').css({
                    "background" : "#CCCCCC"
                });
                $('#btn-msg').attr("disabled", true);
            };
            // handleCount();
            var startCountDown = window.setInterval(function() {
                handleCount();
            }, 1000);
            // 60 秒之后清除计时器
            var clearCountDown = setTimeout(function() {
                $('#btn-msg').text("获取验证码");
                $('#btn-msg').attr("style", {
                    "background" : "none"
                });
                $('#btn-msg').attr("disabled", false);
                window.clearInterval(startCountDown);
            }, 60000);
            $('#ipt-mobile').change(function () {
                $('#btn-msg').text("获取验证码");
                $('#btn-msg').attr("style", {
                    "background" : "none"
                });
                $('#btn-msg').attr("disabled", false);
                clearInterval(startCountDown); // 清除定时器
                clearTimeout(clearCountDown);
            });
            main.$.ajax({
                type: 'post',
                url: '/generate/msg',
                cache: false,
                data: {
                    mobile: $('#ipt-mobile').val()
                },
                success: function (output) {
                    if (output.msg == 'success') {

                    } else if (output.msg == 'logout') {
                        window.location.reload();
                    } else {
                        $('#success-info').hide();
                        $('#fail-info').text(output.msg);
                        $('#fail-info').show();
                        $('#editModal').modal('toggle');
                    }
                },
                error: function () {
                    clearInterval(startCountDown); // 清除定时器
                    clearTimeout(clearCountDown);
                }
            });

        });

        $('#btn-generate').on('click', function () {
            if(!$('#ipt-mobile').val() || $('#ipt-mobile').val() == "") {
                return alert("请输入手机号！");
            }
            if(!$('#ipt-msg').val() || $('#ipt-msg').val() == "") {
                return alert("请输入短信验证码！");
            }
            $(this).attr("disabled", true);
            main.$.ajax({
                type: 'post',
                url: '/generate',
                cache: false,
                data: {
                    mobile: $('#ipt-mobile').val(),
                    msgcode: $('#ipt-msg').val(),
                    dest: $('#dest-sel').val(),
                    destname: $('#dest-sel option:selected').text()
                },
                success: function (output) {
                    if (output.msg == 'success') {
                        $('#success-info').show();
                        $('#fail-info').hide();
                        $('#editModal').modal('toggle');
                        $('#ipt-mobile').val('');
                        $('#ipt-msg').val('');
                    } else if (output.msg == 'logout') {
                        window.location.reload();
                    } else {
                        $('#success-info').hide();
                        $('#fail-info').text(output.msg);
                        $('#fail-info').show();
                        $('#editModal').modal('toggle');
                        /*$('#div-success').hide();
                        $('#fail-info').text(output.msg);
                        $('#div-fail').show();*/
                    }
                    $('#btn-generate').attr("disabled", false);
                }
            });
        });
    }

    return {
        init: init
    }
});