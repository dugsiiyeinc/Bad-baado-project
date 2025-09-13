// Buttons toggle SignIn / SignUp
const signUpBtns = document.querySelectorAll('.signUpBtn-link');
const signInWrapper = document.querySelector('.form-wrapper.sign-in');
const signUpWrapper = document.querySelector('.form-wrapper.sign-up');

signUpBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (signUpWrapper.style.transform === 'scale(1)') {
      signUpWrapper.style.transform = 'scale(0)';
      signInWrapper.style.transform = 'scale(1)';
    } else {
      signInWrapper.style.transform = 'scale(0)';
      signUpWrapper.style.transform = 'scale(1)';
    }
  });
});

// Hel foomamka
const signInForm = signInWrapper.querySelector('form');
const signUpForm = signUpWrapper.querySelector('form');

// Key kaydinta users
const USERS_KEY = "registeredUsers";

// Helpers
function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUser(username, email, password) {
  const users = getUsers();
  users.push({ username, email, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function userExists(username, email) {
  return getUsers().some(
    user => user.username === username || user.email === email
  );
}

// ------------------- SIGN UP -------------------
signUpForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const username = signUpForm.querySelector('input[type="text"]').value.trim();
  const email = signUpForm.querySelector('input[type="email"]').value.trim();
  const password = signUpForm.querySelector('input[type="password"]').value;

  if (!username || !email || !password) {
    alert("Fadlan buuxi dhammaan meelaha.");
    return;
  }

  if (userExists(username, email)) {
    alert("User already exists. Please use a different email or username.");
    return;
  }

  saveUser(username, email, password);
  localStorage.setItem('currentUser', username);

  signUpForm.reset();

  // redirect dashboard (hal path sax ah)
  window.location.href = "./dashbourd.html";
  signUpForm.reset()
});

// ------------------- SIGN IN -------------------
signInForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const username = signInForm.querySelector('input[type="text"]').value.trim();
  const password = signInForm.querySelector('input[type="password"]').value;

  const users = getUsers();
  const validUser = users.find(
    user => user.username === username && user.password === password
  );

  if (validUser) {
    localStorage.setItem('currentUser', username);
    signInForm.reset();
    window.location.href = "./dashbourd.html";
  } else {
    alert("Invalid username or password");
  }
});
