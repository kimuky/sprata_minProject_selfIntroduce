
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// config
const firebaseConfig = {
    apiKey: "AIzaSyC_OD-r4PxEoS4nNq6MCWn5_9pU_ZCRfUc",
    authDomain: "spartaprojectintroduce.firebaseapp.com",
    projectId: "spartaprojectintroduce",
    storageBucket: "spartaprojectintroduce.appspot.com",
    messagingSenderId: "3323501194",
    appId: "1:3323501194:web:e162a03ff0d7da51a3ab73"
};

// 설정
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 쿼리
const q = query(collection(db, "users"), where("confirm", "==", '1'), orderBy('date'));


// 한마디 불러와서 동적으로 데이터 추가
let docs = await getDocs(q);
docs.forEach((doc) => {
    let row = doc.data();
    let img = row['url']
    let short = row['short']

    let temp_html = `                       
            <div class="short_say_card">
                <div id='img_box'  class="card_img"><img class='short_img' id='short_img' src="${img}" alt=""></div>
                <div id='' class="card_short_say">${short}</div>
            </div>`

    $('#short_say_content').append(temp_html)

});