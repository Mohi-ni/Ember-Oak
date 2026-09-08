// @ts-nocheck
// ===============================
// Ember & Oak - script.js
// Shared across all pages
// ===============================

// ----- Page fade-in on load -----
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

// ----- Smooth page transitions between tabs -----
document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (this.target === "_blank" || href.startsWith("http")) return;
    e.preventDefault();
    document.body.classList.remove("loaded");
    document.body.classList.add("fade-out");
    setTimeout(() => { window.location.href = href; }, 300);
  });
});

// ----- Mobile Menu Toggle -----
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
  });
}

// ----- Back to top -----
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (backToTop) {
    if (window.scrollY > 60) backToTop.classList.add("show");
    else backToTop.classList.remove("show");
  }
});
if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ----- Animated Counters (About page) -----
const counters = document.querySelectorAll(".counter");
let countersStarted = false;
function startCounters() {
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    let current = 0;
    const increment = target / 80;
    const update = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current).toLocaleString();
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    update();
  });
}
if (counters.length > 0) {
  const statsSection = document.querySelector(".about-stats");
  window.addEventListener("scroll", () => {
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100 && !countersStarted) {
      countersStarted = true;
      startCounters();
    }
  });
}

// ----- Review Slider (Home page) -----
const reviewTrack = document.getElementById("reviewTrack");
const reviewDotsWrap = document.getElementById("reviewDots");
if (reviewTrack && reviewDotsWrap) {
  const slides = document.querySelectorAll(".review-card");
  let current = 0;
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToReview(i));
    reviewDotsWrap.appendChild(dot);
  });
  const dots = document.querySelectorAll(".review-dots span");
  function goToReview(index) {
    current = index;
    reviewTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }
  setInterval(() => { current = (current + 1) % slides.length; goToReview(current); }, 5000);
}

// ----- Menu Category Filter (Menu page) -----
const menuFilterPills = document.querySelectorAll(".menu-filters .filter-pill");
const menuItems = document.querySelectorAll(".menu-item");
if (menuFilterPills.length > 0) {
  menuFilterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      menuFilterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const selected = pill.getAttribute("data-filter");
      menuItems.forEach((item) => {
        const matches = selected === "all" || item.getAttribute("data-category") === selected;
        item.classList.toggle("hidden-by-filter", !matches);
      });
    });
  });
}

// ----- FAQ Accordion -----
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqItems.forEach((other) => other.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

// ----- Reservation Form + Table Assignment (Reservation page) -----
const form = document.getElementById("reservationForm");

// table/section assignment based on party size — a small "convenience"
// touch so the confirmation feels like a real system, not just a message
function assignTable(guests) {
  if (guests <= 2) return { table: "Window Table for 2", area: "Main Dining Room" };
  if (guests <= 4) return { table: "Table for 4", area: "Garden Patio" };
  if (guests <= 8) return { table: "Long Table", area: "Private Dining Room" };
  return { table: "Custom Group Setup", area: "Event Hall (our team will call to confirm layout)" };
}

if (form) {
  const confirmationCard = document.getElementById("confirmationCard");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const guests = document.getElementById("guests");
    const date = document.getElementById("date");
    const time = document.getElementById("time");

    const nameError = document.getElementById("nameError");
    const phoneError = document.getElementById("phoneError");
    const guestsError = document.getElementById("guestsError");
    const dateError = document.getElementById("dateError");
    const timeError = document.getElementById("timeError");

    [nameError, phoneError, guestsError, dateError, timeError].forEach((el) => (el.textContent = ""));

    if (name.value.trim().length < 3) { nameError.textContent = "Please enter your full name."; isValid = false; }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone.value.trim())) { phoneError.textContent = "Enter a valid 10-digit phone number."; isValid = false; }

    if (guests.value === "") { guestsError.textContent = "Please select party size."; isValid = false; }
    if (date.value === "") { dateError.textContent = "Please choose a date."; isValid = false; }
    if (time.value === "") { timeError.textContent = "Please choose a time."; isValid = false; }

    if (!isValid) return;

    const [year, month, day] = date.value.split("-").map(Number);
    const prettyDate = new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    const guestCount = parseInt(guests.value, 10);
    const assignment = assignTable(guestCount);

    document.getElementById("confirmName").textContent = name.value.trim();
    document.getElementById("confirmDate").textContent = `${prettyDate}, ${time.value}`;
    document.getElementById("confirmGuests").textContent = `${guests.value} Guests`;
    document.getElementById("confirmTable").textContent = `${assignment.table} — ${assignment.area}`;

    form.hidden = true;
    confirmationCard.hidden = false;
    if (typeof gsap !== "undefined") {
      gsap.from(confirmationCard, { opacity: 0, y: 16, duration: 0.5 });
    }
  });

  const bookAnotherBtn = document.getElementById("bookAnotherBtn");
  if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener("click", () => {
      confirmationCard.hidden = true;
      form.hidden = false;
      form.reset();
    });
  }
}

// ----- GSAP Animations -----
gsap.registerPlugin(ScrollTrigger);

if (document.querySelector(".hero")) {
  const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });
  heroTl
    .from(".hero-content .eyebrow", { opacity: 0, y: 16, duration: 0.5 })
    .from(".hero-content h1", { opacity: 0, y: 26, duration: 0.6 }, "-=0.3")
    .from(".hero-content p", { opacity: 0, y: 20, duration: 0.5 }, "-=0.35")
    .from(".hero-btns", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3");
}

if (document.querySelector(".page-header")) {
  gsap.from(".page-header h1", { opacity: 0, y: 18, duration: 0.55 });
  gsap.from(".page-header p", { opacity: 0, y: 18, duration: 0.55, delay: 0.1 });
}

if (document.querySelector(".about-stats")) {
  gsap.from(".about-stats .stat", {
    opacity: 0, y: 20, duration: 0.5, stagger: 0.08,
    scrollTrigger: { trigger: ".about-stats", start: "top 85%" },
  });
}