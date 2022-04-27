const $email = document.querySelector('.emailInput');
const $password = document.querySelector('.passwordInput');
const $btnAuth = document.querySelector('.btnAuth');
const $signOut = document.querySelector('.signOut');
const base_url = 'https://todo-itacademy.herokuapp.com/api'
function getAuth(){
  fetch(`${base_url}/login` , {
    method:"POST",
    body:JSON.stringify({
      email: $email.value ,
      password: $password.value ,
    }),
    headers: {
      'Content-type':'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {
    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    localStorage.setItem('userId', res.user.id)
    if(res.user.isActivated){
      window.open('../index.html', '_self')
      localStorage.setItem('isActivated', res.user.isActivated)
    }
  })
  .finally(() => {
    $btnAuth.disabled = false
  })
}
$btnAuth.addEventListener('click' , e => {
  e.preventDefault()
  $btnAuth.disabled = true
  getAuth(base_url)
})
$signOut.addEventListener('click' , e => {
  e.preventDefault()
  window.open('./register.html', '_self')
})
