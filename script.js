// --- SIGN UP ---
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const age = document.getElementById('signupAge').value.trim();
    const goal = document.getElementById('signupGoal').value;
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await user.sendEmailVerification();
      alert("Verification email sent! Please check your inbox.");

      await db.collection("users").doc(user.uid).set({
        name,
        age,
        goal,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert("Signup successful! Please verify your email before logging in.");
      window.location.href = "verify.html";

    } catch (error) {
      console.error(error.code, error.message);
      alert("Error: " + error.message);
    }
  });
}

// --- LOG IN ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Refresh user data (still good practice)
      await user.reload();

      // No verification check anymore

      alert("Login successful! " + user.email);
      window.location.href = "index.html";

    } catch (error) {
      console.error(error.code, error.message);
      alert("Error: " + error.message);
    }
  });
}

// --- NAV BAR TOGGLE ---
function updateUIForAuthState(user) {
  const signupLink = document.getElementById("signupLink");
  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");
  const profileLink = document.getElementById("profileLink");
  const signupSection = document.querySelector(".signupSection");

  if (user) {
    if (signupLink) signupLink.style.display = "none";
    if (loginLink) loginLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "inline-block";
    if (profileLink) profileLink.style.display = "inline-block";

    if (signupSection) signupSection.classList.add("hidden");

  } else {
    if (signupLink) signupLink.style.display = "inline-block";
    if (loginLink) loginLink.style.display = "inline-block";
    if (logoutLink) logoutLink.style.display = "none";
    if (profileLink) profileLink.style.display = "none";

    if (signupSection) signupSection.classList.remove("hidden");
  }
}

// --- LOG OUT ---
function setupLogout() {
  const logoutLink = document.getElementById("logoutLink");
  if (!logoutLink) return;

  logoutLink.replaceWith(logoutLink.cloneNode(true));
  const freshLogoutLink = document.getElementById("logoutLink");

  freshLogoutLink.addEventListener("click", (e) => {
    e.preventDefault();

    firebase.auth().signOut()
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Logout error:", error);
        window.location.href = "index.html";
      });
  });
}

// --- UNIFIED GLOBAL AUTH LISTENER (NO LOOPS, NO DOUBLE REDIRECTS) ---
firebase.auth().onAuthStateChanged(async (user) => {
  const currentPage = window.location.pathname;

  updateUIForAuthState(user);
  setupLogout();

  // If not logged in → show blocker if present
  if (!user) {
    const blocker = document.getElementById("accessBlocker");
    if (blocker) blocker.style.display = "flex";
    return;
  }

  // Always refresh user data
  await user.reload();

  // Never redirect on verify page
  if (currentPage.includes("verify.html")) return;

  // Never redirect on home page (prevents infinite loop)
  if (currentPage.includes("index.html")) return;

  // If user is NOT verified → send to verify page
  if (!user.emailVerified) {
    window.location.href = "verify.html";
    return;
  }

  // If user IS verified → allow access to protected pages
});