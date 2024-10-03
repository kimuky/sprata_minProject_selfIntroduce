
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_OD-r4PxEoS4nNq6MCWn5_9pU_ZCRfUc",
    authDomain: "spartaprojectintroduce.firebaseapp.com",
    projectId: "spartaprojectintroduce",
    storageBucket: "spartaprojectintroduce.appspot.com",
    messagingSenderId: "3323501194",
    appId: "1:3323501194:web:e162a03ff0d7da51a3ab73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const db_img = getStorage(app);

// 유저 전부 조회
const q1 = query(collection(db, "users"));


// 조인한 사람만 조회해서 카드로 보여줌
const q = query(collection(db, "users"), where("confirm", "==", '1'));

let docs = await getDocs(q);
docs.forEach((doc) => {
    let row = doc.data();

    if (row['style'] == '') { return }
    else {
        let id = row['id']
        console.log(id)

        // 여기서 session id 와 들고온 id를 비교하며 세션아이디(현재 로그인한 아이디)가 있으면 현재 로그인한 사용자 페이지에서 join 버튼을 none으로~
        if (id == sessionStorage.getItem('user_id')) {
            $("#join_button").css('visibility', 'hidden')
        }


        let name = row['name']
        let mbti = row['mbti']
        let style = row['style']
        let link = row['link']
        let img = row['url']

        let temp_html = `                        <div data-id='${id}' class="col" id='member_card'>
                    <div  class="card h-100">
                        <img id='profile_img' src="${img}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${name}</h5>
                            <p class="card-text">${mbti}</p>
                        </div>
                        <div class="card-footer">
                            <small class="text-body-secondary">${link}</small>
                        </div>
                    </div>
                </div>`
        $('#card').prepend(temp_html);
    }

})

// 조인 버튼을 눌렀을 시,
$("#join_button").click(async function () {

    if (Boolean(sessionStorage.getItem('user_id'))) {
        $('#modal_container').css('display', 'flex')
        $('#card').css('visibility', 'hidden')

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

                const q = query(collection(db, "users"), where("id", "==", sessionStorage.getItem('user_id')));


                // getDocs 함수에 위에 정의한 쿼리를 적용해서 모든 문서들을 가져온다.
                const querySnapshot = await getDocs(q);
                let find_uid
                querySnapshot.forEach((doc) => {
                    find_uid = doc.id
                });

                // console.log(imgFile['name']);
                const profile_img_ref = ref(db_img, `profile/${sessionStorage.getItem('user_id')}`);
                await uploadBytes(profile_img_ref, imgFile).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                })

                // const imagesRef = ref(db_img, `profile/${sessionStorage.getItem('user_id')}`)
                // const url = await getDownloadURL(imagesRef)

                await updateDoc(doc(db, "users", find_uid), {
                    name: name,
                    mbti: mbti,
                    style: style,
                    link: link,
                    short: short,
                    confirm: '1',
                    date: serverTimestamp()
                });

                name = $("#modal_input_name").val('')
                mbti = $("#modal_input_mbti").val('')
                style = $("#modal_input_style").val('')
                link = $("#modal_input_link").val('')
                short = $("#modal_input_short").val('')
                img_input = $("#modal_input_img").val('')

                const imagesRef = ref(db_img, `profile/${sessionStorage.getItem('user_id')}`)
                const url = await getDownloadURL(imagesRef)
                await updateDoc(doc(db, "users", find_uid), {
                    url: url
                });

                $('#modal_container').css('display', 'none')
                $('#card').css('visibility', 'visible')
                alert('프로필이 정상적으로 저장되었습니다.')
                window.location.reload()
            }
        })
    } else {
        $('#modal_container').css('display', 'none')
        $('#card').css('visibility', 'visible')
        alert('로그인이 필요합니다')
    }
})

// 각 카드를 클릭했을 때,
$('#card').on('click', '#member_card', function () {
    // const cardTitle = $(this).find('.card-title').text();
    const profile_id = $(this).data('id')
    handleClick(profile_id)
});

async function handleClick(profile_id) {

    // 해당 프로필의 아이디로 유저 데이터 받아옴
    // const q = query(collection(db, "users"));

    let docs = await getDocs(q1);
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
        $('#mbti_me').attr('value', mbti);
        $('#style_me').attr('value', style);
        $('#url_me').attr('value', img);

        // 내 카드일 시, 실행될 곳
        $('#card_modal_container').css('display', 'flex');
        $('#card_modal_content').css('display', 'flex');
        $('#box_mbti_style_url_me').css('display', 'flex');
        $('#card').css('visibility', 'hidden');
        $('#box_img_file').css('display', 'block');

    } else {
        // 셋팅
        $('#other_grid_mbti').text(mbti)
        $('#other_grid_style').text(style)
        $('#other_grid_url').text(link)
        // 남의 카드일 시, 실행될 곳
        $('#card_modal_container').css('display', 'flex');
        $('#card_modal_content').css('display', 'flex');
        $('#box_mbti_style_url_other').css('display', 'grid');
        $('#card').css('visibility', 'hidden');
    }
    $('#circle_img').attr('src', img)

}


// 조인창 껐을 때,gose
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
// 나의 프로필을 끌때
$("#modal_cancel").click(async function () {
    $('#card_modal_container').css('display', 'none')
    $('#card').css('visibility', 'visible')
    $('#box_mbti_style_url_me').css('display', 'none')
    $('#box_img_file').css('display', 'none');


})
// 로그아웃 버튼을 눌렀을 때,
$("#logout").click(async function () {
    sessionStorage.clear();

})