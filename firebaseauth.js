// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration (you'll fill in your own configuration details)
const firebaseConfig = {
    apiKey: "AIzaSyClu1OVEP5c8HR7-tU076B2LYJ38fWPCXQ",
    authDomain: "legacy-link-24a98.firebaseapp.com",
    projectId: "legacy-link-24a98",
    storageBucket: "legacy-link-24a98.firebasestorage.app",
    messagingSenderId: "138071564868",
    appId: "1:138071564868:web:298307d1f116128e419211",
    measurementId: "G-MGK48GM82P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const roll = document.getElementById('roll').value;
    const CollegeID = document.getElementById('ID').files[0];  // File input for image

    const auth = getAuth();
    const db = getFirestore();

    // Convert image to Base64
    const reader = new FileReader();
    reader.onloadend = function () {
        const base64Image = reader.result;  // The Base64 string of the image

        // Create user in Firebase Authentication
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                const userData = {
                    email: email,
                    roll:roll,
                    firstName: firstName,
                    CollegeID: base64Image,  // Store Base64 string in Firestore
                };

                showMessage('Account Created Successfully', 'signUpMessage');
                
                // Add user data to Firestore
                const docRef = doc(db, "users", user.uid);
                setDoc(docRef, userData)
                    .then(() => {
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        console.error("Error writing document", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode == 'auth/email-already-in-use') {
                    showMessage('Email Address Already Exists !!!', 'signUpMessage');
                }
                else {
                    showMessage('Unable to create User', 'signUpMessage');
                }
            });
    };

    // Read the image as Base64
    if (CollegeID) {
        reader.readAsDataURL(CollegeID); // This will trigger the onloadend function when finished
    } else {
        showMessage('Please upload an ID image', 'signUpMessage');
    }
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'home.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            }
            else {
                showMessage('Account does not Exist', 'signInMessage');
            }
        });
});
