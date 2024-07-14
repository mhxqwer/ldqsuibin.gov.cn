// 木马轮播效果
var MIDDLE_PIC_POS = 1

//计算如何用最短的距离移动到目标
//由于有两种移动方式,向左边移动或者像右边移动,只需要在这两种方式中选择一个小的就行了

;(function($){
    var Caroursel = function (caroursel){
        var self = this;
        this.caroursel = caroursel;
        this.posterList = caroursel.find(".poster-list");
        this.posterItems = caroursel.find(".poster-item");
        this.firstPosterItem = this.posterItems.first();
        this.lastPosterItem = this.posterItems.last();
        this.prevBtn = this.caroursel.find(".poster-prev-btn");
        this.nextBtn = this.caroursel.find(".poster-next-btn");

        this.buttonItems = caroursel.find(".tabBtn");

        //每个移动元素的位置索引,用于记录每个元素当前的位置,在每次移动的时候,该数组的值都会发生变化
        //数组的下标对应li元素的位置索引
        this.curPositions = [];
        for(var i = 0;i<this.posterItems.length;++i){
            this.curPositions[i] = i+1;
        }

        this.setting = {
            "width":"540",
            "height":"300",
            "posterWidth":"343",
            "posterHeight":"297",
            "scale":"0.8",
            "speed":"1000",
            "isAutoplay":"true",
            "dealy":"9000"
        };

        $.extend(this.setting,this.getSetting());

        this.setFirstPosition();

        this.setSlicePosition();

        this.refreshCss();

        this.rotateFlag = true;
        this.prevBtn.bind("click",function(){
            if(self.rotateFlag){
                self.rotateFlag = false;
                self.rotateAnimate("left")
            }
        });

        this.nextBtn.bind("click",function(){
            if(self.rotateFlag){
                self.rotateFlag = false;
                self.rotateAnimate("right")
            }
        });

        //绑定位置按钮事件

         this.buttonItems.each(function(index){
             var _this = $(this);
             _this.click(function(){
                 self.clickPosButtonIndex(index);
             })
         });

        if(this.setting.isAutoplay){
            this.autoPlay();
            this.caroursel.hover(function(){clearInterval(self.timer)},function(){self.autoPlay()})
        }
    };
    Caroursel.prototype = {
        autoPlay:function(){
          var that = this;
          this.timer =  window.setInterval(function(){
              that.nextBtn.click();
          },that.setting.dealy)
        },


        refreshCss:function(){
            var that= this;
            var curFirstPos;//当前位于中间的li元素位置
            this.buttonItems.each(function(index){
                var _this = $(this);
                var curPos = that.curPositions[index];
                if(curPos == 1){
                    _this.addClass('poster-btn-active');
                }
                else{
                    _this.removeClass('poster-btn-active');
                }
            });
        },

        //记录每次移动的状态
        refreshPositions:function(offset){
            //console.log('before refreshPositions',this.curPositions,'the offset is offset ' + offset);
            for(var i = 0; i < this.curPositions.length; ++i)
            {
                var nextPos = this.curPositions[i] + offset;
                if (nextPos > this.curPositions.length) {//移动超过末尾,则位置变成到开头
                    nextPos = nextPos - this.curPositions.length;
                }else 
                 if (nextPos < 1) {////向左边移动已经移动到开始位置更左边,则位置变成结束
                     nextPos = this.curPositions.length + nextPos;
                 }
                this.curPositions[i] = nextPos;
            }
            //console.log('after refreshPositions',this.curPositions);
            this.refreshCss();
        },

         cal_move_path:function(curPos,desPos,arraySize) {
            //console.log("begin cal_move_path ",curPos,desPos,arraySize);
            if(curPos == desPos) return null;
            //往左边移动
             var goRightSteps;
             var goLeftSteps;
             var retDirect;
             var retStep;
             if(curPos > desPos){
                 goRightSteps = curPos - desPos;
                 goLeftSteps = desPos + (arraySize - curPos);
                 retDirect = (goRightSteps <= goLeftSteps) ? "right":"left";
                 return {"direct":retDirect,"step":Math.min(goLeftSteps,goRightSteps)};
             }
        },


        //点击位置按钮,根据点击的按钮索引 决定向左还是向右移动[因为只有三个位置,该方法能够仅靠向左或向右就能将
        //指定的位置移动到中间]
        clickPosButtonIndex:function(index){
            //console.log('click the index ' + index,'the curPositions is ',this.curPositions);
            var self = this;
            if(self.rotateFlag == false) {//目前正在移动等移动结束后才能进入
                return;
            }

            var curPos = this.curPositions[index];
            var retPath = this.cal_move_path(curPos,MIDDLE_PIC_POS,this.curPositions.length);
            if (retPath == null){
                return;
            }

            var direct = retPath.direct;
            var step = retPath.step;

            self.rotateFlag = false;
            self.rotateAnimate(direct,step)
        },

        rotateAnimate:function(type,step){
            step = step || 1;
            //console.log('begin rotateAnimate ' + type  + "the step is " + step);
            var that = this;
            var zIndexArr = [];
            var speed = that.setting.speed;
                this.posterItems.each(function(){
                   var self = $(this);
                   var destPic = null;
                   var curPic = self;
                   for (var i = 0; i < step;++i){
                        if(type == "left"){// 向左边移动, 下一张图片在自己的右边,所以用next()
                            destPic = curPic.next().get(0)?curPic.next():that.firstPosterItem;
							
                        }
                        else{
                            destPic = curPic.prev().get(0)?curPic.prev():that.lastPosterItem;
                        }
                        curPic = destPic;
                    }

                    var width = destPic.css("width");
                    var height = destPic.css("height");
                    var zIndex = destPic.css("zIndex");
                    var opacity = destPic.css("opacity");
                    var left = destPic.css("left");
                    var top = destPic.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        "width":width,
                        "height":height,
                        "left":left,
                        "opacity":opacity,
                        "top":top
                    },speed,function(){
                        that.rotateFlag = true;
                    });
                });
                this.posterItems.each(function(i){
                    $(this).css("zIndex",zIndexArr[i]);
					
                });

                if (type == 'right'){
                    this.refreshPositions(-step);
                }else{
                    this.refreshPositions(step);
                }
        },

        setFirstPosition:function(){
            this.caroursel.css({"width":this.setting.width,"height":this.setting.height});
            this.posterList.css({"width":this.setting.width,"height":this.setting.height});
            var width = (this.setting.width - this.setting.posterWidth) / 2;

            this.prevBtn.css({"width":width , "height":this.setting.height,"zIndex":Math.ceil(this.posterItems.size()/2)});
            this.nextBtn.css({"width":width , "height":this.setting.height,"zIndex":Math.ceil(this.posterItems.size()/2)});
            this.firstPosterItem.css({
                "width":this.setting.posterWidth,
                "height":this.setting.posterHeight,
                "left":width,
                "zIndex":Math.ceil(this.posterItems.size()/2),
                "top":this.setVertialType(this.setting.posterHeight)
            });
        },
        setSlicePosition:function(){
            var _self = this;
            var sliceItems = this.posterItems.slice(1),
                level = Math.floor(this.posterItems.length/2),
                leftItems = sliceItems.slice(0,level),
                rightItems = sliceItems.slice(level),
                posterWidth = this.setting.posterWidth,
                posterHeight = this.setting.posterHeight,
                Btnwidth = (this.setting.width - this.setting.posterWidth) / 2,
                gap = Btnwidth/level,
                containerWidth = this.setting.width;

            var i = 1;
            var leftWidth = posterWidth;
            var leftHeight = posterHeight;
            var zLoop1 = level;
            console.log(leftItems);
            console.log(rightItems);
            leftItems.each(function(index,item){
                var scale = _self.setting.scale;
                if(index==1){
                    scale = scale*scale;
                }
                leftWidth = posterWidth * scale;
                leftHeight = posterHeight*scale;
                console.log(leftWidth)
                console.log(leftHeight)
                $(this).css({
                    "width":leftWidth,
                    "height":leftHeight,
                    "left": Btnwidth - i*gap,
                    "zIndex":zLoop1--,
                    "opacity":2/(i+1),
                    "top":_self.setVertialType(leftHeight)
                });
                i++;
            });

            var j = level;
            var zLoop2 = 1;
            var rightWidth = posterWidth;
            var rightHeight = posterHeight;
            rightItems.each(function(index,item){
                var scale = _self.setting.scale;
                if(index==0){
                    scale = scale*scale;
                }
                var rightWidth = posterWidth * scale;
                var rightHeight = posterHeight*scale;
                $(this).css({
                    "width":rightWidth,
                    "height":rightHeight,
                    "left": containerWidth -( Btnwidth - j*gap + rightWidth),
                    "zIndex":zLoop2++,
                    "opacity":2/(j+1),
                    "top":_self.setVertialType(rightHeight)
                });
                j--;
            });
        },
        getSetting:function(){
            var settting = this.caroursel.attr("data-setting");
            if(settting.length > 0){
                return $.parseJSON(settting);
            }else{
                return {};
            }
        },
        setVertialType:function(height){
            var align = this.setting.align;
            if(align == "top") {
                return 0
            }else if(align == "middle"){
                return (this.setting.posterHeight - height) / 2
            }else if(align == "bottom"){
                return this.setting.posterHeight - height
            }else {
                return (this.setting.posterHeight - height) / 2
            }
        }
    };
    Caroursel.init = function (caroursels){
        caroursels.each(function(index,item){
            new Caroursel($(this));
        })  ;
    };
    window["Caroursel"] = Caroursel;
})(jQuery);// JavaScript Document




(function(a) {
    a.fn.maiPlayer = function(c) {
        var b = {
            oPlay: null,
            speedSwitch: 3000,
            speedAnimate: 500,
            showPage: 0,
            playerWidth: 0,
            autoPlay: true,
            flipButton: true,
            pageButton: true,
            playerBg: true,
            numPage: false,
            imageTitle: false,
            imageContent: false,
            switchActionAuto: "roll",
            switchActionPage: "opacity",
            switchActionFlip: "roll",
            textDisplay: 0,
            textSpeed: 500
        };
        var c = a.extend(b, c);
        this.each(function() {
            var p = a(this);
            var n = "";
            var h = 0;
            var i = 0;
            var j = null;
            var d = [];
            a(p).find("li img").parents("ul").addClass("ul-img").css("position", "relative");
            h = a(p).find(".ul-img li").length;
            if (c.playerWidth) {
                i = c.playerWidth;
                a(p).css("width", i + "px");
                a(p).find(".ul-img li").css("width", i + "px");
                a(p).find("img").css("width", i + "px");
                a(p).find(".bg:first").css("width", i + "px")
            } else {
                i = a(p).find(".ul-img li:first").width()
            }
            if (c.playerHeight) {
                iHeight = c.playerHeight;
                a(p).css("height", iHeight + "px");
                a(p).find(".ul-img").css("height", iHeight + "px");
                a(p).find(".ul-img li").css("height", iHeight + "px");
                a(p).find("img").css("height", iHeight + "px")
            }
            a(p).find(".ul-img li").each(function() {
                var q = a(p).find(".ul-img li").index(this);
                d[q] = a(p).find(".ul-img img").eq(q).attr("title");
                a(p).find(".ul-img img").eq(q).removeAttr("title")
            });
            if (c.imageTitle || c.imageContent) {
                var k = a('<ul class="ul-text"></ul>');
                a(k).insertAfter(a(p).find(".ul-img"));
                a(p).find(".ul-img li").each(function() {
                    var s = a("<li></li>");
                    var q = a(p).find(".ul-img li").index(this);
                    if (c.imageTitle) {
                        var t = a("<h2></h2>");
                        a(t).text(d[q]);
                        a(s).append(t)
                    }
                    if (c.imageContent) {
                        var r = a("<p></p>");
                        var u = a(p).find(".ul-img img").eq(q).attr("alt");
                        a(r).text(u);
                        a(s).append(r)
                    }
                    a(k).append(s)
                });
                a(p).find(".ul-text").width(i * h);
                a(p).find(".ul-text").height(a(p).find(".bg:first").height())
            }
            a(p).find(".ul-img").width(i * h);
            if (c.flipButton) {
                a(p).find(".next:first").click(function() {
                    if (c.switchActionFlip == "roll") {
                        l(a(p).find(".ul-img"), 1);
                        if (c.imageTitle || c.imageContent) {
                            l(a(p).find(".ul-text"), 0)
                        }
                    } else {
                        if (c.switchActionFlip == "opacity") {
                            if (c.showPage == h - 1) {
                                c.showPage = 0
                            } else {
                                c.showPage++
                            }
                            f(a(p).find(".ul-img"), c.showPage);
                            f(a(p).find(".ul-text"), c.showPage);
                            e(a(p).find(".num span").eq(c.showPage), "on")
                        }
                    }
                });
                a(p).find(".prev:first").click(function() {
                    if (c.switchActionFlip == "roll") {
                        l(a(p).find(".ul-img"), -1);
                        if (c.imageTitle || c.imageContent) {
                            l(a(p).find(".ul-text"), 0)
                        }
                    } else {
                        if (c.switchActionFlip == "opacity") {
                            if (c.showPage == 0) {
                                c.showPage = h - 1
                            } else {
                                c.showPage--
                            }
                            f(a(p).find(".ul-img"), c.showPage);
                            f(a(p).find(".ul-text"), c.showPage);
                            e(a(p).find(".num span").eq(c.showPage), "on")
                        }
                    }
                })
            } else {
                a(p).find(".next:first").css("display", "none");
                a(p).find(".prev:first").css("display", "none")
            }
            if (c.showPage) {
                a(p).find(".ul-img").css("left", -i * c.showPage + "px");
                a(p).find(".ul-text").css("left", -i * c.showPage + "px")
            }
            if (c.pageButton) {
                n = "";
                a(p).find(".ul-img li").each(function() {
                    n += "<span></span>"
                });
                a(p).find(".num:first").html(n);
                a(p).find(".num span:first").addClass("on");
                e(a(p).find(".num span").eq(c.showPage), "on");
                a(p).find(".num span").click(function() {
                    var q = a(p).find(".num span").index(this);
                    if (c.switchActionPage == "roll") {
                        c.showPage = 0;
                        l(a(p).find(".ul-img"), q);
                        l(a(p).find(".ul-text"), 0)
                    } else {
                        if (c.switchActionPage == "opacity") {
                            c.showPage = q;
                            f(a(p).find(".ul-img"), c.showPage);
                            f(a(p).find(".ul-text"), c.showPage);
                            e(a(p).find(".num span").eq(c.showPage), "on")
                        }
                    }
                    if (c.numPage) {
                        a(this).text(a(p).find(".num span").index(this) + 1)
                    }
                })
            }
            if (!c.playerBg) {
                a(p).find(".bg:first").css("display", "none")
            }
            function l(r, q) {
                if (r.is(":animated") == false) {
                    c.showPage += q;
                    if (c.showPage != -1 && c.showPage != h) {
                        r.animate({
                            left: -c.showPage * i + "px"
                        },
                        c.speedAnimate)
                    } else {
                        if (c.showPage == -1) {
                            c.showPage = h - 1;
                            r.css({
                                left: -(i * (c.showPage - 1)) + "px"
                            });
                            r.animate({
                                left: -(i * c.showPage) + "px"
                            },
                            c.speedAnimate)
                        } else {
                            if (c.showPage == c.showPage) {
                                c.showPage = 0;
                                r.css({
                                    left: -i + "px"
                                });
                                r.animate({
                                    left: 0 + "px"
                                },
                                c.speedAnimate)
                            }
                        }
                    }
                    e(a(p).find(".num span").eq(c.showPage), "on")
                }
            }
            function f(s, r) {
                var q = (s.css("left") != -r * i + "px");
                if (q) {
                    s.fadeOut(20,
                    function() {
                        s.css("left", -r * i + "px");
                        s.fadeIn(500)
                    })
                }
            }
            function m() {
                j = setInterval(function() {
                    if (c.switchActionAuto == "roll") {
                        l(a(p).find(".ul-img"), 1)
                    } else {
                        if (c.switchActionAuto == "opacity") {
                            c.showPage++;
                            if (c.showPage == h) {
                                c.showPage = 0
                            }
                            f(a(p).find(".ul-img"), c.showPage);
                            e(a(p).find(".num span").eq(c.showPage), "on")
                        }
                    }
                    if (c.imageTitle || c.imageContent) {
                        l(a(p).find(".ul-text"), 0)
                    }
                },
                c.speedSwitch)
            }
            function o() {
                if (j) {
                    clearInterval(j)
                }
            }
            a(p).hover(function() {
                o();
                if (c.textDisplay == 1) {
                    a(p).find(".bg:first").slideUp(c.textSpeed);
                    a(p).find(".ul-text:first").slideUp(c.textSpeed)
                } else {
                    if (c.textDisplay == 2) {
                        a(p).find(".bg:first").slideDown(c.textSpeed);
                        a(p).find(".ul-text:first").slideDown(c.textSpeed)
                    }
                }
            },
            function() {
                if (c.autoPlay) {
                    m()
                }
                if (c.textDisplay == 1) {
                    a(p).find(".bg:first").slideDown(c.textSpeed);
                    a(p).find(".ul-text:first").slideDown(c.textSpeed)
                } else {
                    if (c.textDisplay == 2) {
                        a(p).find(".bg:first").slideUp(c.textSpeed);
                        a(p).find(".ul-text:first").slideUp(c.textSpeed)
                    }
                }
            });
            if (c.autoPlay) {
                m()
            }
            function g(q, r) {}
            function e(r, q) {
                r = a(r) ? a(r) : r;
                r.addClass(q).siblings().removeClass(q)
            }
        })
    }
})(jQuery);

/*调用*/


function LbMove(boxID,btn_left,btn_right,btnBox,Car,direction,way,moveLengh,speed,Interval,number){
				var        _ID   = $("#"+boxID+"");
				var  _btn_left   = $("#"+btn_left+"");
				var _btn_right   = $("#"+btn_right+"");
				var    _btnBox   = $("#"+btnBox+"");
				var        jsq   = 0
				var      timer     ;
				var         cj     ;
				var     no_way   = 0;
				var  no_wayGet   = 0;
				var       fade   = 0;
				var   new_time   = new Date;
				
				var ID_liLen , ID_liheight , cbtmBtn ;
				ID_liLen    = _ID.find("li").length;
				ID_liheight = _ID.find("li").innerHeight();
				
				if(direction == "left" || direction == "right"){
					_ID.find("ul").width(ID_liLen*moveLengh);
					}else if(direction == "top" || direction == "bottom"){
						_ID.find("ul").height(ID_liLen*moveLengh);
						_btnBox.hide()
						}else if(direction == "fade"){
							_ID.find("ul").width(moveLengh).height(ID_liheight);
							_ID.find("li").eq(0).show().siblings().hide();
							_ID.find("li").css({"position":"absolute","left":0,"top":0});
							}
				_btnBox.empty();
				for(i=0;i<ID_liLen;i++){
					_btnBox.append("<span></span>");
					};
				_btnBox.find("span").eq(0).addClass("cur");

				if(way == false){
						_btn_left.hide();
						_btn_right.hide();
						_btnBox.hide();
						}
				
				function numFirstFun(){
					var _num = _ID.find("li:first").attr("data-num");
					document.getElementById("total123").innerHTML = _num;
				} 
				
				function Carousel(){
					
					if(way == false){
						no_way++;
						
						if(direction == "left"){
							_ID.find("ul").css({"left":-no_way});	
							no_wayGet = parseInt(_ID.find("ul").css("left"));
							if(no_wayGet == -moveLengh){
								no_way = 0
								_ID.find("li:first").insertAfter(_ID.find("li:last"));
								_ID.find("ul").css({"left":0});
								}
						}

						if(direction == "right"){
								
							no_wayGet = parseInt(_ID.find("ul").css("left"));
							if(no_wayGet == 0){
								no_way = -moveLengh
								_ID.find("li:last").insertBefore(_ID.find("li:first"));
								_ID.find("ul").css({"left":0});
								}
							_ID.find("ul").css({"left":no_way});
						}
						
						if(direction == "top"){
							_ID.find("ul").css({"top":-no_way});	
							no_wayGet = parseInt(_ID.find("ul").css("top"));
							if(no_wayGet == -moveLengh){
								no_way = 0
								_ID.find("li:first").insertAfter(_ID.find("li:last"));
								_ID.find("ul").css({"top":0});
								}
						}
						
						if(direction == "bottom"){
								
							no_wayGet = parseInt(_ID.find("ul").css("top"));
							if(no_wayGet == 0){
								no_way = -moveLengh
								_ID.find("li:last").insertBefore(_ID.find("li:first"));
								_ID.find("ul").css({"top":0});
								}
							_ID.find("ul").css({"top":no_way});
						}
						
						
						}else if(way == true){

						if(direction == "left"){
							_ID.find("ul").animate({left:-moveLengh},speed,function(){
								_ID.find("li:first").insertAfter(_ID.find("li:last"));
								_ID.find("ul").css({"left":0});
								numFirstFun();
								});	
							if(jsq<ID_liLen-1){
								jsq++;
								_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
								}else{
									jsq = 0;
									_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
									}
							
						}
						
						if(direction == "right"){
							_ID.find("li:last").insertBefore(_ID.find("li:first"));
							_ID.find("ul").css({"left":-moveLengh});
							_ID.find("ul").stop().animate({left:0},speed);
							if(jsq>0){
								jsq--;
								_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
								}else{
									jsq = ID_liLen-1;
									_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
									}
							
						}
						
						if(direction == "top"){
							_ID.find("ul").animate({top:-moveLengh},speed,function(){
								_ID.find("li:first").insertAfter(_ID.find("li:last"));
								_ID.find("ul").css({"top":0});
								numFirstFun();
								});	
						}
						
						if(direction == "bottom"){
							_ID.find("li:last").insertBefore(_ID.find("li:first"));
							_ID.find("ul").css({"top":-moveLengh});
							_ID.find("ul").stop().animate({top:0},speed);
								
						}
						if(direction == "fade"){
							
							if(fade<ID_liLen-1){
								fade++;
								}else{fade = 0}
							_ID.find("li").eq(fade).fadeIn(speed).siblings().fadeOut(speed);
							_btnBox.find("span").eq(fade).addClass("cur").siblings().removeClass("cur");
							
						}
					
					}
					numFirstFun();
					}
					
					
				if(Car == true){
						
					if(ID_liLen>number){
						timer =	setInterval(Carousel,Interval);
						}else{
							clearInterval(timer);
							_btn_left.hide();
							_btn_right.hide();
							_btnBox.hide();
							}
					}else{
						clearInterval(timer);
						}
				_ID.find("li").hover(function(){
					clearInterval(timer);
					},function(){
						if(Car == true){
							if(ID_liLen>number){
								timer =	setInterval(Carousel,Interval);
								}else{
									clearInterval(timer);
									_btn_left.hide();
									_btn_right.hide();
									_btnBox.hide();
									}
							}else{
								clearInterval(timer);
								}
						});
					
					
				_btn_right.hover(function(){
					clearInterval(timer);
					},function(){
						if(Car == true){
							if(ID_liLen>number){
								timer =	setInterval(Carousel,Interval);
								}else{
									clearInterval(timer);
									_btn_left.hide();
									_btn_right.hide();
									_btnBox.hide();
									}
							}else{
								clearInterval(timer);
								}
						
						}).click(function(){
							if(new Date - new_time>500){
								new_time = new Date;
							
							if(direction == "left" || direction == "right"){
								_ID.find("ul").animate({left:-moveLengh},speed,function(){
									_ID.find("li:first").insertAfter(_ID.find("li:last"));
									_ID.find("ul").css({"left":0});
									numFirstFun();
									});	
								}
							
							
							if(direction == "top" || direction == "bottom"){
								_ID.find("ul").animate({top:-moveLengh},speed,function(){
									_ID.find("li:first").insertAfter(_ID.find("li:last"));
									_ID.find("ul").css({"top":0});
									numFirstFun();
									});	
								}
							if(direction == "fade"){
							
							if(fade>0){
								fade--;
								}else{fade = ID_liLen-1}
									_ID.find("li").stop(true,true).eq(fade).fadeIn(speed).siblings().fadeOut(speed);
									
								}
							if(jsq<ID_liLen-1){
								jsq++;
								_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
								}else{
									jsq = 0;
									_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
									};
							
								
								}else{};
								numFirstFun();
							});
				_btn_left.hover(function(){
					clearInterval(timer);
					},function(){
						if(Car == true){
							if(ID_liLen>number){
								timer =	setInterval(Carousel,Interval);
								}else{
									clearInterval(timer);
									_btn_left.hide();
									_btn_right.hide();
									_btnBox.hide();
									}
							}else{
								clearInterval(timer);
								}
						}).click(function(){
							if(new Date - new_time>500){
								new_time = new Date;

							if(direction == "left" || direction == "right"){
								_ID.find("li:last").insertBefore(_ID.find("li:first"));
								_ID.find("ul").css({"left":-moveLengh});
								_ID.find("ul").stop().animate({left:0},speed);
								}
							
							if(direction == "top" || direction == "bottom"){
								_ID.find("li:last").insertBefore(_ID.find("li:first"));
								_ID.find("ul").css({"top":-moveLengh});
								_ID.find("ul").stop().animate({top:0},speed);
									
								}
							if(direction == "fade"){
							
							if(fade<ID_liLen-1){
								fade++;
								}else{fade = 0}
									_ID.find("li").stop(true,true).eq(fade).fadeIn(speed).siblings().fadeOut(speed);
									
								}
							if(jsq>0){
								jsq--;
								_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
								}else{
									jsq = ID_liLen-1;
									_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
									};
								}else{};
								numFirstFun();
							});
					
				_btnBox.find("span").hover(function(){
					clearInterval(timer);

					},function(){
						if(Car == true){
							if(ID_liLen>number){
								timer =	setInterval(Carousel,Interval);
								}else{
									clearInterval(timer);
									_btn_left.hide();
									_btn_right.hide();
									_btnBox.hide();
									}
							}else{
								clearInterval(timer);
								}
						}).click(function(){
							if(new Date - new_time>500){
								new_time = new Date;
							cbtmBtn = $(this).index();
							$(this).addClass("cur").siblings().removeClass("cur");
							if(direction == "fade"){
											_ID.find("li").eq(cbtmBtn).fadeIn(speed).siblings().fadeOut(speed);
										}else{
							if(cbtmBtn>jsq){
								cj =cbtmBtn - jsq;
								jsq = cbtmBtn;
								
								_ID.find("ul").stop().animate({left:-moveLengh*cj},speed,function(){
									for(i=0;i<cj;i++){
										_ID.find("ul").css({"left":0})
										_ID.find("li:first").insertAfter(_ID.find("li:last"));
									};
									});
								}else{
									cj = jsq - cbtmBtn;
									jsq = cbtmBtn;
									_ID.find("ul").css({"left":-moveLengh*cj});
									for(i=0;i<cj;i++){
										_ID.find("ul").stop().animate({left:0},speed);
										_ID.find("li:last").insertBefore(_ID.find("li:first"));
										};
									};
									};
								}else{};
							});
}// JavaScript Document

// 首页第一栏目滚动
function specialMove(boxID,btn_left,btn_right,btnBox,Car,direction,way,moveLengh,speed,Interval,number){
	var        _ID   = $("#"+boxID+"");
	var  _btn_left   = $("#"+btn_left+"");
	var _btn_right   = $("#"+btn_right+"");
	var    _btnBox   = $("#"+btnBox+"");
	var        jsq   = 0
	var      timer     ;
	var         cj     ;
	var     no_way   = 0;
	var  no_wayGet   = 0;
	var       fade   = 0;
	var   new_time   = new Date;
	
	var ID_liLen , ID_liheight , cbtmBtn ;
	ID_liLen    = _ID.find("li").length;
	ID_liheight = _ID.find("li").innerHeight();
	
	if(direction == "left" || direction == "right"){
		_ID.find("ul").width(ID_liLen*moveLengh);
		}else if(direction == "top" || direction == "bottom"){
			_ID.find("ul").height(ID_liLen*moveLengh);
			_btnBox.hide()
			}else if(direction == "fade"){
				_ID.find("ul").width(moveLengh).height(ID_liheight);
				_ID.find("li").eq(0).show().siblings().hide();
				_ID.find("li").css({"position":"absolute","left":0,"top":0});
				}
	_btnBox.empty();
	for(i=0;i<ID_liLen;i++){
		_btnBox.append("<span></span>");
		};
	_btnBox.find("span").eq(0).addClass("cur");

	if(way == false){
			_btn_left.hide();
			_btn_right.hide();
			_btnBox.hide();
			}
	
	
	function Carousel(){
		if(way == false){
			no_way++;
			
			if(direction == "left"){
				_ID.find("ul").css({"left":-no_way});	
				no_wayGet = parseInt(_ID.find("ul").css("left"));
				if(no_wayGet == -moveLengh){
					no_way = 0
					_ID.find("li:first").insertAfter(_ID.find("li:last"));
					_ID.find("ul").css({"left":0});
					}
			}

			if(direction == "right"){
					
				no_wayGet = parseInt(_ID.find("ul").css("left"));
				if(no_wayGet == 0){
					no_way = -moveLengh
					_ID.find("li:last").insertBefore(_ID.find("li:first"));
					_ID.find("ul").css({"left":0});
					}
				_ID.find("ul").css({"left":no_way});
			}
			
			if(direction == "top"){
				_ID.find("ul").css({"top":-no_way});	
				no_wayGet = parseInt(_ID.find("ul").css("top"));
				if(no_wayGet == -moveLengh){
					no_way = 0
					_ID.find("li:first").insertAfter(_ID.find("li:last"));
					_ID.find("ul").css({"top":0});
					}
			}
			
			if(direction == "bottom"){
					
				no_wayGet = parseInt(_ID.find("ul").css("top"));
				if(no_wayGet == 0){
					no_way = -moveLengh
					_ID.find("li:last").insertBefore(_ID.find("li:first"));
					_ID.find("ul").css({"top":0});
					}
				_ID.find("ul").css({"top":no_way});
			}
			
			
			}else if(way == true){

			if(direction == "left"){
				_ID.find("ul").animate({left:-moveLengh},speed,function(){
					_ID.find("li:first").insertAfter(_ID.find("li:last"));
					_ID.find("ul").css({"left":0});
					});	
				if(jsq<ID_liLen-1){
					jsq++;
					_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
					}else{
						jsq = 0;
						_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
						}
				
			}
			
			if(direction == "right"){
				_ID.find("li:last").insertBefore(_ID.find("li:first"));
				_ID.find("ul").css({"left":-moveLengh});
				_ID.find("ul").stop().animate({left:0},speed);
				if(jsq>0){
					jsq--;
					_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
					}else{
						jsq = ID_liLen-1;
						_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
						}
				
			}
			
			if(direction == "top"){
				_ID.find("ul").animate({top:-moveLengh},speed,function(){
					_ID.find("li:first").insertAfter(_ID.find("li:last"));
					_ID.find("ul").css({"top":0});
					});	
			}
			
			if(direction == "bottom"){
				_ID.find("li:last").insertBefore(_ID.find("li:first"));
				_ID.find("ul").css({"top":-moveLengh});
				_ID.find("ul").stop().animate({top:0},speed);
					
			}
			if(direction == "fade"){
				
				if(fade<ID_liLen-1){
					fade++;
					}else{fade = 0}
				_ID.find("li").eq(fade).fadeIn(speed).siblings().fadeOut(speed);
				_btnBox.find("span").eq(fade).addClass("cur").siblings().removeClass("cur");
				
			}
		
		}
		}
		
		
	if(Car == true){
			
		if(ID_liLen>number){
			timer =	setInterval(Carousel,Interval);
			}else{
				clearInterval(timer);
				_btn_left.hide();
				_btn_right.hide();
				_btnBox.hide();
				}
		}else{
			clearInterval(timer);
			}
	_ID.find("li").hover(function(){
		clearInterval(timer);
		},function(){
			if(Car == true){
				if(ID_liLen>number){
					timer =	setInterval(Carousel,Interval);
					}else{
						clearInterval(timer);
						_btn_left.hide();
						_btn_right.hide();
						_btnBox.hide();
						}
				}else{
					clearInterval(timer);
					}
			});
		
		
	_btn_right.hover(function(){
		clearInterval(timer);
		},function(){
			if(Car == true){
				if(ID_liLen>number){
					timer =	setInterval(Carousel,Interval);
					}else{
						clearInterval(timer);
						_btn_left.hide();
						_btn_right.hide();
						_btnBox.hide();
						}
				}else{
					clearInterval(timer);
					}
			
			}).click(function(){
				if(new Date - new_time>500){
					new_time = new Date;
				
				if(direction == "left" || direction == "right"){
					_ID.find("ul").animate({left:-moveLengh},speed,function(){
						_ID.find("li:first").insertAfter(_ID.find("li:last"));
						_ID.find("ul").css({"left":0});
						});	
					}
				
				
				if(direction == "top" || direction == "bottom"){
					_ID.find("ul").animate({top:-moveLengh},speed,function(){
						_ID.find("li:first").insertAfter(_ID.find("li:last"));
						_ID.find("ul").css({"top":0});
						});	
					}
				if(direction == "fade"){
				
				if(fade>0){
					fade--;
					}else{fade = ID_liLen-1}
						_ID.find("li").stop(true,true).eq(fade).fadeIn(speed).siblings().fadeOut(speed);
						
					}
				if(jsq<ID_liLen-1){
					jsq++;
					_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
					}else{
						jsq = 0;
						_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
						};
				
					
					}else{};
				});
	_btn_left.hover(function(){
		clearInterval(timer);
		},function(){
			if(Car == true){
				if(ID_liLen>number){
					timer =	setInterval(Carousel,Interval);
					}else{
						clearInterval(timer);
						_btn_left.hide();
						_btn_right.hide();
						_btnBox.hide();
						}
				}else{
					clearInterval(timer);
					}
			}).click(function(){
				if(new Date - new_time>500){
					new_time = new Date;

				if(direction == "left" || direction == "right"){
					_ID.find("li:last").insertBefore(_ID.find("li:first"));
					_ID.find("ul").css({"left":-moveLengh});
					_ID.find("ul").stop().animate({left:0},speed);
					}
				
				if(direction == "top" || direction == "bottom"){
					_ID.find("li:last").insertBefore(_ID.find("li:first"));
					_ID.find("ul").css({"top":-moveLengh});
					_ID.find("ul").stop().animate({top:0},speed);
						
					}
				if(direction == "fade"){
				
				if(fade<ID_liLen-1){
					fade++;
					}else{fade = 0}
						_ID.find("li").stop(true,true).eq(fade).fadeIn(speed).siblings().fadeOut(speed);
						
					}
				if(jsq>0){
					jsq--;
					_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
					}else{
						jsq = ID_liLen-1;
						_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
						};
					}else{};
				});
		
	_btnBox.find("span").hover(function(){
		clearInterval(timer);

		},function(){
			if(Car == true){
				if(ID_liLen>number){
					timer =	setInterval(Carousel,Interval);
					}else{
						clearInterval(timer);
						_btn_left.hide();
						_btn_right.hide();
						_btnBox.hide();
						}
				}else{
					clearInterval(timer);
					}
			}).click(function(){
				if(new Date - new_time>500){
					new_time = new Date;
				cbtmBtn = $(this).index();
				$(this).addClass("cur").siblings().removeClass("cur");
				if(direction == "fade"){
								_ID.find("li").eq(cbtmBtn).fadeIn(speed).siblings().fadeOut(speed);
							}else{
				if(cbtmBtn>jsq){
					cj =cbtmBtn - jsq;
					jsq = cbtmBtn;
					
					_ID.find("ul").stop().animate({left:-moveLengh*cj},speed,function(){
						for(i=0;i<cj;i++){
							_ID.find("ul").css({"left":0})
							_ID.find("li:first").insertAfter(_ID.find("li:last"));
							};
						});
					}else{
						cj = jsq - cbtmBtn;
						jsq = cbtmBtn;
						_ID.find("ul").css({"left":-moveLengh*cj});
						for(i=0;i<cj;i++){
							_ID.find("ul").stop().animate({left:0},speed);
							_ID.find("li:last").insertBefore(_ID.find("li:first"));
							};
						};
						};
					}else{};
				});
}// JavaScript Document

function hgLbMove(boxID,btn_left,btn_right,btnBox,Car,direction,way,moveLengh,speed,Interval,number){
	var        _ID   = $("#"+boxID+"");
	var  _btn_left   = $("#"+btn_left+"");
	var _btn_right   = $("#"+btn_right+"");
	var    _btnBox   = $("#"+btnBox+"");
	var        jsq   = 0
	var      timer     ;
	var         cj     ;
	var     no_way   = 0;
	var  no_wayGet   = 0;
	var       fade   = 0;
	var   new_time   = new Date;
	
	var ID_liLen , ID_liheight , cbtmBtn ;
	ID_liLen    = _ID.find("li").length;
	ID_liheight = _ID.find("li").innerHeight();
	
	if(direction == "left" || direction == "right"){
		_ID.find("ul").width(ID_liLen*moveLengh);
		}else if(direction == "top" || direction == "bottom"){
			_ID.find("ul").height(ID_liLen*moveLengh);
			_btnBox.hide()
			}else if(direction == "fade"){
				_ID.find("ul").width(moveLengh).height(ID_liheight);
				_ID.find("li").eq(0).show().siblings().hide();
				_ID.find("li").css({"position":"absolute","left":0,"top":0});
				}
	_btnBox.empty();
	for(i=0;i<ID_liLen;i++){
		_btnBox.append("<span></span>");
		};
	_btnBox.find("span").eq(0).addClass("cur");

	if(way == false){
			_btn_left.hide();
			_btn_right.hide();
			_btnBox.hide();
			}
	
	
	function Carousel(){
		if(way == false){
			no_way++;
			
			if(direction == "left"){
				_ID.find("ul").css({"left":-no_way});	
				no_wayGet = parseInt(_ID.find("ul").css("left"));
				if(no_wayGet == -moveLengh){
					no_way = 0
					_ID.find("li:first").insertAfter(_ID.find("li:last"));
					_ID.find("ul").css({"left":0});
					}
			}

			if(direction == "right"){
					
				no_wayGet = parseInt(_ID.find("ul").css("left"));
				if(no_wayGet == 0){
					no_way = -moveLengh
					_ID.find("li:last").insertBefore(_ID.find("li:first"));
					_ID.find("ul").css({"left":0});
					}
				_ID.find("ul").css({"left":no_way});
			}
			
			if(direction == "top"){
				_ID.find("ul").css({"top":-no_way});	
				no_wayGet = parseInt(_ID.find("ul").css("top"));
				if(no_wayGet == -moveLengh){
					no_way = 0
					_ID.find("li:first").insertAfter(_ID.find("li:last"));
					_ID.find("ul").css({"top":0});
					}
			}
			
			if(direction == "bottom"){
					
				no_wayGet = parseInt(_ID.find("ul").css("top"));
				if(no_wayGet == 0){
					no_way = -moveLengh
					_ID.find("li:last").insertBefore(_ID.find("li:first"));
					_ID.find("ul").css({"top":0});
					}
				_ID.find("ul").css({"top":no_way});
			}
			
			
			}else if(way == true){

			if(direction == "left"){
				_ID.find("ul").animate({left:-moveLengh},speed,function(){
					_ID.find("li:first").insertAfter(_ID.find("li:last"));
					_ID.find("ul").css({"left":0});
					});	
				if(jsq<ID_liLen-1){
					jsq++;
					_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
					}else{
						jsq = 0;
						_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
						}
				
			}
			
			if(direction == "right"){
				_ID.find("li:last").insertBefore(_ID.find("li:first"));
				_ID.find("ul").css({"left":-moveLengh});
				_ID.find("ul").stop().animate({left:0},speed);
				if(jsq>0){
					jsq--;
					_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
					}else{
						jsq = ID_liLen-1;
						_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
						}
				
			}
			
			if(direction == "top"){
				_ID.find("ul").animate({top:-moveLengh},speed,function(){
					_ID.find("li:first").insertAfter(_ID.find("li:last"));
					_ID.find("ul").css({"top":0});
					});	
			}
			
			if(direction == "bottom"){
				_ID.find("li:last").insertBefore(_ID.find("li:first"));
				_ID.find("ul").css({"top":-moveLengh});
				_ID.find("ul").stop().animate({top:0},speed);
					
			}
			if(direction == "fade"){
				
				if(fade<ID_liLen-1){
					fade++;
					}else{fade = 0}
				_ID.find("li").eq(fade).fadeIn(speed).siblings().fadeOut(speed);
				_btnBox.find("span").eq(fade).addClass("cur").siblings().removeClass("cur");
				
			}
		
		}
		}
		
		
	if(Car == true){
			
		if(ID_liLen>number){
			timer =	setInterval(Carousel,Interval);
			}else{
				clearInterval(timer);
				_btn_left.hide();
				_btn_right.hide();
				_btnBox.hide();
				}
		}else{
			clearInterval(timer);
			}
	_ID.find("li").hover(function(){
		clearInterval(timer);
		},function(){
			if(Car == true){
				if(ID_liLen>number){
					timer =	setInterval(Carousel,Interval);
					}else{
						clearInterval(timer);
						_btn_left.hide();
						_btn_right.hide();
						_btnBox.hide();
						}
				}else{
					clearInterval(timer);
					}
			});
		
		
	_btn_right.hover(function(){
		clearInterval(timer);
		},function(){
			if(Car == true){
				if(ID_liLen>number){
					timer =	setInterval(Carousel,Interval);
					}else{
						clearInterval(timer);
						_btn_left.hide();
						_btn_right.hide();
						_btnBox.hide();
						}
				}else{
					clearInterval(timer);
					}
			
			}).click(function(){
				if(new Date - new_time>500){
					new_time = new Date;
				
				if(direction == "left" || direction == "right"){
					_ID.find("ul").animate({left:-moveLengh},speed,function(){
						_ID.find("li:first").insertAfter(_ID.find("li:last"));
						_ID.find("ul").css({"left":0});
						});	
					}
				
				
				if(direction == "top" || direction == "bottom"){
					_ID.find("ul").animate({top:-moveLengh},speed,function(){
						_ID.find("li:first").insertAfter(_ID.find("li:last"));
						_ID.find("ul").css({"top":0});
						});	
					}
				if(direction == "fade"){
				
				if(fade>0){
					fade--;
					}else{fade = ID_liLen-1}
						_ID.find("li").stop(true,true).eq(fade).fadeIn(speed).siblings().fadeOut(speed);
						
					}
				if(jsq<ID_liLen-1){
					jsq++;
					_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
					}else{
						jsq = 0;
						_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
						};
				
					
					}else{};
				});
	_btn_left.hover(function(){
		clearInterval(timer);
		},function(){
			if(Car == true){
				if(ID_liLen>number){
					timer =	setInterval(Carousel,Interval);
					}else{
						clearInterval(timer);
						_btn_left.hide();
						_btn_right.hide();
						_btnBox.hide();
						}
				}else{
					clearInterval(timer);
					}
			}).click(function(){
				if(new Date - new_time>500){
					new_time = new Date;

				if(direction == "left" || direction == "right"){
					_ID.find("li:last").insertBefore(_ID.find("li:first"));
					_ID.find("ul").css({"left":-moveLengh});
					_ID.find("ul").stop().animate({left:0},speed);
					}
				
				if(direction == "top" || direction == "bottom"){
					_ID.find("li:last").insertBefore(_ID.find("li:first"));
					_ID.find("ul").css({"top":-moveLengh});
					_ID.find("ul").stop().animate({top:0},speed);
						
					}
				if(direction == "fade"){
				
				if(fade<ID_liLen-1){
					fade++;
					}else{fade = 0}
						_ID.find("li").stop(true,true).eq(fade).fadeIn(speed).siblings().fadeOut(speed);
						
					}
				if(jsq>0){
					jsq--;
					_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
					}else{
						jsq = ID_liLen-1;
						_btnBox.find("span").eq(jsq).addClass("cur").siblings().removeClass("cur");
						};
					}else{};
				});
		
	_btnBox.find("span").hover(function(){
		clearInterval(timer);

		},function(){
			if(Car == true){
				if(ID_liLen>number){
					timer =	setInterval(Carousel,Interval);
					}else{
						clearInterval(timer);
						_btn_left.hide();
						_btn_right.hide();
						_btnBox.hide();
						}
				}else{
					clearInterval(timer);
					}
			}).click(function(){
				if(new Date - new_time>500){
					new_time = new Date;
				cbtmBtn = $(this).index();
				$(this).addClass("cur").siblings().removeClass("cur");
				if(direction == "fade"){
								_ID.find("li").eq(cbtmBtn).fadeIn(speed).siblings().fadeOut(speed);
							}else{
				if(cbtmBtn>jsq){
					cj =cbtmBtn - jsq;
					jsq = cbtmBtn;
					
					_ID.find("ul").stop().animate({left:-moveLengh*cj},speed,function(){
						for(i=0;i<cj;i++){
							_ID.find("ul").css({"left":0})
							_ID.find("li:first").insertAfter(_ID.find("li:last"));
							};
						});
					}else{
						cj = jsq - cbtmBtn;
						jsq = cbtmBtn;
						_ID.find("ul").css({"left":-moveLengh*cj});
						for(i=0;i<cj;i++){
							_ID.find("ul").stop().animate({left:0},speed);
							_ID.find("li:last").insertBefore(_ID.find("li:first"));
							};
						};
						};
					}else{};
				});
}// JavaScript Document


