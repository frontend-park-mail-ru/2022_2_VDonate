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

const passwordValidation = password => {
  if (/^\S+\w+\S+$/.test(password.value)) {
    password.style = '';
    return true;
  }
  password.style.borderColor = 'red';
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

const repeatPasswordCheck = (origin, repeat) => {
  if (origin.value !== repeat.value) {
    repeat.style = '';
    return true;
  }
  repeat.style.borderColor = 'red';
  return false;
}

function loginValidation(form) {
  const emailCheck = emailValidation(form.email);
  const passwordCheck = passwordValidation(form.password);
  if (emailCheck && passwordCheck) {
    return true;
  }
  const errText = form.querySelector('#error-text');
  errText.style.display = 'unset';
  return false;
}

function signupValidation(form) {
  const emailCheck = emailValidation(form.email);
  const passwordCheck = passwordValidation(form.password);
  const usernameCheck = usernameValidation(form.username);
  const repeatCheck = repeatPasswordCheck(form.password, form.passwordRepeat);
  if (emailCheck && passwordCheck && usernameCheck && repeatCheck) {
    return true;
  }
  const errText = form.querySelector('#error-text');
  errText.style.display = 'unset';
  return false;
}

function validationForm(type) {
  const form = document.forms[type];
  switch (type) {
    case formType.login:
      return loginValidation(form);
    case formType.signup:
      return signupValidation(form);
    default:
      return false;
  }
}