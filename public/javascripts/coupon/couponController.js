define(['main'], function(main) {
    function init() {
        initMenu();
        initWidget();
        /*main.$.ajax({
            type:'post',
            url:'/corporation/query',
            cache:false,
            data:{},
            success:function(output){
                if(output.msg == 'success')
                {
                    if(output.corps instanceof Array) {
                        for(var i=0; i<output.corps.length; i++) {
                            $('#src-sel').append('<option value="'+output.corps.code+'">'+output.corps.name+'</option>');
                        }
                        return;
                    }
                    alert('获取机构列表失败！');
                } else {
                    alert(output.msg);
                }
            }
        });*/
    }

    function initMenu() {
        $('.nav .active').removeClass('active');
        $('#menu-manage').addClass('active');
    }

    function initWidget() {
        $('#generate').on('click', function() {
            if(!$('#src-sel').val() || !$('#dest-sel').val()) {
                alert("请选择机构！");
                return;
            }
            if($('#src-sel').val() === $('#dest-sel').val()) {
                alert("源机构与目的机构不能相同！");
                return;
            }
            main.$.ajax({
                type:'post',
                url:'/coupon/create',
                cache:false,
                data:{
                    src: $('#src-sel').val(),
                    dest: $('#dest-sel').val(),
                    discount: $('#discount-input').val(),
                    num: $('#num-input').val(),
                    len: $('#len-input').val()
                },
                success:function(output){
                    if(output.msg == 'success')
                    {
                        $('#coupons').html('');
                        for(var i=0; i<output.coupons.length; i++) {
                            $('#coupons').append('<tr><th>'+i+'</th><th>'+output.coupons[i].src+'</th><th>'+output.coupons[i].dest+'</th><th>'+output.coupons[i].couponcode+'</th><th>'+output.coupons[i].couponno.toString()+'</th><th>'+output.coupons[i].discount+'</th></tr>');
                        }
                        $('#results').show();
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