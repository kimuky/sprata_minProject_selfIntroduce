$(document).ready(function() {
    
    // 세션 user_id가 가져와지면
    if (Boolean(sessionStorage.getItem('user_id'))) {
        $("#login_box").css('display', 'none');

        // 왼쪽 메뉴에 ''님 환영합니다
        let id = sessionStorage.getItem('user_id');
        let temp_html = `<div id='session' class="session">'${id}'님 환영합니다</div>`;
        let logout = `<div id='logout' class="logout"><button type="button" class="btn btn-outline-dark btn-sm">Logout</button></div>`;
        $("#left_menu").prepend(logout);
        $("#left_menu").prepend(temp_html);
        $("#session").css('visibility', 'visible');
        $("#join_button").css('disabled', 'false');

        // 로그아웃을 눌렀을 때,
        $("#logout").click(async function () {
            sessionStorage.clear();
            window.location.reload();
            alert('로그아웃 되었습니다.')
         })

        // 이미지 크게
        $("#main_img").css('width', '1200px');
        $("#main_img").css('height', '700px');
    } 
});
