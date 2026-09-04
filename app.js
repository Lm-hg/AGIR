import { db, initAnonymousAuth, watchAuthState } from "./firebase-init.js";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// DOM Elements
const yesButton = document.querySelector('[data-vote="yes"]');
const noButton = document.querySelector('[data-vote="no"]');
const statusText = document.getElementById("status");
const yesCountEl = document.getElementById("yesCount");
const noCountEl = document.getElementById("noCount");
const totalEl = document.getElementById("total");
const yesBar = document.getElementById("yesBar");
const noBar = document.getElementById("noBar");
const resultsSection = document.getElementById("results-section");
const contributionSection = document.getElementById("contribution-section");
const contributionForm = document.getElementById("contribution-form");
const formStatus = document.getElementById("form-status");

const VOTER_KEY_STORAGE = "agir_voter_key";
const VOTE_CHOICE_STORAGE = "agir_vote_choice";

// Canvas Setup pour shader animation
const canvas = document.getElementById("shader-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Shader animation
let time = 0;
function drawShaders() {
  time += 0.005;
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `hsla(180, 100%, 50%, ${0.02 + Math.sin(time) * 0.01})`);
  gradient.addColorStop(0.5, `hsla(250, 100%, 60%, ${0.01 + Math.cos(time * 0.7) * 0.01})`);
  gradient.addColorStop(1, `hsla(360, 100%, 50%, ${0.015 + Math.sin(time * 0.5) * 0.01})`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  requestAnimationFrame(drawShaders);
}
drawShaders();

// Particles Animation
function createParticles() {
  const container = document.getElementById("particles");
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    
    const size = Math.random() * 3 + 1;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 15 + 10;
    const hue = Math.random() * 60 + 180; // Cyan to blue range
    
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.background = `hsla(${hue}, 100%, 50%, 0.6)`;
    particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, 100%, 50%, 0.8)`;
    particle.style.animation = `float ${duration}s infinite ease-in-out`;
    particle.style.animationDelay = Math.random() * duration + "s";
    
    container.appendChild(particle);
  }
}

createParticles();

// Firebase Vote Handling
let currentUserVote = null;
let currentUserId = null;
let voteSubscriptionStarted = false;

function getOrCreateVoterKey() {
  const existing = localStorage.getItem(VOTER_KEY_STORAGE);
  if (existing) return existing;

  const newKey = `v_${crypto.randomUUID()}`;
  localStorage.setItem(VOTER_KEY_STORAGE, newKey);
  return newKey;
}

const voterKey = getOrCreateVoterKey();

watchAuthState((user) => {
  if (user) {
    currentUserId = user.uid;
    console.log("✓ User ID:", currentUserId);
    checkUserVote();
    if (!voteSubscriptionStarted) {
      subscribeToVotes();
      voteSubscriptionStarted = true;
    }
  }
});

async function checkUserVote() {
  if (!currentUserId) return;

  const localVote = localStorage.getItem(VOTE_CHOICE_STORAGE);
  if (localVote === "yes" || localVote === "no") {
    currentUserVote = localVote;
    lockVoting(currentUserVote);
    statusText.textContent = "Tu as déjà voté. Merci pour ton engagement !";
    if (currentUserVote === "yes") {
      showContributionForm();
    }
  }

  try {
    const voteDocRef = doc(db, "votes", voterKey);
    const voteDoc = await getDoc(voteDocRef);
    if (voteDoc.exists()) {
      const savedChoice = voteDoc.data().choice;
      if (savedChoice === "yes" || savedChoice === "no") {
        currentUserVote = savedChoice;
        localStorage.setItem(VOTE_CHOICE_STORAGE, savedChoice);
        lockVoting(currentUserVote);
        statusText.textContent = "Tu as déjà voté. Merci pour ton engagement !";

        if (currentUserVote === "yes") {
          showContributionForm();
        }
      }
      return;
    }
  } catch (error) {
    console.error("Error checking vote doc:", error);
  }
  
  const votesRef = collection(db, "votes");
  const q = query(votesRef, where("userId", "==", currentUserId));
  
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const voteDoc = querySnapshot.docs[0];
      currentUserVote = voteDoc.data().choice;
      localStorage.setItem(VOTE_CHOICE_STORAGE, currentUserVote);
      lockVoting(currentUserVote);
      statusText.textContent = "Tu as déjà voté. Merci pour ton engagement !";
      
      // Si vote Oui, affiche le formulaire
      if (currentUserVote === "yes") {
        showContributionForm();
      }
    }
  } catch (error) {
    console.error("Error checking vote:", error);
  }
}

function subscribeToVotes() {
  const votesRef = collection(db, "votes");
  const q = query(votesRef, orderBy("timestamp", "desc"));
  
  onSnapshot(q, (snapshot) => {
    let yesCount = 0;
    let noCount = 0;
    
    snapshot.forEach((doc) => {
      const choice = doc.data().choice;
      if (choice === "yes") yesCount++;
      else if (choice === "no") noCount++;
    });
    
    renderResults(yesCount, noCount);
  });
}

function renderResults(yesCount, noCount) {
  const total = yesCount + noCount;
  
  yesCountEl.textContent = String(yesCount);
  noCountEl.textContent = String(noCount);
  totalEl.textContent = `Total des votes: ${total}`;
  
  const yesPct = total === 0 ? 0 : Math.round((yesCount / total) * 100);
  const noPct = total === 0 ? 0 : 100 - yesPct;
  
  yesBar.style.width = `${yesPct}%`;
  noBar.style.width = `${noPct}%`;
  
  resultsSection.classList.remove("hidden");
}

function lockVoting(choice) {
  yesButton.disabled = true;
  noButton.disabled = true;
  
  if (choice === "yes") {
    yesButton.classList.add("selected");
  } else if (choice === "no") {
    noButton.classList.add("selected");
  }
}

async function vote(choice) {
  if (currentUserVote) {
    statusText.textContent = "Tu as déjà voté sur ce projet.";
    return;
  }
  
  if (!currentUserId) {
    statusText.textContent = "Authentification en cours... réessaye.";
    return;
  }
  
  try {
    const voteDocRef = doc(db, "votes", voterKey);
    const existingVoteDoc = await getDoc(voteDocRef);
    if (existingVoteDoc.exists()) {
      currentUserVote = existingVoteDoc.data().choice;
      localStorage.setItem(VOTE_CHOICE_STORAGE, currentUserVote);
      lockVoting(currentUserVote);
      statusText.textContent = "Tu as déjà voté sur ce navigateur.";
      if (currentUserVote === "yes") {
        showContributionForm();
      }
      return;
    }

    await setDoc(voteDocRef, {
      voterKey,
      userId: currentUserId,
      choice: choice,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent.substring(0, 200)
    });
    
    currentUserVote = choice;
    localStorage.setItem(VOTE_CHOICE_STORAGE, choice);
    statusText.textContent = "Merci ! Ton vote a bien été enregistré. 🎉";
    lockVoting(choice);
    
    if (choice === "yes") {
      setTimeout(showContributionForm, 500);
    }
  } catch (error) {
    console.error("Error saving vote:", error);
    statusText.textContent = "Erreur lors de l'enregistrement. Réessaye.";
  }
}

function showContributionForm() {
  contributionSection.classList.remove("hidden");
  setTimeout(() => {
    contributionSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

// Contribution Form Handling
contributionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  if (!currentUserId || currentUserVote !== "yes") {
    formStatus.textContent = "Erreur de validation. Réessaye.";
    return;
  }
  
  const email = document.getElementById("email").value.trim();
  const fullName = document.getElementById("full-name").value.trim();
  const contributionType = document.getElementById("contribution-type").value;
  
  if (!email || !fullName || !contributionType) {
    formStatus.textContent = "Veuillez remplir tous les champs.";
    return;
  }
  
  try {
    const contributorsRef = collection(db, "contributors");
    await addDoc(contributorsRef, {
      userId: currentUserId,
      email: email,
      fullName: fullName,
      contributionType: contributionType,
      timestamp: serverTimestamp(),
      status: "pending_review"
    });
    
    formStatus.textContent = "✓ Merci ! Nous te contactons bientôt.";
    formStatus.style.color = "var(--success)";
    contributionForm.style.pointerEvents = "none";
    contributionForm.style.opacity = "0.5";
  } catch (error) {
    console.error("Error saving contribution:", error);
    formStatus.textContent = "Erreur lors de l'enregistrement.";
  }
});

// Button Event Listeners
yesButton.addEventListener("click", () => vote("yes"));
noButton.addEventListener("click", () => vote("no"));

initAnonymousAuth();

