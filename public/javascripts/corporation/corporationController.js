define(['main', 'datetimepicker', 'datetimepickerzh'], function (main) {
    function init() {
        initMenu();
        initWidget();
    }

    function initMenu() {
        $('.nav .active').removeClass('active');
        $('#menu-manage').addClass('active');
    }

    var selectedIdx = 'sth1';

    function initWidget() {
        $('.btn-detail').on('click', function () {
            $('.th-state').toggle();
            $('.th-linkman').toggle();
            $('.th-tel').toggle();
            $('.th-mobile').toggle();
            $('.th-description').toggle();
            $('.th-picture').toggle();
            $('.th-field').toggle();
            $('.th-expiredate').toggle();
            $('.th-discount').toggle();
        });

        $('.btn-edit').on('click', function () {
            var checkedRadio = $('input[type="radio"]:checked');
            if (checkedRadio.length !== 1) {
                alert("请选择一条记录！");
                return;
            }
            $('#div-file').html('<input type="file" id="file-image" name="picture">');
            var selectedId = checkedRadio[0].id;//不能用逗号，非新定义selectedIdx
            selectedIdx = selectedId.substr(0, selectedId.length - 1);
            $('.modal-title').text($('#' + selectedIdx + '-1').text());
            $('#new-code').val($('#' + selectedIdx + '-1').text());
            $('#new-name').val($('#' + selectedIdx + '-2').text());
            $('#new-state').val($('#' + selectedIdx + '-3').text());
            $('#new-address').val($('#' + selectedIdx + '-4').text());
            $('#new-linkman').val($('#' + selectedIdx + '-5').text());
            $('#new-tel').val($('#' + selectedIdx + '-6').text());
            $('#new-mobile').val($('#' + selectedIdx + '-7').text());
            $('#new-description').val($('#' + selectedIdx + '-8').text());
            $('#new-filename').val($('#' + selectedIdx + '-9').text());
            $('#new-field').val($('#' + selectedIdx + '-10').attr('name'));
            $('#new-expiredate').val($('#' + selectedIdx + '-11').text());
            $('#new-discount').val($('#' + selectedIdx + '-12').text());

            $('#editModal').modal('toggle');
        });

        $('.btn-save').on('click', function () {
            var picture = $('#file-image')[0].files[0];
            if (picture && !picture.type.match('image.*')) {
                return alert("请选择图片类型文件！");
            }
            main.$.ajax({
                type: 'post',
                url: '/corporation/upsert',
                cache: false,
                data: {
                    code: $('#new-code').val(),
                    name: $('#new-name').val(),
                    state: $('#new-state').val(),
                    address: $('#new-address').val(),
                    linkman: $('#new-linkman').val(),
                    tel: $('#new-tel').val(),
                    mobile: $('#new-mobile').val(),
                    description: $('#new-description').val(),
                    picture: $('#new-filename').val(),
                    field: $('#new-field').val(),
                    fieldname: $('#new-field').find("option:selected").text(),
                    expiredate: $('#new-expiredate').val(),
                    discount: $('#new-discount').val()
                },
                success: function (output) {
                    if (output.msg == 'success') {
                        if (!picture) {
                            return window.location.reload();
                        }
                        var formData = new FormData();
                        formData.append('picture', picture);
                        formData.append('code', $('#new-code').val());
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/corporation/upload');
                        xhr.responseType = 'json';
                        xhr.onload = function () {
                            if(xhr.response.msg != 'success') {
                                alert(xhr.response.msg);
                            }
                            return window.location.reload();
                        };
                        xhr.onerror = function () {
                            return window.location.reload();
                        };
                        xhr.send(formData);
                    } else if (output.msg == 'logout') {
                        window.location.reload();
                    } else {
                        alert(output.msg);
                        $('#editModal').modal('toggle');
                    }
                }
            });
            /*var formData = new FormData();
             var picture = $('#file-image')[0].files[0];
             if(!picture) {
             return updateAjax();
             }
             if(!picture.type.match('image.*')) {
             return alert("请选择图片类型文件！");
             }
             formData.append('picture', picture);
             var xhr = new XMLHttpRequest();
             xhr.open('POST', '/corporation/upload');
             xhr.responseType = 'json';
             xhr.onload = function () {
             if(xhr.status === 200) {
             if(xhr.response.msg == 'success') {
             $('#new-filename').val(xhr.response.filename);
             updateAjax();
             } else {
             alert('上传图片出错!' + xhr.response.msg);
             }
             } else {
             alert('通信失败：' + xhr.status);
             }
             };
             xhr.onerror = function() {
             alert('请求出错了');
             };
             xhr.send(formData);*/
        });

        $('.btn-insert').on('click', function () {
            $('#div-file').html('<input type="file" id="file-image" name="picture">');
            $('#new-filename').val('');
            $('.modal-title').text('新增');
            $('#new-code').val('');
            $('#new-name').val('');
            $('#new-state').val('');
            $('#new-address').val('');
            $('#new-linkman').val('');
            $('#new-tel').val('');
            $('#new-mobile').val('');
            $('#new-description').val('');
            $('#new-field').val('');
            $('#new-expiredate').val('');
            $('#new-discount').val('');
            $('#form-code').show();
            $('#editModal').modal('toggle');
        });

        $('.form_datetime').datetimepicker({
            minView: "month",
            format: "yyyy-mm-dd",
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            startDate: new Date()
        });

    }

    function updateAjax() {
        main.$.ajax({
            type: 'post',
            url: '/corporation/upsert',
            cache: false,
            data: {
                code: $('#new-code').val(),
                name: $('#new-name').val(),
                state: $('#new-state').val(),
                address: $('#new-address').val(),
                linkman: $('#new-linkman').val(),
                tel: $('#new-tel').val(),
                mobile: $('#new-mobile').val(),
                description: $('#new-description').val(),
                picture: $('#new-filename').val(),
                field: $('#new-field').val(),
                fieldname: $('#new-field').find("option:selected").text(),
                expiredate: $('#new-expiredate').val(),
                discount: $('#new-discount').val()
            },
            success: function (output) {
                if (output.msg == 'success') {
                    if (output.upsert) {
                        return window.location.reload();
                    }
                    $('#' + selectedIdx + '-2').text($('#new-name').val());
                    $('#' + selectedIdx + '-3').text($('#new-state').val());
                    $('#' + selectedIdx + '-4').text($('#new-address').val());
                    $('#' + selectedIdx + '-5').text($('#new-linkman').val());
                    $('#' + selectedIdx + '-6').text($('#new-tel').val());
                    $('#' + selectedIdx + '-7').text($('#new-mobile').val());
                    $('#' + selectedIdx + '-8').text($('#new-description').val());
                    $('#' + selectedIdx + '-9').text($('#new-filename').val());
                    $('#' + selectedIdx + '-10').text($('#new-field').find("option:selected").text());
                    $('#' + selectedIdx + '-11').text($('#new-expiredate').val());
                    $('#' + selectedIdx + '-12').text($('#new-discount').val());
                    $('#editModal').modal('toggle');
                } else if (output.msg == 'logout') {
                    window.location.reload();
                } else {
                    alert(output.msg);
                    $('#editModal').modal('toggle');
                }
            }
        });
    }

    return {
        init: init
    }
})