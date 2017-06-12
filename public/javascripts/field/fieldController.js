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
            $('#new-id').val($('#'+selectedIdx+1).text());
            $('#new-name').val($('#'+selectedIdx+2).text());

            $('#editModal').modal('toggle');
        });

        $('.btn-save').on('click', function() {
            main.$.ajax({
                type:'post',
                url:'/field/upsert',
                cache:false,
                data:{
                    id: $('#new-id').val(),
                    name: $('#new-name').val()
                },
                success:function(output){
                    if(output.msg == 'success')
                    {
                        if(output.upsert) {
                            return window.location.reload();
                        }
                        $('#'+selectedIdx+2).text($('#new-name').val());
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
            $('#new-id').val('');
            $('#new-name').val('');
            $('#form-id').show();
            $('#editModal').modal('toggle');
        });

        $('.btn-delete').on('click', function() {
            var checkedRadio = $('input[type="radio"]:checked');
            if(checkedRadio.length !== 1) {
                alert("请选择一条记录！");
                return;
            }
            var selectedId = checkedRadio[0].id;//不能用逗号，非新定义selectedIdx
            selectedIdx = selectedId.substr(0, selectedId.length-1);
            main.$.ajax({
                type:'post',
                url:'/field/delete',
                cache:false,
                data:{
                    id: $('#'+selectedIdx+1).text()
                },
                success:function(output){
                    if(output.msg == 'success') {
                        return window.location.reload();
                    } else if (output.msg == 'logout') {
                        window.location.reload();
                    } else {
                        alert(output.msg);
                    }
                }
            });
        });

    }

    return {
        init: init
    }
})