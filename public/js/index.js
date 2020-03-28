const nicknameEl = document.querySelector('.nickname')
const acaterEl = document.querySelector('.acater-setting')
nicknameEl.addEventListener('click', () => {
  acaterEl.classList.toggle('acater-toggle')
})
