function clickPic1 () {
	var a = document.getElementById("imgNum1");//此处不知为何无法设置全局变量
	var b = document.getElementById("imgNum2");
	document.getElementsByClassName("imgBox")[0].style.left="0px";
	a.style.backgroundColor="#FF7700";
	b.style.backgroundColor="#FFF";
}

function clickPic2 () {
	var a = document.getElementById("imgNum1");
	var b = document.getElementById("imgNum2");
	document.getElementsByClassName("imgBox")[0].style.left="-810px";
	a.style.backgroundColor="#FFF";
	b.style.backgroundColor="#FF7700";
}