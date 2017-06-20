define(['main', 'datetimepicker', 'datetimepickerzh'], function(main) {
    function init() {
        initMenu();
        initWidget();
    }

    function initMenu() {
        $('.nav .active').removeClass('active');
        $('#menu-manage').addClass('active');
    }

    var selectedIdx = 'sth1';
    var update = true;

    function initWidget() {

        $('.btn-edit').on('click', function() {
            update = true;
            var checkedRadio = $('input[type="radio"]:checked');
            if(checkedRadio.length !== 1) {
                alert("请选择一条记录！");
                return;
            }
            var selectedId = checkedRadio[0].id;//不能用逗号，非新定义selectedIdx
            selectedIdx = selectedId.substr(0, selectedId.length-1);
            $('.modal-title').text('修改');
            $('#new-content').val($('#'+selectedIdx+1).text());
            $('#new-expiredate').val($('#'+selectedIdx+2).text());
            $('#new-state').val($('#'+selectedIdx+3).text());

            $('#editModal').modal('toggle');
        });

        $('.btn-save').on('click', function() {
            if(update) {
                main.$.ajax({
                    type:'post',
                    url:'/tip/update',
                    cache:false,
                    data:{
                        id: $('#'+selectedIdx+0).val(),
                        content: $('#new-content').val(),
                        expiredate: $('#new-expiredate').val(),
                        state: $('#new-state').val()
                    },
                    success:function(output){
                        if(output.msg == 'success')
                        {
                            window.location.reload();

                        } else if (output.msg == 'logout') {
                            window.location.reload();
                        } else {
                            alert(output.msg);
                            $('#editModal').modal('toggle');
                        }
                    }
                });
            } else {
                main.$.ajax({
                    type:'post',
                    url:'/tip/insert',
                    cache:false,
                    data:{
                        content: $('#new-content').val(),
                        expiredate: $('#new-expiredate').val(),
                        state: $('#new-state').val()
                    },
                    success:function(output){
                        if(output.msg == 'success')
                        {
                            window.location.reload();

                        } else if (output.msg == 'logout') {
                            window.location.reload();
                        } else {
                            alert(output.msg);
                            $('#editModal').modal('toggle');
                        }
                    }
                });
            }

        });

        $('.btn-insert').on('click', function() {
            update = false;
            $('.modal-title').text('新增');
            $('#new-content').val('');
            $('#new-state').val('');
            $('#new-expiredate').val('');
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
                url:'/tip/delete',
                cache:false,
                data:{
                    id: $('#'+selectedIdx+0).val()
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

    return {
        init: init
    }
})