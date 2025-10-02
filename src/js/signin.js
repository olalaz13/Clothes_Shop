const signinBtn = document.getElementById("signinBtn");

signinBtn.addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!user || !pass) {
    alert("⚠ Please enter username and password.");
    return;
  }

  localStorage.setItem("username", user);

  alert(`✅ Welcome back, ${user}!`);

  window.location.href = "index.html";
});
