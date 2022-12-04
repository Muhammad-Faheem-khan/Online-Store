const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const invalidLoginText = document.querySelector('.invalid-login')
const loginBtnElement = document.querySelector('.login-btn')

loginBtnElement.addEventListener('click', handleLogin)
// function to handle the login credentials of users 

function handleLogin(e) {
    fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

            username: emailInput.value,
            password: passwordInput.value,
        })
    })
        .then(errorHandling)
        .then(userData => {
            invalidLoginText.classList.add('hidden')
            emailInput.classList.remove('is-invalid')
            passwordInput.classList.remove('is-invalid')
            emailInput.classList.add('is-valid')
            passwordInput.classList.add('is-valid')
            localStorage.setItem('currentUser', JSON.stringify(userData))
            window.location.href = "./assets/htmlFiles/storeHomePage.html"
        }).catch((err) => {
            invalidLoginText.classList.remove('hidden')
            emailInput.classList.add('is-invalid')
            passwordInput.classList.add('is-invalid')
        })
}

function errorHandling(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
}

document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        handleLogin()
    }
})