const contextReg = {
    formTitle: 'Регистрация',
    inputs: [
      {
        title: 'Почта',
        name: 'email',
        type: 'email',
      },
      {
        title: 'Никнейм',
        name: 'nickname',
        type: 'text',
      },
      {
        title: 'Пароль',
        name: 'password',
        type: 'password',
      },
      {
        title: 'Повторите пароль',
        name: 'password',
        type: 'password',
      },
    ],
    buttonTittle: 'Зарегистрироваться',
    orButton: {
      title: 'Войти',
      link: '/auth/login',
    }
  };

  export default async (router) => {
    const params = new URL(location.href).searchParams;
    const id = params.get('id');
    // const res = await router.api.getUser(id);
    const header = Handlebars.templates.header;
    router.root.innerHTML = '';

    const form = Handlebars.templates.form;
    router.root.innerHTML += form(contextReg);
   

    const footer = Handlebars.templates.footer;
    router.root.innerHTML += footer();
}