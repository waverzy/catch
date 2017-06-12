define(['main'], function(main) {
    function init() {
        initMenu();
        initWidget();
    }

    function initMenu() {
        $('.nav .active').removeClass('active');
        $('#menu-manage').addClass('active');
    }

    function initWidget() {
        if($('#sel-out').val()) {
            queryUnrelated($('#sel-out').val());
        }
        if($('#sel-out').val()) {
            queryRelated($('#sel-in').val());
        }

        $('#sel-out').on('change', function () {
            queryUnrelated($('#sel-out').val());
        });

        $('#sel-in').on('change', function () {
            queryRelated($('#sel-in').val());
        });

        $('.btn-insert').on('click', function() {
            var checkList = $('input[type="checkbox"][class="ipt-out"]:checked');
            if(checkList.length <= 0) {
                alert('请选择需要添加的条目！');
                return;
            }
            var relations = [];
            checkList.each(function () {
                var relation = {};
                relation.dest = $(this).val();
                relation.name = $(this).attr('name');
                relations.push(relation);
            });
            main.$.ajax({
                type:'post',
                url:'/corprelation/insert',
                cache:false,
                data:{
                    src: $('#sel-out').val(),
                    relations: JSON.stringify(relations)
                },
                success:function(output){
                    if(output.msg == 'success')
                    {
                        queryUnrelated($('#sel-out').val());
                        $('#sel-in').val($('#sel-out').val());
                        queryRelated($('#sel-in').val());
                    } else if (output.msg == 'logout') {
                        window.location.reload();
                    } else {
                        alert(output.msg);
                    }
                }
            });
        });

        $('.btn-delete').on('click', function() {
            var checkList = $('input[type="checkbox"][class="ipt-in"]:checked');
            if(checkList.length <= 0) {
                alert('请选择需要添加的条目！');
                return;
            }
            var relations = [];
            checkList.each(function () {
                relations.push($(this).val());
            });
            main.$.ajax({
                type:'post',
                url:'/corprelation/delete',
                cache:false,
                data:{
                    src: $('#sel-in').val(),
                    relations: JSON.stringify(relations)
                },
                success:function(output){
                    if(output.msg == 'success')
                    {
                        queryUnrelated($('#sel-out').val());
                        $('#sel-out').val($('#sel-in').val());
                        queryRelated($('#sel-in').val());
                    } else if (output.msg == 'logout') {
                        window.location.reload();
                    } else {
                        alert(output.msg);
                    }
                }
            });
        });
    }

    function queryUnrelated(srcCorp) {
        main.$.ajax({
            type:'post',
            url:'/corprelation/selectOut',
            cache:false,
            data:{
                src: srcCorp
            },
            success:function(output){
                if(output.msg == 'success')
                {
                    $('#tb-unrelated').html('');
                    for(var i=0; i<output.unrelated.length; i++) {
                        var temp = output.unrelated[i];
                        $('#tb-unrelated').append('<tr><th width="10%" style="text-align: center"><input class="ipt-out" type="checkbox" name="'+temp.name+'" value="'+temp.code + '"></th><th>'+temp.name+'</th></tr>');
                    }
                } else if (output.msg == 'logout') {
                    window.location.reload();
                } else {
                    alert(output.msg);
                }
            }
        });
    }

    function queryRelated(srcCorp) {
        main.$.ajax({
            type:'post',
            url:'/corprelation/selectIn',
            cache:false,
            data:{
                src: srcCorp
            },
            success:function(output){
                if(output.msg == 'success')
                {
                    $('#tb-related').html('');
                    for(var i=0; i<output.related.length; i++) {
                        var temp = output.related[i];
                        $('#tb-related').append('<tr><th width="10%" style="text-align: center"><input class="ipt-in" type="checkbox" name="'+temp.name+'" value="'+temp.dest + '"></th><th>'+temp.name+'</th></tr>');
                    }
                } else if (output.msg == 'logout') {
                    window.location.reload();
                } else {
                    alert(output.msg);
                }
            }
        });
    }

    return {
        init: init
    }
})