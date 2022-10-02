export default () => {
    const content = document.getElementById('entry');
    content.innerHTML=`
    <div id="main" class="main">
        <form class="form" action="index.html" method="get">
            <span class="form__text_type_logo form__text_align_center">404</span>
            <span class="form__text_type_header form__text_align_center">Страница не найдена</span>
        </form>
    </div>`;
}