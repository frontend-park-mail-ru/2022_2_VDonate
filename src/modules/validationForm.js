const formType = {
  signup: 'signup',
  login: 'login',
}

const emailCheck = email => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
    email.style = '';
    return true;
  }
  email.style.borderColor = 'red';
  return false;
}

const usernameCheck = username => {
  if (username.value !== '') {
    username.style = '';
    return true;
  }
  username.style.borderColor = 'red';
  return false;
}

const passwordCheck = password => {
  if (/^[\S]+$/.test(password.value)) {
    password.style = '';
    return true;
  }
  password.style.borderColor = 'red';
  return false;
}

const repeatPasswordCheck = (origin, repeat) => {
  if (repeat.value != '' && origin.value === repeat.value) {
    repeat.style = '';
    return true;
  }
  repeat.style.borderColor = 'red';
  return false;
}

function loginValidation(form) {
  const emailChecked = emailCheck(form.email);
  const passwordChecked = passwordCheck(form.password);
  const errText = form.querySelector('#error-text');
  if (emailChecked && passwordChecked) {
    errText.style = '';
    return true;
  }
  errText.style.display = 'unset';
  return false;
}

function signupValidation(form) {
  const emailChecked = emailCheck(form.email);
  const passwordChecked = passwordCheck(form.password);
  const usernameChecked = usernameCheck(form.username);
  const repeatChecked = repeatPasswordCheck(form.password, form.passwordRepeat);
  const errText = form.querySelector('#error-text');
  if (emailChecked && passwordChecked && usernameChecked && repeatChecked) {
    errText.style = '';
    return true;
  }
  errText.style.display = 'unset';
  return false;
}

function validationForm(form) {
  switch (form.name) {
    case formType.login:
      return loginValidation(form);
    case formType.signup:
      return signupValidation(form);
    default:
      return false;
  }
}

// HACK Пока как заглушка

function processForm(form) {
  if (validationForm(form)) {
    form.reset();
  }

}