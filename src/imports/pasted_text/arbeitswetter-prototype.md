Build a polished frontend-only prototype for a web-based app called “Arbeitswetter” (working title: Klimaplaner Pro / Arbeitswetter).
 
The goal is to prototype the UI/UX of a decision-support weather app for outdoor and semi-outdoor work. This is NOT a consumer weather app. It is a practical occupational safety and work-planning tool that translates weather and climate conditions into clear risk states, decisions, and recommended measures for work.
 
Important:
- Frontend only
- No backend
- No real APIs
- No authentication logic
- No actual calculations required
- Use mocked/sample data only
- The prototype should feel realistic and product-ready
- Focus on information architecture, interaction design, layout, visual hierarchy, responsive behavior, and usability
- The app must work beautifully across all breakpoints: mobile, tablet, laptop, desktop
- Build as a responsive web app, not a native app clone
- The prototype should look slick, minimal, modern, and calm, with strong UX clarity and enterprise-grade usability
 
## Product context
 
This tool is designed primarily for people responsible for work planning and occupational safety in weather-exposed jobs.
 
Core personas:
1. Vorarbeiter / Polier (foreman / site lead)
   - Plans work times and tasks for teams
   - Needs to know when to shift heavy work and insert breaks
 
2. Sicherheitsbeauftragter / Arbeitsschutz (safety officer / occupational safety)
   - Ensures compliance and worker protection
   - Needs to know when work must be adapted or stopped
 
3. Schichtplaner / Disposition (shift planner / dispatcher)
   - Allocates resources and schedules efficiently
   - Needs to reorganize shifts under heat, cold, UV, or severe weather conditions
 
## Core product idea
 
The app logic is:
 
Zustand → Risiko → Entscheidung → unterstützende Maßnahmen
(State → Risk → Decision → Supporting Measures)
 
This is the key UX principle:
- First show the current state clearly
- Then explain the risk
- Then guide the decision
- Then show prioritized measures
 
The app should help users answer:
- Is work okay as planned?
- When does it become critical?
- What should be changed?
- What measures are recommended right now?
- How does the next few hours / next 5 days look for planning?
 
## Main status model
 
The app uses a simple four-level status model:
 
1. Normal
   - Everything okay
   - No measures required
 
2. Vorsorge
   - Early precautions recommended
 
3. Pflicht
   - Measures required
 
4. Kritisch
   - Work is not suitable without measures / adaptation
 
Use a clear but refined visual system inspired by traffic-light logic:
- Green = Normal
- Yellow = Vorsorge
- Orange = Pflicht
- Red = Kritisch
 
Important:
Do not make it look childish or overly “alert dashboard”.
It should feel professional, trustworthy, restrained, and highly legible.
 
## Information model
 
The prototype should show these content areas:
 
### 1. Home / Heute
This is the primary screen.
 
Show:
- Current status
- Active warning state
- Brief explanation of why the state is what it is
- Primary recommendation
- “Critical time window” for today
- Hour-by-hour or time-block based day view
- Quick access to more detail
 
Example content ideas:
- “Sakla: 3 von 4 – Hohe Belastung”
- “Schwere körperliche Arbeit bis 13:00 Uhr erledigen”
- “Kritisches Zeitfenster: 14:00–16:00 vermeiden”
- “Warum ist es kritisch?”
 
This screen should prioritize:
1. Status
2. Recommended measures
3. Time-based planning guidance
 
### 2. Planung
A planning view for the next 5 days.
 
Show:
- 5-day outlook
- Clear indication of which days / time windows are critical
- Daily summary cards
- Timeline or mini chart showing risk progression
- Ability to compare days at a glance
- Emphasis on work planning, not weather nerd detail
 
### 3. Warnung
A warnings area for urgent alerts.
 
Show:
- DWD-style severe weather warning cards
- Critical alerts such as heat stress, thunderstorm risk, strong wind, UV, cold
- Clear severity and timestamping
- Optional push-style banner or notification preview in the UI
- Keep the layout minimal and easy to scan
 
### 4. Einstellungen
A lightweight settings/input view.
 
User input fields should include:
- Standort
- Arbeitsschwere: Leicht / Mittel / Schwer
- Sonne: Direkt / Teilweise / Schatten
 
Optional UI concept:
- Quick-toggle presets
- Saved job profile chips
- “Schnellumschaltung” between common work conditions
 
The settings should feel lightweight and practical, not like a long form.
 
### 5. Maßnahmen
A measures view or expandable module that organizes recommendations according to the TOP principle:
 
A. Technische Maßnahmen
- Shade
- Cooling / ventilation
- Wind protection
- Shelter
- Protected cabins
 
B. Organisatorische Maßnahmen
- Shift work earlier/later
- Schedule breaks
- Interrupt or stop work
- Move heavy work
- Adjust shift planning
 
C. Personenbezogene Maßnahmen
- Drink water
- Sun protection
- Protective clothing
- Adjust behavior
 
The UI should present these in a prioritized and readable way.
The current most important measures should always be visible on the home screen.
Deeper detail can live in the dedicated measures screen or drawer.
 
## UX principles
 
The UX should follow these rules:
- “At a glance” clarity
- Progressive disclosure
- Minimal cognitive load
- Mobile-first information hierarchy
- Strong typography
- Excellent contrast and accessibility
- Large tap targets
- Few but meaningful actions
- Calm, low-noise interface
- No unnecessary charts, decorations, or clutter
- Avoid generic weather-app clichés
- Avoid trying to show too much meteorological detail
 
The app is not for weather enthusiasts.
It is for practical work decisions under weather-related risk.
 
## Visual design direction
 
Create a slick, minimal, premium interface with these characteristics:
- Clean grid system
- Generous spacing
- Soft surfaces and restrained elevation
- High-quality typography
- Clear status colors used sparingly and purposefully
- Neutral base palette with selective semantic color use
- Refined iconography
- Contemporary enterprise SaaS meets modern mobile web
- Feels reliable, calm, and functional
- Subtle motion only where it improves usability
 
Design references in spirit:
- minimal Scandinavian-inspired UI
- modern operational dashboard
- polished health/safety decision tool
- quiet confidence, not flashy
 
Use:
- rounded corners
- clean cards
- sticky key actions where useful
- well-designed empty / update / loading / state transitions
- desktop layouts with strong panels and overview density
- mobile layouts with stacked cards and clear primary actions
 
## Important app states to design
 
Include realistic screens/states for:
- Before use / first entry
  - minimal onboarding or direct start
  - user provides location + work severity + sun/shade
- Normal state
- Vorsorge state
- Pflicht state
- Kritisch state
- Loading state
- Updated status state
- Error / fallback state
- Warning active state
 
## Key interactions to prototype
 
Prototype the frontend interactions for:
- Switching between tabs/navigation items
- Changing work severity
- Changing sun/shade condition
- Selecting a location
- Viewing why a condition is critical
- Expanding measures
- Browsing hour-by-hour details
- Reviewing 5-day outlook
- Viewing active warnings
 
These interactions can be fake/mock but should feel coherent.
 
## Navigation
 
Use a clean responsive navigation pattern.
 
Preferred main navigation items:
- Heute
- Planung
- Maßnahmen
- Warnung
- Einstellungen
 
On mobile:
- bottom nav or similarly ergonomic pattern
 
On desktop:
- left sidebar or top navigation, whichever feels more elegant
 
## Components to include
 
Design and implement a reusable component system for the prototype:
- status pill / badge
- risk card
- recommendation card
- warning banner
- timeline / hourly strip
- daily outlook card
- segmented control
- chips for work conditions
- accordion or expandable sections
- modal / drawer for deeper explanations
- empty state
- loading skeleton state
 
## Data/content style
 
Use realistic German UI copy.
Keep content concise and practical.
Tone should be:
- direct
- clear
- calm
- actionable
- non-alarmist
 
Example text style:
- “Maßnahmen empfohlen”
- “Kritisches Zeitfenster von 14:00 bis 16:00”
- “Schwere körperliche Arbeit nach Möglichkeit vorziehen”
- “UV-Belastung hoch”
- “Warum ist das relevant?”
- “Empfohlene Maßnahmen”
 
## Technical expectations for the prototype
 
Build this as a modern frontend prototype with:
- responsive layout across all breakpoints
- polished component-based structure
- mock data
- no backend dependency
- no real weather integration
- no real calculations
- no forms that need submission
- no login/signup flow unless shown only as a placeholder concept
 
The prototype should be visually complete enough for stakeholder review, product discussion, and user-testing conversations.
 
## Deliverables to generate
 
Generate:
1. A full responsive web app frontend prototype
2. Multiple screens/views with realistic mocked content
3. A coherent design system and reusable components
4. Smooth navigation between views
5. Polished empty/loading/error states
6. A presentation-quality result suitable for product concept review
 
## Most important success criteria
 
This prototype should make stakeholders immediately understand:
- who the app is for
- what problem it solves
- how the decision flow works
- how the status system guides action
- how the app supports both immediate action and short-term planning
 
The prototype should feel like:
“a serious, beautifully designed occupational weather decision tool”
not:
“a generic weather dashboard”
 
Build the UI accordingly.
