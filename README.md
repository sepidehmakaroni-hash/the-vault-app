# The Vault — Members' Club · Front-end handoff

Design direction: **The Combination — original direction: the app is the vault door. A combination dial turns with the scroll, photos open like doors, and the five sign-up steps are five turns of the dial. Pattern: Monogram Field**

This package is one of seven design directions for the same app (same flow, same copy). The colours, type and shapes of this direction are the `.sk-combo` rules and CSS variables at the end of `styles.css`; they override the base tokens listed below.

This folder is a working, clickable front-end of the membership app: landing page → 5-step membership request → confirmation → login. English is the default language, Persian (RTL) is the second. It is the visual and behavioural reference for building the real app.

## Run it

No build step, no dependencies.

- Quickest: double-click `index.html`.
- Better (same as a real server): in this folder run `npx serve` or `python3 -m http.server 8000`, then open the address it prints.
- Open it at phone width (browser dev tools → device toolbar, 390 × 844). Desktop layout is not designed yet; on wide screens the app sits in a centred 480 px column.
- Jump to a screen or language with the URL: `index.html?screen=s1&lang=fa`. Screens: `home`, `s1`…`s5`, `sent`, `login`.

## Files

| File | What it is |
|---|---|
| `index.html` | All screens, as one template. This is the markup to port. |
| `styles.css` | Colour tokens, fonts, the pattern, inputs, buttons, wax seal. |
| `app.js` | Screen logic (navigation, slider, chips, tabs) and **every UI string in EN and FA** (the `T` object). |
| `The Vault App - ….pdf` | Every screen as a picture, English then Persian (22 pages), for reference and sign-off. |
| `runtime.js` | ~80 lines that make the template run in a browser. Not for production. |
| `assets/img` | Logo lockup and monogram (PNG + SVG), ornament, the pattern (transparent gold PNG). |
| `assets/photos` | Landing-page photos and the membership-card photo. |
| `assets/fonts` | Awaken (display, same as the logo wordmark), Bodoni Moda, Archivo, Vazirmatn. |
| `assets/source` | Original vector logo (`logo.ai`) and vector pattern (`pattern-vector.pdf`). |

## Design tokens

| Token | Value | Use |
|---|---|---|
| Vault Black | `#1B1C1E` | page ground, plaques |
| Forest | `#274332` | patterned panels |
| Ivory | `#ECE5D6` | text, paper card |
| Gold | `#A08A58` | borders, double frames, foil base |
| Gold light | `#CDB57E` | labels, links, icons |
| Oxblood | `#571A1F` | wax seal only |
| Foil gradient | `linear-gradient(180deg,#D6C08B,#A08A58 52%,#87713F)` | primary buttons, selected chips, done steps |

Type: English display `Awaken`; English text `Archivo`; Persian `Vazirmatn` (titles weight 300); Roman numerals `Bodoni Moda`. Corner radius 2 px. Controls are at least 44 px tall; primary buttons 54 px. Double frame = 1 px gold border, 5 px gap, 1 px gold border at 45% opacity.

## Screens and flow

1. **Home** (`home`): hero slider with three slides, "Member Events" card, statement, "Hospitality and lounge experiences", calendar with three events, three cards (Private gallery, Restaurant and lounge, Member events), closing "Ready to join?" block, footer logo. "Request membership" and "Submit request" go to step 1; "Member login" goes to login.
2. **Step 1 · Personal information** (`s1`): first name*, last name*, mobile* (country code + number), email, gender* (Mr / Ms), country*, city*, date of birth (day, month, year).
3. **Step 2 · Online presence** (`s2`): website, Instagram, LinkedIn, field of activity* (one of eight), position / job title*.
4. **Step 3 · Introduction** (`s3`): short introduction* (max 600), reason for membership* (max 600), interests* (one or more of seven).
5. **Step 4 · Referrer** (`s4`, optional): referrer name, referrer phone, relationship.
6. **Step 5 · Terms** (`s5`): two required checkboxes, link to terms. "Submit request" goes to the confirmation.
7. **Submitted** (`sent`): confirmation text, "Back to home", "Log in to account".
8. **Login** (`login`): tabs "Log in with code" (mobile number → "Send verification code") and "Log in with password" (mobile / email / username + password → "Log in"), "Forgot password?".

`*` = required.

## Added in this version

- **Menu**: the header has the monogram and one Menu button. It opens a full-screen list (Home, Membership, Events, Experiences, Request membership, Member login).
- **Every link has a page** (`?screen=pg&pg=…`): `membership`, `events`, `experiences`, `gallery`, `restaurant`, `mevents`, `ev0`–`ev2` (one per event), `terms`, `forgot`. The calendar rows, benefit cards, "View benefits", the terms link and "Forgot password?" all lead to one of them.
- **Code entry** (`?screen=otp`): after "Send verification code".
- **Member area** (`?screen=m&tab=…`) with a bottom tab bar: `home` (card, opening hours, next visit, next event, quick actions), `reserve` (seven rooms, then day, time, party size and guest names; `&sub=form&zone=1`, `&sub=done`), `events` (reply per event), `concierge` (topic, details, when), `account` (charge balance hidden until tapped, guests, top up, statement, house rules, log out; `&sub=guests`).
- The member-area copy (rooms, rules, concierge hours) comes from The Vault's own operating documents. The balance figure is an example.

## Not built — needs the real back end

- Form validation and error messages (required fields are only marked, not checked).
- Submitting the request, sending the SMS code, password login, forgot password.
- The country-code picker (shown as a button) and date-of-birth validation (three plain inputs; Persian calendar).
- The code-entry screen after "Send verification code", the terms page, and everything after login.
- "View benefits" and the nav links only scroll inside the landing page.

## Before going live

- **Photos**: the interior photos are mood references collected from other sources; replace them with the club's own or licensed photos. The membership-card image is a brand mock-up.
- **Awaken font**: check the web-font licence before publishing.
- **English copy** is a translation of the Persian text of the current site; have it reviewed.
- Events in the calendar are the sample events from the current site.

## Install as an app (PWA)

This folder is also an installable, offline app: `manifest.json` (name, icon, full-screen), `sw.js` (saves every file on the device) and `assets/icons`.

1. Upload the whole folder to any HTTPS address (for example `https://your-domain/vault/`).
2. On a phone or tablet open that address once while online.
3. iPhone / iPad (Safari): Share → Add to Home Screen. Android (Chrome): menu → Install app / Add to Home screen.

After that it opens from its own icon (The Vault monogram), full screen with no browser bar, and works with no internet. To ship an update, change the `CACHE` name in `sw.js`.
