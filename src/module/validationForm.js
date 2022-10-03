const formType = {
  signup: 'signup',
  login: 'login',
}

const emailValidation = email => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
    email.style = '';
    return true;
  }
  email.style.borderColor = 'red';
  return false;
}

const usernameValidation = username => {
  if (username.value !== '') {
    username.style = '';
    return true;
  }
  username.style.borderColor = 'red';
  return false;
}

const passwordValidation = password => {
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
  const emailCheck = emailValidation(form.email);
  const passwordCheck = passwordValidation(form.password);
  const errText = form.querySelector('#error-text');
  if (emailCheck && passwordCheck) {
    errText.style = '';
    return true;
  }
  errText.style.display = 'unset';
  return false;
}

function signupValidation(form) {
  const emailCheck = emailValidation(form.email);
  const passwordCheck = passwordValidation(form.password);
  const usernameCheck = usernameValidation(form.username);
  const repeatCheck = repeatPasswordCheck(form.password, form.passwordRepeat);
  const errText = form.querySelector('#error-text');
  if (emailCheck && passwordCheck && usernameCheck && repeatCheck) {
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