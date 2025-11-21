const API = "https://tinylink-1-b6zq.onrender.com";  // <-- your backend

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
    document.getElementById("msg").innerText =
      data.error ? "⚠ " + data.error : "✅ Created: " + data.code;
    loadLinks();
  });
}

function loadLinks() {
  fetch(`${API}/api/links`)
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("linksTable");
      table.innerHTML = "";
      data.forEach(row => {
        table.innerHTML += `
        <tr>
          <td><a href="${API}/${row.code}" target="_blank">${row.code}</a>
              | <a href="stats.html?code=${row.code}">Stats</a></td>
          <td>${row.target}</td>
          <td>${row.clicks}</td>
          <td><span class="delete" onclick="deleteLink('${row.code}')">🗑</span></td>
        </tr>`;
      });
    });
}

function deleteLink(code) {
  fetch(`${API}/api/links/${code}`, { method: "DELETE" })
    .then(() => loadLinks());
}

loadLinks();
