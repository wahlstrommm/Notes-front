let loginBtn = document.getElementById('loginBtn');
let InfoText = document.getElementById('InfoText');
let loggedinContainer = document.getElementById('loggedinContainer');
let LoginContainer = document.getElementById('LoginContainer');
let logOutBtn = document.getElementById('logOutBtn');
loggedinContainer.style.display = 'none';

const checkLS = () => {
  let LS = localStorage.getItem('logged');
  let LSParsed = JSON.parse(LS);

  if (LSParsed) {
    loggedinContainer.style.display = 'block';
    LoginContainer.style.display = 'none';
  } else {
    LoginContainer.style.display = 'block';
  }
};
checkLS();

loginBtn.addEventListener('click', () => {
  let userNameFromInput = document.getElementById('userNameInput').value;
  let passwordFromInput = document.getElementById('passwordInput').value;

  if (!userNameFromInput == '' || !passwordFromInput == '') {
    let user = {
      userName: userNameFromInput,
      userPassword: passwordFromInput,
    };
    login(user);
  } else {
    InfoText.textContent = 'Var snäll att fyll i båda fälten';
  }
});

const login = async (user) => {
  await fetch('http://localhost:3000/docs/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result && result == 'Lyckad inloggad') {
        InfoText.textContent = 'Inloggad';
        loggedinContainer.style.display = 'block';
        LoginContainer.style.display = 'none';
        localStorage.setItem('logged', true);
      } else {
        console.log('Nåt hände...');
        InfoText.textContent = 'Fel uppgifter försök igen';
      }
    })
    .catch((error) => console.error(error));
};

logOutBtn.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});
