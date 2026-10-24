const authForm = document.getElementById("authForm");

if (authForm) {
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const mode = authForm.dataset.mode || "login";
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const name = document.getElementById("name")?.value.trim() || "";
    const message = document.getElementById("authMessage");
    const button = document.getElementById("authButton");

    message.textContent = "";
    button.disabled = true;
    button.textContent = "Please wait...";

    try {
      const response = await fetch(
        mode === "signup" ? "/api/signup" : "/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ name, email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Request failed");
      }

      window.location.href = "/";
    } catch (error) {
      message.textContent = error.message || "Something went wrong.";
    } finally {
      button.disabled = false;
      button.textContent = mode === "signup" ? "Sign Up" : "Login";
    }
  });
}
