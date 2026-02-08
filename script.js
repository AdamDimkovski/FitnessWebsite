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
  document.body.classList.toggle("logged-in", !!user);
}

// --- LOG OUT ---
function setupLogout() {
  const logoutLink = document.getElementById("logoutLink");
  if (!logoutLink || logoutLink.dataset.bound === "true") return;

  logoutLink.dataset.bound = "true";

  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();

    firebase.auth().signOut()
      .then(() => {
        window.location.replace("index.html");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        window.location.replace("index.html");
      });
  });
}

// --- UNIFIED GLOBAL AUTH LISTENER ---
firebase.auth().onAuthStateChanged((user) => {
  const path = window.location.pathname;

  // Update UI immediately (instant visual response)
  updateUIForAuthState(user);
  setupLogout();

  // Logged out → block protected content
  if (!user) {
    const blocker = document.getElementById("accessBlocker");
    if (blocker) blocker.classList.remove("hidden");
    return;
  }

  // Pages that never redirect
  const isHome = path === "/" || path.endsWith("index.html");
  const isVerify = path.endsWith("verify.html");

  if (isHome || isVerify) return;

  // Redirect unverified users
  if (!user.emailVerified) {
    window.location.replace("verify.html");
  }
});
