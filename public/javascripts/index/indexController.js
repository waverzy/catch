/**
 * Created by waver on 2017/6/8.
 */
define(['main'], function(main) {
    function init() {
        initMenu();
        initWidget();
        getCouponStat();
        getTip();
    }

    function initMenu() {
        $('.nav .active').removeClass('active');
        $('#menu-index').addClass('active');
        $('#menu-logout').show();
    }

    function initWidget() {
        $('#a-logout').on('click', function () {
            main.$.ajax({
                type:'post',
                url:'/index/logout',
                cache:false,
                data:{},
                success:function(){
                    window.location.href = '/login';
                }
            });
        });
    }

    function getCouponStat() {
        main.$.ajax({
            type:'post',
            url:'/index/stat',
            cache:false,
            data:{},
            success:function(output){
                if(output.msg == 'success')
                {
                    $('#tb-stats').html('');
                    if(output.stats && output.stats.length > 0) {
                        for(var i=0; i<output.stats.length; i++) {
                            var temp = output.stats[i];
                            $('#tb-stats').append('<tr><th width="10%">'+(i+1)+'</th><th>'+temp.name+'</th><th>'+temp.totalnum+'</th><th>'+temp.usednum+'</th><th><button type="button" class="btn btn-default btn-detail" name="'+temp.dest+'">查看明细</button></th></tr>');
                        }
                        //不能在init中绑定，因为button还不存在
                        $('.btn-detail').on('click', function () {
                            var dest = $(this).attr("name");
                            getCouponDetail(dest);
                        });
                    } else {
                        $('#tb-stats').append('<tr><th colspan="4">暂无统计数据，请先发放优惠券。</th><th>')
                    }
                } else if (output.msg == 'logout') {
                    window.location.reload();
                } else {
                    alert(output.msg);
                }
            }
        });
    }

    function getCouponDetail(dest) {
        $('.collapse').collapse();
        $('#div-detail').show();
        main.$.ajax({
            type:'post',
            url:'/index/query',
            cache:false,
            data:{
                dest: dest
            },
            success:function(output){
                if(output.msg == 'success')
                {
                    $('#tb-coupons').html('');
                    if(output.coupons && output.coupons.length > 0) {
                        for(var i=0; i<output.coupons.length; i++) {
                            var temp = output.coupons[i];
                            $('#tb-coupons').append('<tr><th width="10%">'+(i+1)+'</th><th>'+temp.customer+'</th><th>'+temp.createdAt.substr(0, 10)+'</th></tr>');
                        }
                    } else {
                        $('#tb-coupons').append('<tr><th colspan="3">暂无数据，请先发放优惠券。</th><th>')
                    }
                } else if (output.msg == 'logout') {
                    window.location.reload();
                } else {
                    alert(output.msg);
                }
            }
        });
    }

    function getTip() {
        main.$.ajax({
            type:'post',
            url:'/index/tip',
            cache:false,
            data:{},
            success:function(output){
                if(output.msg == 'success')
                {
                    if(output.tip && output.tip.length > 0) {
                        $('.p-tip').html('<marquee id="headTip" behavior="scroll">'+output.tip+'</marquee>');
                        $('.p-tip').show();
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
});