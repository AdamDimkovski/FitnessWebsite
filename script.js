// --- Sign Up ---
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName")?.value.trim() || "N/A";
    const ageRaw = document.getElementById("signupAge")?.value.trim();
    const goal = document.getElementById("signupGoal")?.value || "general_fitness";
    const email = document.getElementById("signupEmail")?.value.trim();
    const password = document.getElementById("signupPassword")?.value;

    const age = ageRaw ? Number(ageRaw) : null;

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);

      // Wait for Firebase to update the auth state
      await new Promise(res => setTimeout(res, 500));

      const user = firebase.auth().currentUser;

      // Update user profile with display name
      try {
        await user.updateProfile({
          displayName: name
        });
      } catch (profileErr) {
        console.error("Profile update failed:", profileErr);
      }

      // Send verification email
      try {
        await user.sendEmailVerification();
      } catch (emailErr) {
        console.error("Email verification failed:", emailErr);
      }

      // Enable Firestore network
      try {
        await db.enableNetwork();
      } catch (e) {
        console.warn("Firestore already online");
      }

      // Firestore write
      try {
        console.log("About to write Firestore doc for:", user.uid);
        await db.collection("users").doc(user.uid).set({
          name,
          age,
          goal,
          email: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          height: null,
          weight: null,
          targetWeight: null,
          gender: null,
          activityLevel: null,
          targetWater: null,
          targetProtein: null,
          targetCarbs: null,
          targetFat: null,
          targetCalories: null
        });

      } catch (writeErr) {
        console.error("Firestore write failed:", writeErr);
      }

      window.location.href = "verify.html";

    } catch (err) {
      console.error("GLOBAL SIGNUP ERROR:", err);
      alert("Signup error: " + err.message);
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

  const publicPages = [
    "/",
    "/index.html",
    "/log-in.html",
    "/sign-up.html",
    "/verify.html",
    "/calculator.html",
    "/calculator"
  ];

  const isPublic = publicPages.some(p => path.endsWith(p));

  updateUIForAuthState(user);
  setupLogout();

  if (isPublic) return;

  if (!user) {
    window.location.replace("log-in.html");
    return;
  }

  if (!user.emailVerified) {
    window.location.replace("verify.html");
  }
});
