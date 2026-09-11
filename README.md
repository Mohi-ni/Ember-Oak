# Ember & Oak — Café & Bistro Website

**Industry:** Restaurant / Café

**Objective:** A premium, visual multi-page restaurant website for the SuuSri AI web
development task, with a wood-fired bistro identity, a filterable menu, and a
reservation system with automatic table assignment.

## Technologies Used
- HTML5 — 6 separate pages
- CSS3 — Flexbox & Grid, bento-style dish grid, responsive design
- JavaScript (ES6+) — mobile menu, review slider, menu filter, FAQ accordion, reservation form + confirmation, page transitions
- GSAP + ScrollTrigger — hero entrance sequence, page-header animation, stat counters

## Pages
| Page | File | Contents |
|---|---|---|
| Home | `index.html` | Hero, trust ticker, Chef's Picks (bento grid), Reviews, CTA banner |
| About | `about.html` | Our story, animated stats |
| Menu | `menu.html` | Full menu with category filter (Starters/Mains/Desserts/Drinks) |
| Gallery | `gallery.html` | Masonry-style photo grid |
| Reservation | `reservation.html` | Booking form with validation + table/section assignment confirmation |
| Contact | `contact.html` | Address, hours table, map, FAQ accordion |

## Features
- Shared navbar with active-page indicator and smooth fade page transitions
- Bento-style "Chef's Picks" grid with one featured dish
- Live menu category filter (no page reload)
- Auto-playing review slider with star ratings
- Reservation form with real validation, and a confirmation card that assigns
  a table/section based on party size (e.g. parties of 8+ get the Private Dining Room)
- FAQ accordion, floating WhatsApp button, back-to-top button
- Fully responsive: Desktop → Tablet → Mobile

## GSAP Animations Used
- Orchestrated hero entrance timeline (eyebrow → heading → text → buttons)
- Page-header fade-in on inner pages
- Scroll-triggered stat counter reveal on the About page

## How to Run
Open `index.html` in any modern browser — no build step or server required.

## Developer Info
- Developer: Mohini
- Task: SuuSri AI — Industry-Based Website Development (Restaurant/Café track)
