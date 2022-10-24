export default () => {
  const text = document.createElement('h1');
  text.textContent = 'Страница не найдена';
  document.getElementById('main')?.appendChild(text);
};
