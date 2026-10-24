const reviewForm = document.getElementById("reviewForm");
const contentInput = document.getElementById("content");
const resultsContainer = document.getElementById("results");
const reviewButton = document.getElementById("reviewButton");
const logoutButton = document.getElementById("logoutButton");
async function checkLogin() {
  try {
    const response = await fetch("/api/me");

    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }
    if (!response.ok) {
      throw new Error("Unable to verify login.");
    }
  } catch (error) {
    console.error(error);
  }
}

function displayResults(data) {
  if (!resultsContainer) return;

  resultsContainer.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = "AI Review Results";
  resultsContainer.appendChild(heading);

  const score = document.createElement("p");
  score.textContent =
    "Brand Safety Score: " + (data.score ?? "N/A") + "/100";
  resultsContainer.appendChild(score);

  const summary = document.createElement("p");
  summary.textContent = data.summary || "Review completed.";
  resultsContainer.appendChild(summary);

  // Issues
  const issuesHeading = document.createElement("h3");
  issuesHeading.textContent = "Issues Found";
  resultsContainer.appendChild(issuesHeading);

  const issues = Array.isArray(data.issues) ? data.issues : [];

  if (issues.length > 0) {
    const list = document.createElement("ul");

    issues.forEach((issue) => {
      const item = document.createElement("li");

      if (typeof issue === "string") {
        item.textContent = issue;
      } else {
        const severity = issue.severity || "Review";
        const type = issue.type || "Content issue";
        const explanation =
          issue.explanation || issue.message || issue.description || "";
        const suggestion = issue.suggestion || "";

        item.textContent =
          `${severity}: ${type}. ${explanation}` +
          (suggestion ? ` Suggestion: ${suggestion}` : "");
      }

      list.appendChild(item);
    });

    resultsContainer.appendChild(list);
  } else {
    const message = document.createElement("p");
    message.textContent = "No specific issues were found.";
    resultsContainer.appendChild(message);
  }

  // Revised Content
  const revisedHeading = document.createElement("h3");
  revisedHeading.textContent = "AI-Suggested Revised Content";
  resultsContainer.appendChild(revisedHeading);

  const revisedContent = document.createElement("textarea");
  revisedContent.id = "revisedContent";
  revisedContent.value = data.revisedContent || "";
  revisedContent.rows = 5;
  revisedContent.style.width = "100%";
  revisedContent.style.boxSizing = "border-box";
  revisedContent.placeholder = "Revised content will appear here...";
  resultsContainer.appendChild(revisedContent);

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "Copy Revised Content";

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(revisedContent.value);
      copyButton.textContent = "Copied!";
    } catch (error) {
      revisedContent.select();
      const copied = document.execCommand("copy");
      copyButton.textContent = copied
        ? "Copied!"
        : "Please copy the text manually.";
    }
  });

  resultsContainer.appendChild(copyButton);

  const disclaimer = document.createElement("p");
  disclaimer.textContent =
    data.disclaimer ||
    "AI suggestions may contain errors. Verify facts before publishing.";
  resultsContainer.appendChild(disclaimer);
}


// Submit content 
if (reviewForm) {
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const content = contentInput?.value.trim();

    if (!content) {
      alert("Please enter some brand content to review.");
      return;
    }

    if (reviewButton) {
      reviewButton.disabled = true;
      reviewButton.textContent = "Reviewing...";
    }

    if (resultsContainer) {
      resultsContainer.textContent = "AI is reviewing your content...";
    }

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
      });

      const data = await response.json();
      console.log("API REVIEW RESPONSE:", data);
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Review failed. Please try again.");
      }

      displayResults(data);
    } catch (error) {
      if (resultsContainer) {
        resultsContainer.textContent = error.message;
      }
    } finally {
      if (reviewButton) {
        reviewButton.disabled = false;
        reviewButton.textContent = "Review Content";
      }
    }
  });
}

// Logout
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST"
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      alert("Could not connect to the server.");
    }
  });
}

/* -------------------- BRAND PROTECTION ALERTS -------------------- */

async function loadBrandAlerts() {
  const container = document.getElementById("alerts-container");

  // Agar HTML mein alerts container nahi hai, toh kuch nahi karna
  if (!container) return;

  try {
    const response = await fetch("/api/alerts");
    const data = await response.json();

    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      container.textContent =
        data.error || "Could not load brand alerts.";
      return;
    }

    container.replaceChildren();

    const count = document.createElement("p");
    count.textContent = "Total Alerts: " + (data.totalAlerts ?? 0);
    container.appendChild(count);

    if (!Array.isArray(data.alerts) || data.alerts.length === 0) {
      const message = document.createElement("p");
      message.textContent = "No brand protection alerts found.";
      container.appendChild(message);
      return;
    }

    data.alerts.forEach((alert) => {
      const card = document.createElement("div");
      card.className = "alert-item";

      const title = document.createElement("h3");
      title.textContent = (alert.severity || "Alert") + ": " +
        (alert.type || "Brand Protection");

      const message = document.createElement("p");
      message.textContent = alert.message || "Potential issue detected.";

      const date = document.createElement("small");
      date.textContent = alert.createdAt
        ? new Date(alert.createdAt).toLocaleString()
        : "";

      card.append(title, message, date);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Brand alerts error:", error);

    container.textContent = "Unable to load alerts. Please try again.";
  }
}

loadBrandAlerts();
checkLogin();
