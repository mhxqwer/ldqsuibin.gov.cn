$(function(){
	$(".nav .nav_container > ul > li").mouseenter(function(){
	$(".line").stop(false,true);
	$(".nav .nav_container > ul > li").removeClass("active");
	var ind = $(this).index();
	$(this).addClass("active");
	$(".line").animate({left:ind*145});
	$(".sec_nav > div").hide().eq(ind).show();
})
$(".nav").mouseleave(function(){
	$(".nav .nav_container > ul > li").removeClass("active");
	$(".sec_nav > div").hide();	
	var active = $(".active1").index();
	$(".line").animate({left:active*0});
	$(".nav li").eq(active).addClass("active");
})
//导航定位	
var nav_vlaue = $("#nav_pos").val();
$(".nav li").each(function(index, element) {
	var ind = $(this).index();
	var nav_text = $(this).find("a").text();
	if(nav_text == nav_vlaue){
		$(".line").css({left:ind*145});
		$(".nav li").removeClass("active1");
		$(this).addClass("active1");
	}
});	
$('.dynamic_nav ul li').mouseover(function(){
	var _dataTab = $(this).attr("data-tab");
	if(_dataTab == "false"){
		return false;
	}
	$(this).addClass('on').siblings().removeClass('on');
	$(".panes>div").eq($(this).index()).show().siblings().hide();	
})
$('.zjhg-content-div ul li').mouseover(function(){
	$(this).addClass('zjhg-add').siblings().removeClass('zjhg-add');
})
$('.zwgkinformation_nav ul li').mouseenter(function(){
	var _index = $(this).index(),
		_width = $(".zwgkinformation-panes").width();
	$(this).addClass('on').siblings().removeClass('on');
	$(".zwgkinformation-panes-body").stop(false,true);
	$(".zwgkinformation-panes-body").animate({left:-(_width*_index)},500);
})
$('.dtxwinformation_nav ul li').mouseenter(function(){
	$(this).addClass('on').siblings().removeClass('on');
	$(".dtxwinformation-panes>div").eq($(this).index()).show().siblings().hide();	
})
$('.zmhdiswitch ul li').mouseenter(function(){
	$(this).addClass('on').siblings().removeClass('on');
	$(".switch-panes>div").eq($(this).index()).show().siblings().hide();	
})
$('.yjzjinformation ul li').mouseenter(function(){
	$(this).addClass('on').siblings().removeClass('on');
	$(".yjzjinformation-panes>div").eq($(this).index()).show().siblings().hide();	
})
$('.zwfwinformationdiv_nav ul li').mouseenter(function(){
	var _index = $(this).index(),
		_width = $(".zwfwinformationdiv-panes").width();
	$(this).addClass('on').siblings().removeClass('on');
	$(".zwfwinformationdiv-panes-body").stop(false,true);
	$(".zwfwinformationdiv-panes-body").animate({left:-(_width*_index)},500);
})
$('.lj li:last').css("margin-right","0px");
$('.f_right li:last').css("border-right-width","0px");
$('.zfxxgk-div li:odd').css("margin-right","0px");

var _nBarAdd = function(){
	$('.n_bar ul li').each(function(){
		var _href = $(this).find("a").attr("href"),
			_location = window.location.href;
		if(_location.indexOf(_href)>=0){
			$(this).addClass('add').siblings().removeClass('add');	
		}
	})
}

$('.n_bar ul li').mouseover(function(){
	$(this).addClass('add').siblings().removeClass('add');	
})
$('.n_bar ul').mouseout(function(){
	_nBarAdd();
})
_nBarAdd();

var inp_txt=$("#y_menu").val();
$(".hd_qh li").eq(0).addClass("active");
$(".hd_qh li").each(function(){
	var a_txt=$(this).find("a").text();
	   if(inp_txt==a_txt){
	 $(".hd_qh li").removeClass("active");
	 $(this).addClass("active");
	 }
})
// 友情链接下拉
var n = $(".pulldown");
	n.on("mouseenter", '.butn', function () {
		$(this).next(".pulldown-menu").show();
		$(this).parent().addClass('on').siblings().removeClass('on');
	});
	console.log(n)
	n.on("mouseleave", function () {
		$(".pulldown-menu", $(this)).hide();
		$(this).removeClass('on');
	})
	//分页
	var _pageNumHtml = $(".page_num").prop("outerHTML");
	$(".page_num").remove();
	$("#pageNumAfter").after(_pageNumHtml);

$(".leader-mine-left dd a").each(function(){
	var _href = window.location.href,
		_attr = $(this).attr("href");
	if(_href.indexOf(_attr)>=0){
		$(".leader-mine-left dd").removeClass("hover");
		$(this).parents("dd").addClass("hover");
	}
})
});


/*专题轮播*/
$(function(){
	   
	$('.mainbanner').each(function(){
		var $_root = $(this);
		var $window_b = $_root.find('.mainbanner_window');
		var $list = $_root.find('.mainbanner_list');
		var $items = $list.children();
		var $window_ul = $window_b.find('#slideContainer');
		var count = $items.length;
		var item_size = 341;
		var dur_ms = 1000;
		var autoplay_interval = 8000;		
		var cur_idx = 0;
		var fix_idx = function(_idx){
			if( _idx < 0 )
			return
			(count - 1);
			if( _idx >= count )
			return 0;
			return _idx;
		}	

		var goto = function(_idx){
			var idx = fix_idx( _idx );
			$items.eq(idx).addClass('active').siblings().removeClass('active');
			if( cur_idx != idx ){
				var offset_x = - idx * item_size;
				$window_ul.stop().animate({'left':offset_x},dur_ms);
				cur_idx = idx;
			}
		}

		$items.each(function(index, element){
			var $cur_item = $(this);
			var $cur_a = $cur_item.find('a');
			$cur_a.data('index',index);
			$cur_a.click(function(){
				var index = $(this).data('index');
				goto(index);
				return false;
			});
		});
		
		var autoplay_flag = true;

		window.setInterval(function(){
			if(autoplay_flag){
				goto( cur_idx + 1 );
			}
		},autoplay_interval);

		$_root.hover(function(){
			autoplay_flag = false;
		},function(){
			autoplay_flag = true;
		});
		
		goto(0);
	});
	
	//搜索
	$(document).on("click",".search button",function(){
		var _val = $(".search input").val();
		if(_val==""){
			alert("请输入您搜索的内容");
			return;
		}
		headSearch("");
	});
	//搜索 回车
	$(document).keyup(function(event){
		var _focus = $(".search input").is(":focus");
		if(event.keyCode==13&&_focus){
			headSearch("");
		}
	});

	//政策文件库搜索
	$(document).on("click",".search-frame a",function(){
		var sousuo = $(".search-frame input").val();
		if(sousuo==""){
			alert("请输入您搜索的内容");
			return;
		}
		zcSearch("");
	});

})	
/*专题轮播end*/
/*搜索函数*/
function headSearch(_is){
	var _val = $(".search input").val();
	var highs=0;
	if(_is == "highSearch"){
		// _val="";
		highs=1
	}
	window.open('/search5/html/searchResult1.html?siteCode=2304220006&searchWord='+_val+'&column=%E5%85%A8%E9%83%A8&left_right_index=0&searchSource=1&highsearch='+highs);
}

/*政策文件库搜索函数*/
function zcSearch(_is){
	var sousuo = $(".search-frame input").val();
	if(_is == "wjkSearch"){
		sousuo="";
	}
	window.open('/policy/#/index?searchword='+sousuo);
}


var paramKey='e27486oit7884b768605403b13f30d43';

function ssoLogin(){
	localStorage.setItem('referUrl',window.location.href);
	window.open('/unified-sso/user/sendLogin?paramKey='+paramKey,"_self" );
}

function ssoLogout(){
	localStorage.setItem('referUrl',window.location.href);
	var verid = getCookie('verid');
	if(verid&&verid!=''){
//		window.open('/unified-sso/user/removeCache?verid='+verid,"_self" );
        $.ajax({
            url: '/unified-sso/user/removeCache?verid=' + verid,
			async:false,
            success: function success(data) {
                if (data.success == true) {
                    //60分钟
					clearCookie('verid');
					clearCookie('ticket');
					clearCookie('username');
					clearCookie('mobile');
					clearCookie('cardId');
     
                }
            }
        });		
		window.location.href = "/";
		// window.location.href = "https://sfrz.zwfw.hlj.gov.cn/f/hljLogout/logoutTrust?uuid=P057fa163e7c3a55¶mKey="+paramKey;
		
	}else{
		clearCookie('verid');
		clearCookie('ticket');
		clearCookie('username');
		clearCookie('mobile');
		clearCookie('cardId');

        $(".userspan").html('');
        $('.userspan').css('display', 'none');
        $('.loginspan').css('display', 'inline');      

	}
}

$(function(){
    checkLogin();
	$(".pulldown-menu li a").each(function(){
		var _title = $(this).attr("title");
		if(_title=='台湾'){
			$(this).attr("href","javascript:;");
			$(this).removeAttr("target");
		}
	});
});    

function checkLogin(){
//  单点登录分析
    var  verid = UrlSearch("verid");
    if(!verid||verid==''){
        verid = getCookie("verid");
    }
    // 不存在verid
    if(!verid||verid==''){
        $(".userspan").html('');
        $('.userspan').css('display', 'none');
        $('.loginspan').css('display', 'inline');      
        return false;  
    }else{
        var getUserOk = false;
        setCookie('verid', verid, 60);
        $.ajax({
            url: '/unified-sso/user/getLoginUser?verid=' + verid,
			async:false,
            success: function success(data) {
                if (data.success == true) {
                    //60分钟
					setCookie('verid', verid, 60);
                    setCookie('ticket', data.msg.ticket, 60);
                    setCookie('username', data.msg.userName, 60);
                    setCookie('mobile', data.msg.mobile, 60);
					setCookie('cardId', data.msg.cardId, 60);

                    $(".userspan").html(data.msg.userName + ',欢迎您！<a href="javascript:ssoLogout();">退出</a>');
                    $('.userspan').css('display', 'inline');
                    $('.loginspan').css('display', 'none');      
                    getUserOk = true;                 
                }
            }
        });
        return getUserOk;  
    }    
}

//先打开页面再进行登录识别，登录后刷新当前页
function checkLoginWithAlert(){
	var logined =  checkLogin();
	if(!logined){
	   alert("您还未登录，请先登录后再进行操作！");	
	   ssoLogin();
	}
 }

 //暂时不使用。先判断是否登录再进行跳转
function checkLoginSwitch(url){
	var logined =  checkLogin();
	if(logined){
	   window.open(url,"_self" );
	}else{
	   ssoLogin();
	}
 }
 

//取网址参数
function UrlSearch(canshu) {
    var name,value;
    var str=location.href; //取得整个地址栏
    var num=str.indexOf("?")
    str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            if(name==canshu){
                return value;
            }
            //this[canshu]=value;

        }

    }
}

//设置cookie
function setCookie(cname, cvalue, exminutes) {
    var d = new Date();
    d.setTime(d.getTime() + (exminutes*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires+ "; path=/";
}

//获取cookie
function getCookie(objname){//获取指定名称的cookie的值
	var arrstr = document.cookie.split("; ");
	for(var i = 0;i < arrstr.length;i ++){
		var temp = arrstr[i].split("=");
		if(temp[0] == objname) return unescape(temp[1]);
	}
}

//清除cookie  
function clearCookie(name) {  
    setCookie(name, "", -1);  
}  
function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

setInterval(function(){
	$("#code table tr:first-child").each(function(){
		var _trLen = $(this).find("td").length;
		$("#code table td").css({width:100/_trLen+"%"})
	})
},2000);

setInterval(function(){
	var _has = $("body").hasClass("UseInMobile"),
		_has1 = $("body").hasClass("useOldFixed");
	if(_has||_has1){
		$("meta[name=viewport]").attr("content","width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no");
	}
},1000);


$(function() {
    $(".lxxdSpan").hover(//悬浮变色，不悬浮恢复颜色
        function() {
                    $(this).css({"font-weight":"bold","border-bottom":"#267DDE 0.25rem solid"});
                    $(".xjtjSpan").css({"font-weight":"normal","border":"none"});
            $("#lxxd").show();
                    $("#xjtj").hide();
    }).mouseover(function() {
         
    })

      $(".xjtjSpan").hover(//悬浮变色，不悬浮恢复颜色
        function() {
                    $(this).css({"font-weight":"bold","border-bottom":"#267DDE 0.25rem solid"});
                    $(".lxxdSpan").css({"font-weight":"normal","border":"none"});
            $("#xjtj").show();
                    $("#lxxd").hide();
    }).mouseover(function() {
        
    })
});