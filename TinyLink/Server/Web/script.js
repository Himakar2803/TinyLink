const API = "https://tinylink-1-b6zq.onrender.com";  // <-- your backend

// Create Short Link
function createLink() {
  const target = document.getElementById("targetUrl").value;
  const code = document.getElementById("customCode").value;

  fetch(`${API}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target, code })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      document.getElementById("msg").innerText = "❌ " + data.error;
    } else {
      document.getElementById("msg").innerHTML =
        "✅ Short Link Created: " +
        `<a href="${API}/${data.code}" target="_blank">${API}/${data.code}</a>`;
    }
  });
}
