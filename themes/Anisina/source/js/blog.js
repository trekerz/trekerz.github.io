/*!
 * Clean Blog v1.0.0 (http://startbootstrap.com)
 * Copyright 2015 Start Bootstrap
 * Licensed under Apache 2.0 (https://github.com/IronSummitMedia/startbootstrap/blob/gh-pages/LICENSE)
 */

// Tooltip Init
$(function() {
    $("[data-toggle='tooltip']").tooltip();
});


// make all images responsive
/*
 * Unuse by Hux
 * actually only Portfolio-Pages can't use it and only post-img need it.
 * so I modify the _layout/post and CSS to make post-img responsive!
 */
// $(function() {
//  $("img").addClass("img-responsive");
// });

// responsive tables
$(document).ready(function() {
    $("table").wrap("<div class='table-responsive'></div>");
    $("table").addClass("table");
});

// responsive embed videos
$(document).ready(function () {
    $('iframe[src*="youtube.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="youtube.com"]').addClass('embed-responsive-item');
    $('iframe[src*="vimeo.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="vimeo.com"]').addClass('embed-responsive-item');
});

// 判断是不是博文页面
function isPages(attr){
    var currentBoolean = document.querySelector('.navbar.navbar-custom').getAttribute(attr);
    if(currentBoolean === 'true'){return true;}
    return false;
}
/*
    滚动函数
    接收三个参数,
        1 接收一个DOM对象
        2 给目标对象切换class
        3 触发的高度 (可选项,如果不指定高度,会将DOM的高度作为触发高度)
*/
function scrollCheck(scrollTarget, toggleClass, scrollHeight){
    document.addEventListener('scroll',function(){
    var currentTop = window.pageYOffset;
        currentTop > (scrollHeight||scrollTarget.clientHeight)
        ?scrollTarget.classList.add(toggleClass)
        :scrollTarget.classList.remove(toggleClass)
    })
}

//主页
(function(){
    if(!isPages('data-ispost')){
        var navbar = document.querySelector('.navbar.navbar-custom')
        navbar.classList.add('is-fixed');
    }

})();

/*
* 先获取H1标签
* 然后滚动出现固定导航条后
* 将其内容放到上面居中显示
* */

/*
    博文页面
*/
(function(){
    if (isPages('data-ispost')){
        var navbar = document.querySelector('.navbar-custom');
        var introHeader = document.querySelector('.intro-header').offsetHeight;
        var introHeader = introHeader > 497 ? introHeader : 400;
        var toc = document.querySelector('.toc-wrap');
        var postTitle = document.querySelector('.post-title-haojen');
        scrollCheck(toc,'toc-fixed',introHeader-60);
        scrollCheck(navbar,'is-fixed');
        scrollCheck(postTitle,'post-title-fixed',introHeader-60);
    }
})();

(function () {
    var navTop = document.querySelector('#nav-top');
    navTop.ondblclick = function () {
        $('body').animate({
            scrollTop: 0
        }, 500)
    }
})();


/*
    171116添加：首页图特效
 */
$('.post-preview:first').on('mousemove', function(e){
    // 先判断是否是在首页
    if($(document).attr('title') == 'Trekerz\'s blog'){
        var offset = $('.post-preview:first').offset()

        var x = e.pageX - offset.left
        var y = e.pageY - offset.top


        var centerX = $('.post-preview:first').outerWidth() /2
        var centerY = $('.post-preview:first').outerHeight() /2 

        var deltaX = x - centerX
        var deltaY = y - centerY

        var percentX = deltaX / centerX
        var percentY = deltaY / centerY

        var deg = 3

        $('.post-preview:first').css({
            transform: 'perspective(1000px) rotateX('+ deg*-percentY + 'deg)'+
            ' rotateY('+ deg*percentX +'deg)',
            boxShadow: -deltaX*0.02+'px '+ -deltaY*0.02 +'px 20px #AAAAAA'
        })
    }
})

$('.post-preview:first').on('mouseleave', function(){
    // 先判断是否是在首页
    if($(document).attr('title') == 'Trekerz\'s blog'){
        $('.post-preview:first').css({
            transform: '',
            boxShadow: '0px 0px 20px #AAAAAA'
        })
    }
})