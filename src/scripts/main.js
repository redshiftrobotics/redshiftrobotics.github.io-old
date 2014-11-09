function ResizeButtons()
{
	$(".scroll .imageanchor").css({"height" : window.innerHeight / 2.2});
	$(".scroll .imageanchor").css({"width" : window.innerWidth / 2.2});
}

$(document).ready(function()
{
	ResizeButtons();
	$(window).resize(ResizeButtons());
});
