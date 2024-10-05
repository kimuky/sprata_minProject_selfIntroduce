import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, updateDoc, deleteField, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// 설정
const firebaseConfig = {
    apiKey: "AIzaSyC_OD-r4PxEoS4nNq6MCWn5_9pU_ZCRfUc",
    authDomain: "spartaprojectintroduce.firebaseapp.com",
    projectId: "spartaprojectintroduce",
    storageBucket: "spartaprojectintroduce.appspot.com",
    messagingSenderId: "3323501194",
    appId: "1:3323501194:web:e162a03ff0d7da51a3ab73"
};

// 기초
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const db_img = getStorage(app);

// 유저 전부 조회 (join 등록한 사람)
const q_select_from_joinUser = query(collection(db, "users"), where("confirm", "==", '1'),);


// 유저 전부 조회 (join 등록한 사람) "Join"으로 등록할 때의 시간정보로 오름차순
const q_select_from_joinUser_where_date_asc = query(collection(db, "users"), where("confirm", "==", '1'), orderBy("date", "asc"));

// 나 찾기
const q_find_me = query(collection(db, "users"), where("id", "==", sessionStorage.getItem('user_id')));


// 동적으로 profile 생성
let docs = await getDocs(q_select_from_joinUser_where_date_asc);
docs.forEach((doc) => {
    let row = doc.data();

    if (row['style'] == '') { return }
    else {
        let id = row['id']

        // 여기서 session id 와 들고온 id를 비교하며 세션아이디(현재 로그인한 아이디)가 있으면 현재 로그인한 사용자 페이지에서 join 버튼을 hidden으로~
        if (id == sessionStorage.getItem('user_id')) {
            $("#join_button").css('visibility', 'hidden')
        }


        let name = row['name']
        let mbti = row['mbti']
        let style = row['style']
        let link = row['link']
        let img = row['url']

        let temp_html = `                        
                <div data-id='${id}' class="col" id='member_card'>
                    <div  class="card h-100">
                    <div class='profile_card_div'> 
                        <div class='profile_circle'>
                        <img id='profile_img' src="${img}" class="card-img-top" alt="...">
                        </div>
                    </div> 
                        <div class="card-body">
                            <h5 class="card-title">${name}</h5>
                            <p class="card-text">${mbti}</p>
                        </div>
                        <div class="card-footer">
                            <small id='ellipsis_link' class="text-body-secondary"><p>${link}</p></small>
                        </div>
                    </div>
                </div>`
        $('#card').append(temp_html);
    }

})

// 조인 버튼을 눌렀을 시,
$("#join_button").click(async function () {

    // 세션에 user_id가 있을 때 == 로그인했는지 판별
    if (Boolean(sessionStorage.getItem('user_id'))) {
        $('#modal_container').css('display', 'flex')
        $('#card').css('visibility', 'hidden')

        // join 모달창 안에 join 버튼을 눌렀을 때,
        $("#modal_input_join").click(async function () {
            let name = $("#modal_input_name").val()
            let mbti = $("#modal_input_mbti").val()
            let style = $("#modal_input_style").val()
            let link = $("#modal_input_link").val()
            let short = $("#modal_input_short").val()
            let img_input = $("#modal_input_img")[0]
            let imgFile = img_input.files[0]

            // 빈칸 없는지 확인
            if (name == '' || mbti == '' || style == '' || link == '' || short == '' || !imgFile) {
                alert('빈 칸이 있습니다!')
            } else {

                // 자신의 uid 찾기 = document_id 찾기
                const q_find_my_uid = query(collection(db, "users"), where("id", "==", sessionStorage.getItem('user_id')));

                // getDocs 함수에 위에 정의한 쿼리를 적용해서 모든 문서들을 가져온다.
                const querySnapshot = await getDocs(q_find_my_uid);
                let find_uid
                querySnapshot.forEach((doc) => {
                    find_uid = doc.id
                });

                // 프로필 이미지를 firestorage에 업로드
                const profile_img_ref = ref(db_img, `profile/${sessionStorage.getItem('user_id')}`);
                await uploadBytes(profile_img_ref, imgFile).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                })

                // 유저 정보에 name,mbti, style, short, confoirm, date 추가
                // confirm = 0 은 로그인만 한 상태, confirm =1은 로그인 + 프로필 등록
                await updateDoc(doc(db, "users", find_uid), {
                    name: name,
                    mbti: mbti,
                    style: style,
                    link: link,
                    short: short,
                    confirm: '1',
                    date: serverTimestamp()
                });

                // 모달창 안 input값 초기화
                name = $("#modal_input_name").val('')
                mbti = $("#modal_input_mbti").val('')
                style = $("#modal_input_style").val('')
                link = $("#modal_input_link").val('')
                short = $("#modal_input_short").val('')
                img_input = $("#modal_input_img").val('')

                // 지금 로그인한 사용자 id를 세션스토리지에서 받아와 url을 다운로드해서 user에 url 추가
                const imagesRef = ref(db_img, `profile/${sessionStorage.getItem('user_id')}`)
                const url = await getDownloadURL(imagesRef)
                await updateDoc(doc(db, "users", find_uid), {
                    url: url
                });

                //  모달창 없애고 카드 보이게, 윈도우 리로딩
                $('#modal_container').css('display', 'none')
                $('#card').css('visibility', 'visible')
                alert('프로필이 정상적으로 저장되었습니다.')
                window.location.reload()
            }
        })
    } else {
        // 로그인 안하고 눌렀을 때,
        $('#modal_container').css('display', 'none')
        $('#card').css('visibility', 'visible')
        alert('로그인이 필요합니다')
    }
})

// 각 카드를 클릭했을 때,
$('#card').on('click', '#member_card', function () {
    const profile_id = $(this).data('id')
    handleClick(profile_id)
});

async function handleClick(profile_id) {

    // 해당 프로필의 아이디로 유저 데이터 받아옴
    let docs = await getDocs(q_select_from_joinUser);
    let name, mbti, style, link, img = ''
    docs.forEach((doc) => {
        let row = doc.data();
        let id = row['id']

        if (id == profile_id) {
            name = row['name']
            mbti = row['mbti']
            style = row['style']
            link = row['link']
            img = row['url']
        }
    })


    $('#box_name').text(name)

    if (sessionStorage.getItem('user_id') == profile_id) {
        //셋팅
        $('#mbti_me').attr('value', mbti)
        $('#style_me').attr('value', style)
        $('#url_me').attr('value', link)
        $('#circle_img').attr('src', img)

        // 내 카드일 시, 실행될 곳
        $('#card_modal_container').css('display', 'flex');
        $('#card_modal_content').css('display', 'flex');
        $('#box_mbti_style_url_me').css('display', 'flex');
        $('#card').css('visibility', 'hidden');
        $('#box_img_file').css('display', 'block');

        $('#cur_img').change(function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    $('#circle_img').attr('src', e.target.result).show();
                }
                reader.readAsDataURL(file);
            }

        });


    } else {
        // 셋팅
        $('#other_grid_mbti').text(mbti)
        $('#other_grid_style').text(style)
        $('#other_grid_url').attr('href', link)
        $('#circle_img').attr('src', img)

        // 남의 카드일 시, 실행될 곳
        $('#card_modal_container').css('display', 'flex');
        $('#card_modal_content').css('display', 'flex');
        $('#box_mbti_style_url_other').css('display', 'grid');
        $('#card').css('visibility', 'hidden');
    }

}


// 조인창 껐을 때,
$("#modal_close_button").click(async function () {
    $('#modal_container').css('display', 'none')
    $('#card').css('visibility', 'visible')
})
// 남의 프로필을 끌 때,
$("#modal_close").click(async function () {
    $('#card_modal_container').css('display', 'none')
    $('#card').css('visibility', 'visible')
    $('#box_mbti_style_url_other').css('display', 'none')

})

// 내 프로필 업데이트
$('#modal_update').on('click', function () {
    handleUpdateClick()
});

async function handleUpdateClick() {

    let mbti = $("#mbti_me").val()
    let style = $("#style_me").val()
    let link = $("#url_me").val()
    let img_input = $("#cur_img")[0]
    let imgFile = img_input.files[0]


    if (mbti == '' || style == '' || link == '') {
        alert('칸을 다 채워주세요')
    } else {

        // getDocs 함수에 위에 정의한 쿼리를 적용해서 모든 문서들을 가져온다.
        let my_id = sessionStorage.getItem('user_id')
        let find_uid

        // find uid
        const querySnapshot = await getDocs(q_find_me);
        querySnapshot.forEach((doc) => {
            let row = doc.data();
            let id = row['id']
            if (my_id == id) {
                find_uid = row['uid']
            }

        });
        // 이미지 수정 여부에 따른 수정 로직 바뀜
        if (!imgFile) {
            console.log(mbti, style, link, find_uid)
            await updateDoc(doc(db, "users", find_uid), {
                mbti: $("#mbti_me").val(),
                style: $("#style_me").val(),
                link: $("#url_me").val()
            });

        } else {

            // img 레퍼런스 생성
            const profile_img_ref = ref(db_img, `profile/${my_id}`);

            // img 업로드
            await uploadBytes(profile_img_ref, imgFile).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            })

            // img 다운로드해서 firestre
            const url = await getDownloadURL(profile_img_ref)
            // console.log(mbti, style, link, url)
            await updateDoc(doc(db, "users", find_uid), {
                mbti: mbti,
                style: style,
                link: link,
                url: url
            });
        };
    }
    $('#card_modal_container').css('display', 'none')
    $('#card').css('visibility', 'visible')
    $('#box_mbti_style_url_me').css('display', 'none')
    $('#box_img_file').css('display', 'none');
    $("input[type='file']").val(null)
    alert('프로필이 정상적으로 수정되었습니다.')
    window.location.reload()
}

// 내 프로필 삭제할 때,
$('#modal_delete').on('click', function () {
    handleDeleteClick()
});

async function handleDeleteClick() {

    let my_id = sessionStorage.getItem('user_id')
    let find_uid
    
    // uid 찾기
    const querySnapshot = await getDocs(q_find_me);
    querySnapshot.forEach((doc) => {
        let row = doc.data();
        let id = row['id']
        if (my_id == id) {
            find_uid = row['uid']
        }
    })

    console.log(find_uid)
    // 멤버 등록 정보만 삭제
    await updateDoc(doc(db, "users", find_uid), {
        confirm: '0',
        date: deleteField(),
        link: deleteField(),
        mbti:deleteField(),
        shor: deleteField(),
        style: deleteField(),
        url: deleteField()
    });

    $('#card_modal_container').css('display', 'none')
    $('#card').css('visibility', 'visible')
    $('#box_mbti_style_url_me').css('display', 'none')
    $('#box_img_file').css('display', 'none');
    $("input[type='file']").val(null)
    alert('프로필이 정상적으로 삭제되었습니다.')
    window.location.reload()
}


// 내 프로필 끌 때,
$('#modal_cancel').on('click', function () {
    handleCancelClick()
});
async function handleCancelClick() {
    let mbti = $("#mbti_me").val()
    let style = $("#style_me").val()
    let link = $("#url_me").val()

    if (mbti == '' || style == '' || link == '' || $("input[type='file']").val() == null) {
        alert('칸을 다 채워주세요')

    } else {
        $('#card_modal_container').css('display', 'none')
        $('#card').css('visibility', 'visible')
        $('#box_mbti_style_url_me').css('display', 'none')
        $('#box_img_file').css('display', 'none');
        $("input[type='file']").val(null)
        window.location.reload()

    }

}


// 로그아웃 버튼을 눌렀을 때,
$("#logout").click(async function () {
    sessionStorage.clear();

})
