// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
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
const db = getFirestore()
// const db = getFirestore(app);

const main_img = 'assets/main_img.png'
let temp_html = `<img  id='main_img' src="${main_img}" alt="">  `
$('#center_img').append(temp_html)


// firestorage 사용
// const storage = getStorage(app)
// const imagesRef = ref(storage, '/main_img.png')
// const url = await getDownloadURL(imagesRef)

// let temp_html = `<img  id='test' src="${url}" alt="">  `
// $('#center_img').append(temp_html)


// for (let index = 1; index < 6; index++) {
//     let fileName = "/sub_img" + index + ".png"
//     const imagesRef = ref(storage, fileName)
//     const url = await getDownloadURL(imagesRef)
//     let temp = `<div class="card">
//               <img src="${url}" class="card-img-top" alt="...">
//               <div class="card-body">
//               </div>

//             </div>`
//     $('#cardGroup').append(temp)
// }

$("#register").click(async function () {
    $('#modal_container').css('display', 'flex')

})
$("#modal_close_button").click(async function () {
    $('#modal_container').css('display', 'none')

})

$("#modal_input_register").click(async function () {
    let modal_id = $('#modal_input_id').val()
    let modal_pw = $('#modal_input_pw').val()
    let boolean_duplicate = false
    let docs = await getDocs(collection(db, "users"));
    docs.forEach((doc) => {
        let row = doc.data();
        if (modal_id == row['id']) {
            $("#modal_input_id").val('')
            $("#modal_input_pw").val('')
            boolean_duplicate = true
        }
    });
    if (Boolean(boolean_duplicate)) {
        alert('중복된 아이디입니다!')

    } else {

        if (modal_pw == '' || modal_id == '') {
            alert('패스워드 혹은 아이디 입력해주세요~')
        } else {

            // await addDoc(collection(db, "users"), doc);
            try {
                const docRef = await addDoc(collection(db, "users"), {
                    'id': modal_id,
                    'pw': modal_pw,
                    'confirm': '0'
                });
                await updateDoc(doc(db, "users", docRef.id), {
                    uid: docRef.id
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            alert('가입 완료!')
            $('#modal_container').css('display', 'none')

        }

        let doc12 = {
            'id': modal_id,
            'pw': modal_pw
        };



    }
})
$("#login_button").click(async function () {
    let login_id = $('#login_id').val()
    let login_pw = $('#login_pw').val()
    let id_check = false
    let docs = await getDocs(collection(db, "users"));
    docs.forEach((doc) => {
        let row = doc.data();
        if (login_id == row['id']) {
            id_check = true
            if (login_pw == row['pw']) {
                $("#login_box").css('display', 'none')
                sessionStorage.setItem('user_id', login_id)
                window.location.reload()
                alert('로그인 되었습니다.')
            } else {
                console.log()
                alert('비밀번호를 확인해주세요')
            }
        }
    });
    if (!Boolean(id_check)) {
        alert('아이디를 확인해주세요')
    }
})
