$(document).ready(function() {
    if (Boolean(sessionStorage.getItem('user_id'))) {
        $("#login_box").css('display', 'none');

        let id = sessionStorage.getItem('user_id');
        let temp_html = `<div id='session' class="session">'${id}'님 환영합니다</div>`;
        $("#left_menu").prepend(temp_html);
        $("#session").css('visibility', 'visible');
        $("#main_img").css('width', '1200px');
        $("#main_img").css('height', '700px');
    }
});
