// const signUpBtnlink = document.querySelector(".signUpBtn-link");
// const signInBtnlink = document.querySelector(".signInBtn-link");




// const signUpBtns = document.querySelectorAll('.signUpBtn-link');
// const wrapper = document.querySelector('.wrapper');
// const signInForm = document.querySelector('.form-wrapper.sign-in');
// const signUpForm = document.querySelector('.form-wrapper.sign-up');

// // Add event listeners to all links with class 'signUpBtn-link'
// signUpBtns.forEach(btn => {
//     btn.addEventListener('click', (e) => {
//         e.preventDefault();
//         // Toggle between sign-in and sign-up
//         if (signUpForm.style.transform === 'scale(1)') {
//             signUpForm.style.transform = 'scale(0)';
//             signInForm.style.transform = 'scale(1)';
//         } else {
//             signInForm.style.transform = 'scale(0)';
//             signUpForm.style.transform = 'scale(1)';
//         }
//     });
// });




    // Mobile menu functionality
   
   document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle"); // Hamburger
    const mobileNav  = document.querySelector(".mobile-nav");  // Menü
    const closeMenu  = document.querySelector(".close-menu");  // X Icon
    const overlay    = document.querySelector(".overlay");     // Overlay
    const menuLinks  = document.querySelectorAll(".mobile-nav a"); // Alle Links

    // Menü öffnen / schließen
    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        mobileNav.classList.toggle("active");
        overlay.classList.toggle("active");
    });

    // Menü schließen (X Icon)
    closeMenu.addEventListener("click", () => {
        closeAll();
    });

    // Menü schließen (Overlay Klick)
    overlay.addEventListener("click", () => {
        closeAll();
    });

    // Menü schließen wenn Link geklickt wird
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeAll();
        });
    });

    function closeAll() {
        menuToggle.classList.remove("active");
        mobileNav.classList.remove("active");
        overlay.classList.remove("active");
    }
});


const signUpBtns = document.querySelectorAll('.signUpBtn-link');
const wrapper = document.querySelector('.wrapper');
const signInForm = document.querySelector('.form-wrapper.sign-in');
const signUpForm = document.querySelector('.form-wrapper.sign-up');

// Add event listeners to all links with class 'signUpBtn-link'
signUpBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Toggle between sign-in and sign-up
        if (signUpForm.style.transform === 'scale(1)') {
            signUpForm.style.transform = 'scale(0)';
            signInForm.style.transform = 'scale(1)';
        } else {
            signInForm.style.transform = 'scale(0)';
            signUpForm.style.transform = 'scale(1)';
        }
    });
});
// // Hel foomamka
// const signInForm = document.querySelector('.sign-in form');
// const signUpForm = document.querySelector('.sign-up form');

// Key name aan u isticmaaleyno kaydinta users
const USERS_KEY = "registeredUsers";

// Helper: Hel users kaydsan
function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

// Helper: Kaydi user cusub
function saveUser(username, email, password) {
  const users = getUsers();
  users.push({ username, email, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

 
}

// Helper: Eeg haddii user hore u diiwaangashan yahay
function userExists(username, email) {
  const users = getUsers();
  return users.some(user => user.username === username || user.email === email);
}

// ------------------- SIGN UP -------------------
signUpForm.addEventListener('submit', function(e) {
  e.preventDefault();
//   signUpForm.validUser = ""

  const username = signUpForm.querySelector('input[type="text"]').value.trim();
  const email = signUpForm.querySelector('input[type="email"]').value.trim();
  const password = signUpForm.querySelector('input[type="password"]').value;

  if (userExists(username, email)) {
    alert("User already exists. Please use a different email or username.");
    return;
  }

  // Kaydi user
  saveUser(username, email, password);
  localStorage.setItem('currentUser', username);

  signInForm.reset()

  // U gudub dashboard
  window.location.href = "dashboard.html";
});

// ------------------- SIGN IN -------------------
signInForm.addEventListener('submit', function(e) {
  e.preventDefault();
  signInForm.value = ""

  const username = signInForm.querySelector('input[type="text"]').value.trim();
  const password = signInForm.querySelector('input[type="password"]').value;

  const users = getUsers();
  const validUser = users.find(user => user.username === username && user.password === password);

  if (validUser) {
    localStorage.setItem('currentUser', username);

    signInForm.reset()
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password");
  }
});




