const pages = {
    'index.html': 'home',
    'team.html': 'team',
    'member.html': 'member'
};

// 페이지에 따른 메뉴 파란색
$(document).ready(function () {
    const currentFileName = window.location.pathname.split('/').pop();
    let cur_page = pages[currentFileName]
    $("#" + cur_page).css('color', '#4D7DF3')

});
