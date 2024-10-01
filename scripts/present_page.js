const pages = {
    'index.html': 'home',
    'team.html': 'team',
    'member.html' : 'member'
};


$(document).ready(function() {
    const currentFileName = window.location.pathname.split('/').pop();
    // console.log(currentFileName)
    let cur_page = pages[currentFileName]

            $("#"+cur_page).css('color', '#4D7DF3')


});
