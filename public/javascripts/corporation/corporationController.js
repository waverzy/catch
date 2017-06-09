define(['main'], function(main) {
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
        $('.btn-edit').on('click', function() {
            var checkedRadio = $('input[type="radio"]:checked');
            if(checkedRadio.length !== 1) {
                alert("请选择一条记录！");
                return;
            }
            $('#div-file').html('<input type="file" id="file-image" name="picture">');
            var selectedId = checkedRadio[0].id;//不能用逗号，非新定义selectedIdx
            selectedIdx = selectedId.substr(0, selectedId.length-1);
            $('.modal-title').text($('#'+selectedIdx+1).text());
            $('#new-code').val($('#'+selectedIdx+1).text());
            $('#new-name').val($('#'+selectedIdx+2).text());
            $('#new-state').val($('#'+selectedIdx+3).text());
            $('#new-address').val($('#'+selectedIdx+4).text());
            $('#new-linkman').val($('#'+selectedIdx+5).text());
            $('#new-tel').val($('#'+selectedIdx+6).text());
            $('#new-mobile').val($('#'+selectedIdx+7).text());
            $('#new-description').val($('#'+selectedIdx+8).text());
            $('#new-filename').val($('#'+selectedIdx+9).text());

            $('#editModal').modal('toggle');
        });

        $('.btn-save').on('click', function() {
            var formData = new FormData();
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
            xhr.send(formData);
        });

        $('.btn-insert').on('click', function() {
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
            $('#form-code').show();
            $('#editModal').modal('toggle');
        });

    }

    function updateAjax() {
        main.$.ajax({
            type:'post',
            url:'/corporation/upsert',
            cache:false,
            data:{
                code: $('#new-code').val(),
                name: $('#new-name').val(),
                state: $('#new-state').val(),
                address: $('#new-address').val(),
                linkman: $('#new-linkman').val(),
                tel: $('#new-tel').val(),
                mobile: $('#new-mobile').val(),
                description: $('#new-description').val(),
                picture: $('#new-filename').val()
            },
            success:function(output){
                if(output.msg == 'success')
                {
                    if(output.upsert) {
                        return window.location.reload();
                    }
                    $('#'+selectedIdx+2).text($('#new-name').val());
                    $('#'+selectedIdx+3).text($('#new-state').val());
                    $('#'+selectedIdx+4).text($('#new-address').val());
                    $('#'+selectedIdx+5).text($('#new-linkman').val());
                    $('#'+selectedIdx+6).text($('#new-tel').val());
                    $('#'+selectedIdx+7).text($('#new-mobile').val());
                    $('#'+selectedIdx+8).text($('#new-description').val());
                    $('#'+selectedIdx+9).text($('#new-filename').val());
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