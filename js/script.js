const $title = document.querySelector('.title')
const $content = document.querySelector('.content')
const $date = document.querySelector('.date')
const $submit = document.querySelector('.submit')
const $container = document.querySelector('.row')
const $loader = document.querySelector('.loader')
const $signOut = document.querySelector('.signout_btn')

const base = 'https://todo-itacademy.herokuapp.com/api'
const accessToken = localStorage.getItem('accessToken')

const request = {
  get:(url, accessToken) => {
    return fetch(url, {
      method: 'GET',
      headers:{
        'Content-type':'application/json',
        'Authorization':`Bearer ${accessToken}`
      },
    })
    .then(res => res.json())
  }
}

// .....................check Unauthorized ............................................
window.addEventListener('DOMContentloaded', () => {
  const accessToken = localStorage.getItem('accessToken')
  if(!accessToken){
    window.open('../auth.html', '_self')
  }
})
// .....................Render todos when window loaded............................................
window.addEventListener('DOMContentloaded', () => {
  $loader.innerHTML = `<div class="lds-ripple"><div></div><div></div></div>`
  getTodos()
})
// ..................... Get todos ............................................
function getTodos(){
  request.get(`${base}/todos`, accessToken)
  .then(r => {
    const todos = r.todos
    const result = todos
    .reverse()
    .map(todo => cardTemplate(todo))
    .join('')
    $container.innerHTML = result
  })

}
// ..................... Get single todo ............................................
function getSingleTodo(id){
  return request.get(`${base}/todos/${id}`, accessToken)
  .then(r => r.json())
}
// ..................... Create todos ............................................
function createTodos(title , content , date){
  $submit.disabled = true
  fetch(`${base}/todos/create`, {
    method: 'POST',
    headers:{
      'Content-type':'application/json',
      'Authorization':`Bearer ${accessToken}`
    },
    body: JSON.stringify({
      title,
      content,
      date,
    })
  })
  .then(() => {
    getTodos()
  })
  .finally(() => $submit.disabled = false)
}

// ..................... Card Template ............................................
function cardTemplate({title , content , date , id , completed , edited}){
  return`
  <div class="col-12 col-xl-4">
    <div class="cards">
      <div class="card_header">
        <h3 class="card_title">${title}</h3>
        ${completed ? `<img class="check_icon" src="https://upload.wikimedia.org/wikipedia/commons/c/c6/Sign-check-icon.png"/>` : ''}
      </div>
      <div class="card_body content">
        <p>${content}</p>
        <span class="time">
          ${date}
          ${edited.state ? `<span class="small">edited. ${edited.date}</span>` : ''}
        </span>
      </div>
      <div class="card-footer">
        <button class="delete" onclick="deleteTodo('${id}')">Delete</button>
        <button class="complete" onclick="completeTodo('${id}')">Complete</button>
        <button class="edit">Edit</button>
      </div>
    </div>
  </div>
  `
}
// ..................... Complate Todo ............................................возможна ошибка
function completeTodo(id){
  request.get(`${base}/todos/${id}/completed`, accessToken)
  .then(getTodos)
}
// ..................... Delete todo ............................................
function deleteTodo(id){
  fetch(`${base}/todos/${id}`, {
    method:'DELETE',
    headers:{
      'Content-type':'application/json',
      'Authorization':`Bearer ${accessToken}`,
    }
  })
  .then(getTodos)
}
// ..................... Edit todo ............................................
function editTodo(id){
  getSingleTodo(id)
  .then(res => {
    const askTitle = prompt('New title', res.title)
    const askContent = prompt('New content', res.content)
    fetch(`${base}/todos/${id}`, {
      method:'PUT',
      headers:{
        'Content-type':'application/json',
        'Authorization':`Bearer ${accessToken}`
      },
      body:JSON.stringify({
        title: askTitle || res.title,
        content: askContent || res.content
      })
    })
    .then(getTodos)
  })
}

$submit.addEventListener('click', e => {
  e.preventDefault()
  $submit.disabled = true
  createTodos($title.value , $content.value , $date.value)

})

// ..................... Sign Out ............................................

$signOut.addEventListener('click', e => {
  e.preventDefault()
  
  const refreshToken = localStorage.getItem('refreshToken')
  $signOut.disabled = true
  $signOut.classList.add('disabled')
  fetch(`${base}/logout`, {
    method:'POST',
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify({refreshToken})
  })
  .then(res => res.json())
  .then(() => {
    localStorage.clear()
    window.open('../auth.html', '_self')
  })
  .finally(() => {
    $signOut.disabled = false
    $signOut.classList.remove('disabled')
  })
})