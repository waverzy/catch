/**
 * Created by waver on 2017/8/14.
 */
define(['main'], function(main) {
    function init() {
        resetUrl();
        initWidget();
    }
    function resetUrl() {
        var title = "独家优惠";
        var newUrl = "/getCouponH5";
        history.pushState({}, title, newUrl);
    }

    function initWidget() {
        main.jquery.ajax({
            type: 'get',
            url: '/public/numPic',
            cache: false,
            success: function (data) {
                $('#img-numPic').html(data);
            }
        });

        $('#img-numPic').on('click', function () {
            main.jquery.ajax({
                type: 'get',
                url: '/public/numPic',
                cache: false,
                success: function (data) {
                    $('#img-numPic').html(data);
                }
            });
        });
        $('#btn-msg').on('click', function () {
            if(!checkMobile()) {
                return main.f7.alert("请输入合法手机号！", "提示");
            }
            if($('#ipt-numPic').val() == "") {
                return main.f7.alert("请输入图片验证码", "提示");
            }

            // 计时器
            var seconds = 60;
            // 处理获取验证码时发生的动作
            var handleCount = function() {
                $('#btn-msg').attr("disabled", true);
                $('#btn-msg').text(seconds-- + "秒后重发");
                $('#btn-msg').css({
                    "background" : "#CCCCCC"
                });
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

            main.jquery.ajax({
                type: 'post',
                url: '/public/getMsg',
                cache: false,
                data: {
                    picNum: $('#ipt-numPic').val(),
                    mobile: $('#ipt-mobile').val()
                },
                success: function (output) {
                    if (output.msg != 'success') {
                        clearInterval(startCountDown); // 清除定时器
                        clearTimeout(clearCountDown);
                        return main.f7.alert(output.msg, "提示");
                    }
                },
                error: function () {
                    clearInterval(startCountDown); // 清除定时器
                    clearTimeout(clearCountDown);
                    main.f7.alert("网络异常，请稍后再试！", "提示");
                }
            });
        });
        $('#btn-submit').on('click', function () {
            if(!checkMobile()) {
                return main.f7.alert("请输入合法手机号！", "提示");
            }
            if($('#ipt-msg').val() == "") {
                return main.f7.alert("请输入短信验证码", "提示");
            }
            var checkedRadio = $('input[type="radio"]:checked');
            if (checkedRadio.length !== 1) {
                return main.f7.alert("请选择一条优惠！", "提示");
            }
            main.jquery.ajax({
                type: 'post',
                url: '/public/getCoupon',
                cache: false,
                data: {
                    msgcode: $('#ipt-msg').val(),
                    mobile: $('#ipt-mobile').val(),
                    dest: checkedRadio[0].id
                },
                success: function (output) {
                    if (output.msg == 'success') {
                        main.f7.alert("优惠码已通过短信发送至您的手机，请注意查收。", "恭喜!", function () {
                            var newPageContent = '<div class="page" data-page="getCouponH5">' +
                                '<div class="page-content">' +
                                '<div class="card demo-card-header-pic" style="width: 300px; margin: 50px auto">' +
                                '<div style="background-image:url(images/coupontip.jpg); background-size: cover; height: 140px; width: 300px;" valign="bottom" class="card-header color-white no-border"></div>' +
                                '<div class="card-content"><div class="card-content-inner">' +
                                '<p>赶紧前去商家吧！完成优惠码验证即有机会获得乐高积木一份。</p></div></div></div>' +
                                '</div></div>';
                            main.mainView.router.loadContent(newPageContent);
                            window.location.replace('/getCouponH5');
                        });
                    } else {
                        main.f7.alert(output.msg, "提示");
                    }
                },
                error: function () {
                    main.f7.alert("网络异常，请稍后再试！", "提示");
                }
            });
        });
    }

    function checkMobile() {
        if(/^1(3|4|5|7|8)[0-9]\d{8}$/.test($('#ipt-mobile').val())) {
            return true;
        }
        return false;
    }

    return {
        init: init
    }
});
