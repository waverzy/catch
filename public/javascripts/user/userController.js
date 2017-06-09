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
            var selectedId = checkedRadio[0].id;//不能用逗号，非新定义selectedIdx
            selectedIdx = selectedId.substr(0, selectedId.length-1);
            $('.modal-title').text($('#'+selectedIdx+1).text());
            $('#new-name').val($('#'+selectedIdx+1).text());
            $('#new-password').val($('#'+selectedIdx+2).text());
            $('#new-corp').val($('#'+selectedIdx+3).text());
            $('#new-auth').val($('#'+selectedIdx+4).text());

            $('#editModal').modal('toggle');
        });

        $('.btn-save').on('click', function() {
            main.$.ajax({
                type:'post',
                url:'/user/upsert',
                cache:false,
                data:{
                    name: $('#new-name').val(),
                    password: $.md5($('#new-password').val()),
                    corp: $('#new-corp').val(),
                    auth: $('#new-auth').val(),
                },
                success:function(output){
                    if(output.msg == 'success')
                    {
                        if(output.upsert) {
                            return window.location.reload();
                        }
                        $('#'+selectedIdx+2).text($('#new-password').val());
                        $('#'+selectedIdx+3).text($('#new-corp').val());
                        $('#'+selectedIdx+4).text($('#new-auth').val());
                        $('#editModal').modal('toggle');
                    } else if (output.msg == 'logout') {
                        window.location.reload();
                    } else {
                        alert(output.msg);
                        $('#editModal').modal('toggle');
                    }
                }
            });
        });

        $('.btn-insert').on('click', function() {
            $('.modal-title').text('新增');
            $('#new-name').val('');
            $('#new-password').val('');
            $('#new-corp').val('');
            $('#new-auth').val('');
            $('#form-name').show();
            $('#editModal').modal('toggle');
        });

    }

    return {
        init: init
    }
})