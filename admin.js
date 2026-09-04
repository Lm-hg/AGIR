import {
  db,
  signInAdminWithGoogle,
  watchAuthState,
  signOutCurrentUser
} from "./firebase-init.js";
import { collection, query, onSnapshot, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const ALLOWED_ADMIN_EMAIL = "modestinhounga78@gmail.com";
const authGate = document.getElementById("admin-auth");
const adminContainer = document.getElementById("admin-container");
const loginButton = document.getElementById("admin-login-btn");
const authStatus = document.getElementById("admin-auth-status");
let dashboardStarted = false;

// Chart Setup
let votesChart = null;

function initChart() {
  const ctx = document.getElementById("votes-chart").getContext("2d");
  votesChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Oui - Participer", "Non - Pas d'intérêt"],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: [
            "rgba(0, 255, 136, 0.3)",
            "rgba(255, 85, 119, 0.3)"
          ],
          borderColor: ["#00ff88", "#ff5577"],
          borderWidth: 2,
          hoverOffset: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#8892a6",
            font: { size: 14, family: "'Manrope', sans-serif" },
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: "rgba(26, 31, 58, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#8892a6",
          borderColor: "#2d3a56",
          borderWidth: 1,
          padding: 12,
          titleFont: { size: 12, weight: "bold" },
          bodyFont: { size: 12 }
        }
      }
    }
  });
}

function showGate(message = "") {
  authGate.classList.remove("hidden");
  adminContainer.classList.add("hidden");
  authStatus.textContent = message;
}

function showDashboard() {
  authGate.classList.add("hidden");
  adminContainer.classList.remove("hidden");

  if (!dashboardStarted) {
    initChart();
    subscribeToVotes();
    subscribeToContributors();
    dashboardStarted = true;
  }
}

function isAllowedAdmin(user) {
  return Boolean(
    user &&
    user.email &&
    user.email.toLowerCase() === ALLOWED_ADMIN_EMAIL
  );
}

function getFriendlyAuthError(error) {
  const code = error?.code || "";

  if (code === "auth/unauthorized-domain") {
    return "Domaine non autorise par Firebase. Ajoute ce domaine dans Firebase Authentication > Settings > Authorized domains (ex: localhost, 127.0.0.1).";
  }

  if (code === "auth/popup-closed-by-user") {
    return "La fenetre Google a ete fermee avant la fin. Reessaye.";
  }

  if (code === "auth/cancelled-popup-request") {
    return "Connexion interrompue. Reessaye dans quelques secondes.";
  }

  return "Impossible de se connecter. Reessaye.";
}

// Real-time Vote Subscription
function subscribeToVotes() {
  const votesRef = collection(db, "votes");
  const q = query(votesRef, orderBy("timestamp", "desc"), limit(50));

  onSnapshot(q, (snapshot) => {
    let yesCount = 0;
    let noCount = 0;
    const votes = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const choice = data.choice;

      if (choice === "yes") yesCount++;
      else if (choice === "no") noCount++;

      votes.push({
        timestamp: data.timestamp?.toDate() || new Date(),
        choice: choice,
        userId: data.userId?.substring(0, 8) || "Unknown"
      });
    });

    updateStats(yesCount, noCount);
    updateChart(yesCount, noCount);
    updateVotesTable(votes);
  });
}

function subscribeToContributors() {
  const contributorsRef = collection(db, "contributors");
  const q = query(contributorsRef, orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    let totalContributors = 0;
    const contributors = [];
    const breakdown = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalContributors++;

      contributors.push({
        name: data.fullName || "N/A",
        email: data.email || "N/A",
        type: data.contributionType || "N/A",
        status: data.status || "pending_review"
      });

      const type = data.contributionType;
      breakdown[type] = (breakdown[type] || 0) + 1;
    });

    updateContributorCount(totalContributors);
    updateContributorsTable(contributors);
    updateBreakdown(breakdown);
  });
}

function updateStats(yesCount, noCount) {
  const total = yesCount + noCount;
  document.getElementById("totalYes").textContent = String(yesCount);
  document.getElementById("totalNo").textContent = String(noCount);
  document.getElementById("totalVotes").textContent = String(total);

  const yesPct = total === 0 ? 0 : Math.round((yesCount / total) * 100);
  document.getElementById("percentage").textContent = `${yesPct}% oui`;
}

function updateChart(yesCount, noCount) {
  if (votesChart) {
    votesChart.data.datasets[0].data = [yesCount, noCount];
    votesChart.update();
  }
}

function updateVotesTable(votes) {
  const tbody = document.getElementById("votes-tbody");
  
  if (votes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">Aucun vote pour le moment</td></tr>';
    return;
  }

  tbody.innerHTML = votes
    .map((vote) => {
      const time = vote.timestamp.toLocaleTimeString("fr-FR");
      const choiceClass = vote.choice === "yes" ? "yes" : "no";
      const choiceText = vote.choice === "yes" ? "Oui" : "Non";

      return `
        <tr>
          <td>${time}</td>
          <td>
            <span class="choice-badge ${choiceClass}">${choiceText}</span>
          </td>
          <td>${vote.userId}...</td>
        </tr>
      `;
    })
    .join("");
}

function updateContributorCount(count) {
  document.getElementById("totalContributors").textContent = String(count);
}

function updateContributorsTable(contributors) {
  const tbody = document.getElementById("contributors-tbody");

  if (contributors.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">Aucun contributeur pour le moment</td></tr>';
    return;
  }

  tbody.innerHTML = contributors
    .map((contrib) => {
      const typeLabel = getTypeLabel(contrib.type);
      const statusClass = contrib.status === "active" ? "active" : "pending";
      const statusText = contrib.status === "active" ? "Actif" : "En attente";

      return `
        <tr>
          <td>${contrib.name}</td>
          <td>${contrib.email}</td>
          <td>${typeLabel}</td>
          <td>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </td>
        </tr>
      `;
    })
    .join("");
}

function updateBreakdown(breakdown) {
  const container = document.getElementById("contribution-breakdown");

  if (Object.keys(breakdown).length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #8892a6;">Pas de données</p>';
    return;
  }

  container.innerHTML = Object.entries(breakdown)
    .map(([type, count]) => {
      return `
        <div class="breakdown-item">
          <div class="breakdown-label">${getTypeLabel(type)}</div>
          <div class="breakdown-count">${count}</div>
        </div>
      `;
    })
    .join("");
}

function getTypeLabel(type) {
  const labels = {
    developer: "Développement",
    legal: "Juridique",
    communication: "Communication",
    investigation: "Investigation",
    fundraising: "Financement",
    volunteer: "Bénévolat"
  };
  return labels[type] || type;
}

loginButton.addEventListener("click", async () => {
  authStatus.textContent = "Connexion en cours...";
  try {
    const user = await signInAdminWithGoogle();
    if (!isAllowedAdmin(user)) {
      await signOutCurrentUser();
      showGate("Acces refuse: ce compte Google n'est pas autorise.");
      return;
    }

    showDashboard();
  } catch (error) {
    console.error("Admin sign-in error:", error);
    showGate(getFriendlyAuthError(error));
  }
});

watchAuthState(async (user) => {
  if (!user) {
    showGate("Connecte-toi avec le compte admin autorise.");
    return;
  }

  if (!isAllowedAdmin(user)) {
    await signOutCurrentUser();
    showGate("Acces refuse: ce compte Google n'est pas autorise.");
    return;
  }

  showDashboard();
});

console.log("✓ Admin Dashboard: Real-time subscriptions active");
