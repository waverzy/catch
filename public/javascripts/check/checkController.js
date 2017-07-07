/**
 * Created by waver on 2017/5/11.
 */
define(['main'], function(main) {
    function init() {
        initMenu();
        initWidget();
        $('.div-footer').show();
    }

    function initMenu() {
        $('.nav .active').removeClass('active');
        $('#menu-check').addClass('active');
    }

    function initWidget() {
        $('#btn-check').on('click', function () {
            if(!$('#ipt-coupon').val() || $('#ipt-coupon').val() == "") {
                return alert("请输入优惠码！");
            }
            $(this).attr("disabled", true);
            main.$.ajax({
                type: 'post',
                url: '/check',
                cache: false,
                data: {
                    couponcode: $('#ipt-coupon').val()
                },
                success: function (output) {
                    if (output.msg == 'success') {
                        $('#success-info').show();
                        $('#fail-info').hide();
                        $('#editModal').modal('toggle');
                        $('#ipt-mobile').val('');
                        $('#ipt-msg').val('');
                        $('#ipt-coupon').val('');
                    } else if (output.msg == 'logout') {
                        window.location.reload();
                    } else {
                        $('#success-info').hide();
                        $('#fail-info').text(output.msg);
                        $('#fail-info').show();
                        $('#editModal').modal('toggle');
                    }
                    $('#btn-check').attr("disabled", false);
                }
            });
        });
    }

    return {
        init: init
    }
});