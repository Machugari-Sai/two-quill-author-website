const dateLabel = (value) => value ? new Date(value).toLocaleDateString() : "—";
const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
const table = (headers, rows, empty) => rows.length ? `<table class="crm-table"><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>` : `<div class="crm-empty">${empty}</div>`;

async function loadDashboard() {
  const response = await fetch("/api/admin/dashboard");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load the admin dashboard.");

  document.querySelector("#welcome").textContent = `Signed in as ${data.admin.email}`;
  document.querySelector("#customers").textContent = data.metrics.customers;
  document.querySelector("#totalUsers").textContent = data.metrics.totalUsers;
  document.querySelector("#reviews").textContent = data.metrics.reviews;
  document.querySelector("#average").textContent = data.metrics.averageReviewRating ? `${data.metrics.averageReviewRating}/5` : "—";
  document.querySelector("#users").innerHTML = table(["Customer", "Joined"], data.recentUsers.filter((user) => user.role !== "admin").map((user) => `<tr><td>${escapeHtml(user.profile?.name || user.email)}<br><small>${escapeHtml(user.email)}</small></td><td>${dateLabel(user.createdAt)}</td></tr>`), "No customers yet.");
  document.querySelector("#reviewsList").innerHTML = table(["Customer", "Rating"], data.recentReviews.map((item) => `<tr><td>${escapeHtml(item.email)}<br><small>${escapeHtml(item.review)}</small></td><td>${"★".repeat(Number(item.rating || 0))}<br><small>${dateLabel(item.createdAt)}</small></td></tr>`), "No website feedback yet.");
  document.querySelector("#ratings").innerHTML = table(["Comic", "Rating"], data.recentRatings.map((item) => `<tr><td>${escapeHtml(item.comicTitle || item.comicId)}<br><small>${escapeHtml(item.email)}</small></td><td>${"★".repeat(Number(item.rating || 0))}<br><small>${dateLabel(item.createdAt)}</small></td></tr>`), "No comic ratings yet.");
}

loadDashboard().catch((error) => { const target = document.querySelector("#error"); target.textContent = error.message; target.hidden = false; });
