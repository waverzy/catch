/**
 * Created by waver on 2017/7/21.
 */
define(['main'], function(main) {
    function init() {
        initWidget();
        $('.div-footer').show();
    }

    function initWidget() {
        $('#btn-submit').on('click', function () {
            if(!$('#inputName').val() || !$('#inputTel').val())  {
                $('#warning').text('请输入商家名称和联系方式！');
                $('#warning').show();
                return;
            }
            if($('#inputName').val().length > 30)  {
                $('#warning').text('名称过长，请缩减！');
                $('#warning').show();
                return;
            }
            if($('#inputLinkman').val() && $('#inputLinkman').val().length > 30)  {
                $('#warning').text('联系人过长，请缩减！');
                $('#warning').show();
                return;
            }
            if($('#inputTel').val().length > 30)  {
                $('#warning').text('联系电话过长，请缩减！');
                $('#warning').show();
                return;
            }
            if($('#inputNote').val() && $('#inputNote').val().length > 300)  {
                $('#warning').text('备注过长，请缩减！');
                $('#warning').show();
                return;
            }
            main.$.ajax({
                type: 'post',
                url: '/apply',
                cache: false,
                data: {
                    name: $('#inputName').val(),
                    linkman: $('#inputLinkman').val(),
                    tel: $('#inputTel').val(),
                    note: $('#inputNote').val()
                },
                success: function (output) {
                    if (output.msg == 'success') {
                        alert("信息已提交，我们会尽快与您联系！");
                        window.location.href = '/main';
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
