// scripts.js

// --- SIGN UP ---
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const age = document.getElementById('signupAge').value.trim();
    const goal = document.getElementById('signupGoal').value;
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    const auth = firebase.auth();
    const db = firebase.firestore();

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Save extra details in Firestore
        return db.collection("users").doc(user.uid).set({
          name: name,
          age: age,
          goal: goal,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        alert("Signup successful!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(error.code, error.message);
        alert("Error: " + error.message);
      });
  });
}

// --- LOG IN ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Login successful! " + user.email);
        window.location.href = "index.html"; // redirect after login
      })
      .catch((error) => {
        console.error(error.code, error.message);
        alert("Error: " + error.message);
      });
  });
}

// --- NAV BAR TOGGLE ---
firebase.auth().onAuthStateChanged((user) => {
  const signupLink = document.getElementById("signupLink");
  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");
  const profileLink = document.getElementById("profileLink"); // new profile link

  if (user) {
    if (signupLink) signupLink.style.display = "none";
    if (loginLink) loginLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "inline-block";
    if (profileLink) profileLink.style.display = "inline-block"; // show profile when logged in
  } else {
    if (signupLink) signupLink.style.display = "inline-block";
    if (loginLink) loginLink.style.display = "inline-block";
    if (logoutLink) logoutLink.style.display = "none";
    if (profileLink) profileLink.style.display = "none"; // hide profile when logged out
  }
});


// --- LOG OUT ---
const logoutLink = document.getElementById("logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
      alert("Logged out successfully!");
      window.location.href = "index.html"; // redirect after logout
    });
  });
}

// --- PAGE BLOCKER ---
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    const blocker = document.getElementById("accessBlocker");
    if (blocker) blocker.style.display = "flex";
  }
});
