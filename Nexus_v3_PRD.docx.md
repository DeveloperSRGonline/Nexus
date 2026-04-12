**NEXUS**

V2.0 Product Requirements Document

Your tasks. Your habits. Your focus. One workspace.

| Field | Value |
| :---- | :---- |
| App Name | Nexus |
| Version | 2.0.0 |
| Document Date | March 16, 2026 |
| Author | Senior Product Architect |
| Status | Developer-Ready Draft |
| Target Platform | Desktop (Electron) \+ Web (React) |
| Primary Stack | React · TypeScript · Convex · Clerk · TailwindCSS |
| AI Layer | Claude claude-sonnet-4-20250514 via Anthropic API |

# **1\. Executive Summary**

Nexus is a personal productivity command center that unifies task management, habit tracking, and deep-work focus sessions into a single cohesive desktop application. It is built for a single user — a student or knowledge worker who manages daily academic tasks, builds behavioral routines, and requires structured focus time without context-switching between separate apps. The reference UI (TickTick-inspired) demonstrates that the target user is already comfortable with priority-flagged task lists, streak-based habit logging, and Pomodoro-style timers, making Nexus a purpose-built replacement rather than a new concept.

Nexus v2 elevates the v1 experience with a refined design system, a richer habit analytics panel (monthly calendar heat-map, check-in rate, streak counter), an expanded Pomodoro system with named timers and linked focus records, and deep cross-module linking so that a task can be directly attached to a focus session and a habit can surface in the Today view alongside regular tasks. The app is explicitly personal — there are no team workspaces, no sharing features, and no multi-user permissions. This constraint keeps the architecture simple, the authentication minimal, and the UI uncluttered.

# **2\. What Changed (v1 → v2)**

| Area | v1 Decision | v2 Decision | Reason |
| :---- | :---- | :---- | :---- |
| Design System | Ad-hoc colors | Full token spec from screenshots | Consistency across all components |
| Habit Tracking | Simple boolean per day | Full analytics: streak, rate, calendar, log | Matches reference UI depth |
| Focus Timer | Single unnamed Pomodoro | Named timers, Pomo \+ Stopwatch, linked tasks | Reference UI shows named timer objects |
| Today View | Flat task list | Three-column layout: Overdue / Today / Today's Habit | Direct reference from screenshots |
| Task Priority | 2 levels | 4 levels with color-coded circles (P1–P4) | Matches reference UI flag system |
| Lists | Single inbox | Multiple user-defined lists with emoji icons | Reference UI shows Work, Personal, Learning, Fitness |
| View Options | None | Group by, Sort by, Hide Completed, Show Details, Kanban/List toggle | Power-user workflow from reference |
| Search | None | Global search: tasks, tags, lists, filters | Modal search from screenshot 3 |
| Auth | None | Clerk (single user, minimal config) | Secure local state \+ sync |
| Data Layer | localStorage | Convex (real-time, offline-capable) | Sync \+ reactive UI without manual fetch |

# **3\. Technology Stack**

| Layer | Technology | Version | Reason |
| :---- | :---- | :---- | :---- |
| UI Framework | React | 18.x | Component model, hooks, context |
| Language | TypeScript | 5.x | Type safety for complex data models |
| Desktop Shell | Electron | 30.x | Cross-platform desktop; system tray, notifications |
| Styling | TailwindCSS | 3.x | Token-based, purge-safe, consistent spacing |
| State | Zustand | 4.x | Lightweight global state for UI slices |
| Backend/DB | Convex | Latest | Real-time reactive DB \+ serverless functions |
| Authentication | Clerk | Latest | Single-user auth, session management |
| AI Layer | Anthropic SDK | Latest | Task suggestions, habit insights, natural language input |
| Date/Time | date-fns | 3.x | Timezone-safe date math for habits/tasks |
| Notifications | node-notifier | Latest | OS-level habit reminders |
| Icons | Lucide React | Latest | Matches reference UI icon style |
| Charts | Recharts | 2.x | Habit calendar heatmap, focus duration graph |
| Testing | Vitest \+ Testing Library | Latest | Unit \+ component tests |
| Packaging | electron-builder | Latest | Windows/macOS/Linux installers |

DECISION: Convex is chosen over Supabase because its real-time subscriptions eliminate polling and give the Today view instant reactive updates when a task or habit is marked complete on any device. If the user goes offline, Convex's optimistic updates keep the UI responsive.

# **4\. Authentication**

Nexus uses Clerk for authentication. Because Nexus is a personal, single-user app, the auth flow is intentionally minimal: the user signs up once, and the Clerk session is used to scope all Convex queries automatically.

### **4.1 Setup Steps**

1. Create a Clerk application in the Clerk dashboard.

2. Set Auth Type to "Single Session" — disables multi-device conflict warnings.

3. Configure Convex \+ Clerk integration via CLERK\_JWT\_ISSUER\_DOMAIN in Convex env.

4. Wrap the React app in \<ClerkProvider\> \+ \<ConvexProviderWithClerk\>.

5. Protect all Convex queries with ctx.auth.getUserIdentity() — reject unauthenticated calls.

### **4.2 What Auth Gives For Free**

| Feature | Provided By | Notes |
| :---- | :---- | :---- |
| Secure session tokens | Clerk | JWT-based, auto-refresh |
| Google/Apple SSO | Clerk | Enable in dashboard, zero code change |
| User identity in Convex | Clerk+Convex | ctx.auth.getUserIdentity() returns userId |
| Protected routes | Clerk | \<SignedIn\> / \<SignedOut\> wrappers |
| Session persistence | Clerk | Stays logged in across app restarts |

SIMPLIFICATION RULE: No roles, no teams, no invites, no organization features. Every Convex query filters by identity.subject (Clerk userId). A second user cannot see any data belonging to the first user.

# **5\. Design System**

All design values are extracted directly from the reference screenshots. Every component specification below maps to visible UI patterns in the provided images.

## **5.1 Colour Tokens**

| Token Name | Hex Value | Usage |
| :---- | :---- | :---- |
| \--color-primary | \#3B5BDB | Buttons, active checkboxes, today label, focus timer ring |
| \--color-primary-hover | \#4A6CF7 | Button hover, input focus ring |
| \--color-bg-app | \#F2F2F7 | Application background (light gray) |
| \--color-bg-surface | \#FFFFFF | Cards, sidebar, modals, input fields |
| \--color-bg-active-row | \#EEF2FF | Sidebar active item highlight |
| \--color-text-primary | \#1C1C1E | Task titles, headings, body text |
| \--color-text-secondary | \#8E8E93 | Metadata labels, placeholders, subtitles |
| \--color-text-link | \#3B5BDB | "Today" date badge, hyperlinks |
| \--color-text-done | \#C7C7CC | Completed task text (with strikethrough) |
| \--color-priority-p1 | \#FF3B30 | P1 checkbox ring, flag icon (red) |
| \--color-priority-p2 | \#FF9F0A | P2 checkbox ring, flag icon (orange) |
| \--color-priority-p3 | \#3B5BDB | P3 checkbox ring, flag icon (blue) |
| \--color-priority-p4 | \#C7C7CC | P4 / no priority checkbox ring (gray) |
| \--color-premium | \#FF9500 | Crown icon, premium badge |
| \--color-habit-done | \#30D158 | Habit streak indicator (not used in checkbox) |
| \--color-habit-check | \#3B5BDB | Habit daily check-in circle fill |
| \--color-divider | \#E5E5EA | Table borders, column separators, rules |
| \--color-danger | \#FF3B30 | Error states, delete confirmations |
| \--color-callout-bg | \#EEF2FF | Info callout box background |
| \--color-callout-border | \#3B5BDB | Info callout left accent bar |

## **5.2 Typography Scale**

| Token | Size | Weight | Color Token | Usage |
| :---- | :---- | :---- | :---- | :---- |
| \--text-display | 32px / 40px line | 700 | \--color-text-primary | Page title (Today, Inbox, Habit) |
| \--text-heading-1 | 20px / 28px line | 600 | \--color-text-primary | Section headers, modal titles |
| \--text-heading-2 | 16px / 24px line | 600 | \--color-text-primary | Card titles, list headers |
| \--text-body-lg | 14px / 22px line | 400 | \--color-text-primary | Task titles, habit names |
| \--text-body-md | 13px / 20px line | 400 | \--color-text-primary | Sub-task text, list items |
| \--text-meta | 12px / 18px line | 400 | \--color-text-secondary | Due date label, "Today Inbox" tag |
| \--text-label | 11px / 16px line | 500 | \--color-text-secondary | Column headers in Today view |
| \--text-mono | 32px / 40px line | 300 | \--color-text-primary | Focus timer countdown display |

Font Family: Inter (all text). Monospace exception: Timer display only uses Inter with tabular-nums CSS feature setting.

## **5.3 Spacing Scale**

| Token | px Value | Usage |
| :---- | :---- | :---- |
| \--space-1 | 4px | Icon gap, tight inline padding |
| \--space-2 | 8px | Tag padding, button inner gap |
| \--space-3 | 12px | Card inner padding (compact), list item padding-y |
| \--space-4 | 16px | Card inner padding (default), modal padding |
| \--space-5 | 20px | Section gap within a panel |
| \--space-6 | 24px | Card gap, sidebar item padding-x |
| \--space-8 | 32px | Panel gap, section top margin |
| \--space-10 | 40px | Page header bottom margin |
| \--space-12 | 48px | Page-level top padding |

## **5.4 Border Radius Rules**

| Component | Radius | CSS Value |
| :---- | :---- | :---- |
| Task card | 8px | border-radius: 8px |
| Habit card (row) | 10px | border-radius: 10px |
| Modal / Dialog | 14px | border-radius: 14px |
| Dropdown menu | 10px | border-radius: 10px |
| Input field | 6px | border-radius: 6px |
| Button (primary) | 8px | border-radius: 8px |
| Button (pill/start) | 999px | border-radius: 999px |
| Checkbox (circle) | 50% | border-radius: 50% |
| Tag / Badge | 4px | border-radius: 4px |
| Sidebar item | 8px | border-radius: 8px |
| Calendar day circle | 50% | border-radius: 50% |
| Focus timer ring | 50% | border-radius: 50% (SVG circle) |

## **5.5 Shadow Scale**

| Level | CSS box-shadow value | Usage |
| :---- | :---- | :---- |
| resting | 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04) | Task card, habit row |
| hover | 0 4px 12px rgba(0,0,0,0.10) | Card hover lift |
| modal | 0 20px 60px rgba(0,0,0,0.18) | Create Habit dialog, Add Timer dialog |
| dropdown | 0 8px 24px rgba(0,0,0,0.12) | Priority picker, Section dropdown |
| FAB | 0 4px 16px rgba(59,91,219,0.35) | Start button (focus timer) |

## **5.6 Component Specifications**

### **Task Card**

Background: \#FFFFFF. Border-radius: 8px. Shadow: resting. Padding: 12px 16px. Layout: horizontal flex with checkbox-circle on left (20px), task title (flex-grow), meta row below title (font-size 12px, color \--color-text-secondary). Hover: shadow elevates to hover level. Checkbox circles are 20×20px, border 2px solid \[priority color\], filled when complete.

### **Priority Checkbox**

A 20×20px circle. Border-radius: 50%. Border: 2px solid \[priority color\]. When complete: background fills with primary blue (\#3B5BDB) \+ white checkmark SVG icon inside. Priority colors: P1 \= \#FF3B30, P2 \= \#FF9F0A, P3 \= \#3B5BDB, P4 \= \#C7C7CC. No-priority task shows gray border.

### **Button — Primary**

Background: \#3B5BDB. Text: white, 14px, weight 500\. Border-radius: 8px. Padding: 8px 20px. Hover: background \#4A6CF7. Disabled: opacity 0.4. Focus: outline 2px solid \#3B5BDB \+ 2px offset.

### **Button — Pill (Start / Save)**

Background: \#3B5BDB. Text: white, 15px, weight 500\. Border-radius: 999px. Padding: 12px 40px. Width: 160px (Focus Start button). Box-shadow: FAB level. This is the main CTA for the Pomodoro start action.

### **Button — Ghost**

Background: transparent. Text: \#8E8E93, 14px. Border: 1px solid \#E5E5EA. Border-radius: 8px. Padding: 8px 20px. Hover: background \#F2F2F7. Used for Cancel actions in modals.

### **Input Field**

Background: \#FFFFFF. Border: 1px solid \#E5E5EA. Border-radius: 6px. Padding: 8px 12px. Font: 14px Inter. Focus border: 2px solid \#3B5BDB. Placeholder color: \#C7C7CC.

### **Dropdown / Select**

Trigger: same as input field with a chevron-down icon on the right (color \#8E8E93). Open state: border 2px solid \#3B5BDB. Menu: white card, border-radius 10px, shadow: dropdown, max-height 280px, overflow-y scroll. Active item: text color \#3B5BDB with a checkmark SVG on the right. Other items: hover background \#F2F2F7.

### **Sidebar Navigation**

Width: 220px. Background: \#FFFFFF. Item height: 36px. Item padding: 0 12px. Active item: background \#EEF2FF, text color \#3B5BDB, icon color \#3B5BDB. Inactive item: text color \#1C1C1E, icon color \#8E8E93. Section headers (Lists, Tags, Filters): font-size 12px, color \#8E8E93, weight 500, uppercase. Count badge: font-size 12px, color \#8E8E93, float right.

### **Modal / Dialog**

Overlay: rgba(0,0,0,0.3) backdrop. Card: background \#FFFFFF, border-radius 14px, shadow: modal. Width: 480px (habit/timer create). Header: title in 18px bold, left-aligned. Content padding: 24px. Footer: right-aligned button group (Save / Cancel).

### **Today View Column**

Three columns: Overdue, Today, Today's Habit. Each column has a header row (column label in 12px uppercase \+ count badge \+ \+ icon). Column background: none (sits on app bg \#F2F2F7). Cards in column: white, resting shadow, 8px gap between cards.

### **Habit Row Card**

Background: \#FFFFFF. Border-radius: 10px. Shadow: resting. Padding: 12px 16px. Left: emoji icon (32×32px circle). Middle: habit name (14px bold) \+ meta chips (lightning bolt streak / footprint day count). Right: 7 check-in circles for the rolling week (22×22px each, filled \#3B5BDB when complete, gray empty ring when missed, striped when future).

### **Focus Timer Ring**

SVG circle, 280×280px. Background ring: stroke \#E5E5EA, stroke-width 8\. Progress ring: stroke \#3B5BDB, stroke-width 8, stroke-linecap round, animated stroke-dashoffset. Center: time display in 48px Inter weight 300\. Below ring: linked task name in 13px \#8E8E93. Below that: Start/Pause/Stop button (pill style).

### **Tag**

Background: \#EEF2FF. Text: \#3B5BDB, 12px, weight 500\. Border-radius: 4px. Padding: 2px 8px. Used for "Today", "Inbox" metadata labels on task cards and Pomodoro task links.

## **5.7 DO / DON'T Table**

| Principle | DO | DON'T |
| :---- | :---- | :---- |
| Checkbox circles | Use colored ring matching priority level | Use plain gray squares for all tasks |
| Task meta row | Show "Today Inbox" as two separate tag chips in blue \+ gray | Show a single long string "Today · Inbox" |
| Completed tasks | Fade to \#C7C7CC with strikethrough, keep in collapsed section | Delete completed tasks from the visible list immediately |
| Priority colors | P1 Red, P2 Orange, P3 Blue, P4 Gray — never reorder | Invent new priority levels or change color assignments |
| Button hierarchy | One primary blue pill CTA per context; ghost Cancel beside it | Two full-color buttons at equal weight |
| Habit check circles | Fill with solid \#3B5BDB on completion | Use green for check-in circles (green is streak indicator only) |
| Dropdown menus | Show active item with blue text \+ right-side checkmark | Bold the active item without visual confirmation |
| Today label | Display "Today" in \#3B5BDB (blue) as a date reference | Display "Today" in red or orange — those colors are reserved for priority |
| Sidebar counts | Show counts in \#8E8E93 as plain numbers on the right | Use colored badges that compete with priority colors |
| Timer display | Use tabular-nums for monospace digit width (no layout shift) | Use proportional digits that jump layout on every second tick |

# **6\. Data Flow**

## **6.1 Task Creation Flow**

| Step | Actor | Action / State Change |
| :---- | :---- | :---- |
| 1 | User | Clicks "+ Add task" input in Inbox or Today column |
| 2 | UI | Focuses inline text input; expands with date, priority, list context toolbar |
| 3 | User | Types task title; optionally sets priority flag, due date, list, tags |
| 4 | UI | Optimistically appends task to visible list with temporary local ID |
| 5 | Convex | mutation("tasks:create") is called with userId, title, priority, dueDate, listId, tags |
| 6 | Convex DB | Inserts document in tasks table, returns real \_id |
| 7 | Convex | Real-time subscription fires, replaces temp ID with real \_id |
| 8 | UI | Task card renders with correct ID; no visible flicker due to optimistic update |

## **6.2 Habit Check-In Flow**

| Step | Actor | Action / State Change |
| :---- | :---- | :---- |
| 1 | User | Clicks check-in circle for a specific day on a habit row |
| 2 | UI | Circle fills immediately (optimistic) with \#3B5BDB |
| 3 | Convex | mutation("habitLogs:toggle") called with habitId, date, userId |
| 4 | Convex DB | Upserts document in habitLogs table; toggles completed boolean |
| 5 | Convex | Subscription fires; queries("habits:getStats") recalculates streak, rate, monthly count |
| 6 | UI | Detail panel (right side) updates: streak count, monthly check-in count, rate % |
| 7 | UI | Calendar heatmap dot for that date fills blue |

## **6.3 Focus Session Flow**

| Step | Actor | Action / State Change |
| :---- | :---- | :---- |
| 1 | User | Navigates to Pomodoro tab, selects a named timer (or default) |
| 2 | User | Optionally links a task via the "Focus \>" task picker dropdown |
| 3 | User | Clicks "Start" pill button |
| 4 | UI | SVG ring begins animating; countdown decrements every 1000ms via setInterval |
| 5 | UI | Zustand focus store sets: { state: "running", timerId, taskId, startedAt } |
| 6 | Electron | Window title updates to "25:00 \- Nexus" for OS-level visibility |
| 7 | Timer | Countdown reaches 00:00 |
| 8 | Electron | OS notification fires: "Pomo complete\! Take a 5-minute break." |
| 9 | Convex | mutation("focusRecords:create") saves { timerId, taskId, duration, completedAt } |
| 10 | UI | Overview panel on right updates Today's Pomos count and duration instantly |

## **6.4 AI Task Suggestion Flow**

| Step | Actor | Action / State Change |
| :---- | :---- | :---- |
| 1 | User | Types natural language in "+ Add task" input, e.g. "Study DCN chapter 4 tomorrow" |
| 2 | UI | After 800ms debounce, detects intent pattern (date phrase \+ verb) |
| 3 | Convex | action("ai:parseTask") called with raw text |
| 4 | Anthropic | POST /v1/messages with system prompt defining JSON output schema: { title, dueDate, priority, list } |
| 5 | Anthropic | Returns structured JSON with parsed fields |
| 6 | UI | Pre-fills the expanded input form with parsed values; user can edit before saving |
| 7 | User | Confirms or adjusts, then saves |
| 8 | Convex | Normal task creation mutation proceeds |

## **6.5 Offline Flow**

| Scenario | Behaviour | Data Risk |
| :---- | :---- | :---- |
| Create task offline | Convex queues mutation; shows in UI via optimistic update | Zero — syncs on reconnect |
| Check-in habit offline | Same as above; habitLogs:toggle queued | Zero — syncs on reconnect |
| Run focus timer offline | Timer runs client-side; focusRecord created on reconnect | Record is saved post-session |
| Search offline | Full-text search degraded to local Zustand cache only | Partial — cache may be stale |

# **7\. Feature Specifications**

## **7.1 Today View**

What it is: The default landing screen showing all actionable items for the current day in a three-column kanban-style layout.

What the user sees:

* Page title "Today" with hamburger-menu icon on the left.

* "Overdue" column: shows tasks past their due date with a count badge and "Postpone" link. Completed tasks collapse into an expandable "Completed N" row.

* "Today" column: tasks due today, count badge, \+ icon to add new tasks. Each card shows a priority-colored checkbox, task title, "Today" tag in blue, and list name in gray.

* "Today's Habit" column: habit cards that are scheduled for today from the Habits module.

* View options menu (top right ...): Group by Date, Sort by Date, Hide Completed, Show Details, List view / Kanban toggle.

Mobile behaviour: Columns stack vertically; Today column first, Overdue second, Habits third.

AI integration: If user enables natural language task entry, the AI parser pre-fills date/priority fields.

## **7.2 Inbox**

What it is: A flat, unfiltered list of all tasks not assigned to a custom list, used as a capture zone.

What the user sees:

* Header "Inbox" with sort (1↑) and options (...) icons.

* Inline "+ Add task" input field at the top with an expandable toolbar (calendar icon \+ chevron-down).

* Expanding toolbar reveals: Priority flags (P1 red / P2 orange / P3 blue / P4 gray), List picker, Tags picker, Attachment, Add from Template, Input Box Setting.

* Task rows: priority checkbox circle, title, due date in blue if today, list tag in gray.

* "Completed N" collapsible section at the bottom with count.

Mobile behaviour: Single column, full width, inline add at top.

## **7.3 Next 7 Days**

What it is: A view scoped to tasks due within the rolling 7-day window from today.

What the user sees: Same layout as Inbox but filtered. Group by Date is the default grouping. Each date group has a collapsible header with the date label and task count.

## **7.4 Task Detail / Metadata**

### **Priority**

4 levels: P1 (flag red \#FF3B30), P2 (flag orange \#FF9F0A), P3 (flag blue \#3B5BDB), P4 / none (flag gray \#C7C7CC). Set via the flag icon row in the expanded toolbar.

### **Due Date**

Date picker dropdown inline with the task input. Calendar widget shows current month with today highlighted in filled blue circle. Navigation arrows for month changes. OK / Cancel buttons.

### **Lists**

Picker shows: Inbox (default), Work, Personal, Learning, Fitness, Welcome. Each list has an emoji icon. User can create new lists. Active list shown with blue checkmark.

### **Tags**

Searchable tag picker. "No Tags" empty state with tag icon. User types to create new tags. Multiple tags per task allowed.

### **Attachments**

File picker opens system dialog. Attached files shown as chips below task title. Supported types: PDF, images, documents. Stored in Convex file storage.

### **Templates**

"Add from Template" opens a template picker showing saved task templates. Templates can pre-fill title, priority, list, and tags.

## **7.5 Habit Tracker**

What it is: A dedicated module for building and tracking daily behavioral routines with streaks, check-in rates, and calendar history.

### **Habits List View**

What the user sees:

* Header "Habit" with a dropdown arrow (for switching sections) and \+ icon for new habits.

* Rolling 7-day header row: day abbreviations (Tue Wed Thu...) \+ date numbers. Today's column header is highlighted in blue.

* Each habit is a full-width card row with: emoji icon (32px circle), habit name (14px bold), lightning-bolt streak chip, footprint day count chip, 7 check-in circles (one per day).

* Check-in circles: filled blue \= complete, light gray empty \= incomplete, striped \= future/not scheduled.

### **Habit Detail Panel**

Opens on right side (or full-screen panel) when clicking a habit row. Shows:

* Habit name \+ emoji in header with options (...) icon.

* 4 stat cards: Monthly check-ins (count \+ "Days"), Total check-ins, Monthly check-in rate (%), Streak count.

* Monthly calendar heatmap: current month grid. Completed days filled with blue circles (\#3B5BDB). Today highlighted with blue border ring.

* "Habit Log on \[Month\]" section: text entries the user writes as journal notes for check-ins.

### **Create Habit Modal**

Fields:

* Emoji icon picker (defaults to smiley face, click to change).

* Habit name text input.

* Frequency dropdown: Daily → opens sub-picker with day-of-week circles (S M T W T F S, all selected by default), user can deselect days.

* Goal dropdown: "Achieve it all" (complete every scheduled day) and other goal modes.

* Start Date: date picker calendar widget, defaults to today.

* Goal Days: Forever / 7 days / 21 days / 30 days / 100 days / 365 days / Custom.

* Section: Others / Morning / Afternoon / Night / \+ Add Section.

* Reminder: \+ button opens time picker (30-min intervals). Multiple reminders allowed.

* "Auto pop-up of habit log" checkbox: when checked, a log input appears after each check-in.

Save / Cancel button row at bottom.

## **7.6 Focus / Pomodoro Module**

What it is: A focus session manager combining a named Pomodoro timer and a stopwatch, with linked tasks and focus statistics.

### **Timer Area**

What the user sees:

* "Pomodoro" page header with Pomo / Stopwatch tab switcher.

* \+ icon to add a new named timer; ... for focus mode options (Full-Screen, Mini Mode, Statistics, Focus Settings).

* "Focus \>" link: opens task picker to link the current session to a specific task.

* Large SVG circular ring (280px) with countdown time in center in 48px Inter weight-300 font.

* "Start" pill button below ring (160px wide, blue, rounded).

### **Pomo Mode**

Default 25 minutes. Configurable per named timer. Progress ring depletes clockwise. On completion: OS notification fires. Break timer can auto-start (configurable in Focus Settings).

### **Stopwatch Mode**

Counts up from 00:00. No automatic stop. User stops manually; duration recorded to Focus Record.

### **Named Timers**

Users create named timers via "Add Timer" modal: emoji icon, name, Timer Mode (Pomo with minute field, or Stopwatch). Multiple timers show as tabs or switcher below the header.

### **Overview Panel**

Right panel shows:

* Today's Pomos (count integer).

* Today's Focus Duration (minutes).

* Total Pomos (all-time count).

* Total Focus Duration (all-time minutes).

* Focus Record list: each completed session as a row. \+ icon to manually add records. "No focus record yet" empty state with illustration.

Mobile behaviour: Overview panel collapses into an accordion below the timer.

## **7.7 Search**

What it is: A global full-text search overlay accessible from the sidebar search icon.

What the user sees:

* Full-screen overlay with a top search bar (magnifying glass icon \+ "Search" placeholder \+ X close icon).

* Blue underline on the search input (active focus state).

* Empty state: binoculars illustration \+ "Search tasks, tags, lists and filters" label.

* Results grouped by type: Tasks, Tags, Lists, Filters.

* Each result shows title \+ metadata (list, due date).

* Keyboard shortcut: Cmd+K / Ctrl+K to open.

## **7.8 Lists Management**

What it is: User-defined collections that organize tasks beyond the default Inbox.

What the user sees: Sidebar section "Lists" with each list showing an emoji icon and name. Clicking navigates to a filtered task view. Right-click or ... on a list opens: Rename, Change Icon, Delete, Archive.

Default lists: Inbox (system), Work, Personal, Learning, Fitness (user-created). All lists except Inbox can be deleted.

## **7.9 Tags**

What it is: Free-form labels that cross-cut lists for filtering.

Sidebar section "Tags" shows all tags with task count. Clicking a tag filters the task view to matching tasks only.

## **7.10 Completed & Trash**

Completed: shows all completed tasks across all lists. Tasks are sorted by completion date descending.

Trash: shows deleted tasks for 30 days. "Empty Trash" button permanently deletes all. Individual restore button per task.

## **7.11 View Options**

| Option | Values | Effect |
| :---- | :---- | :---- |
| Group by | Date / Priority / List | Groups task rows under collapsible date/priority/list headers |
| Sort by | Date / Priority / Name | Reorders tasks within each group |
| Hide Completed | On / Off | Collapses Completed section from view entirely |
| Show Details | On / Off | Expands each task card to show sub-task count, tags, due time |
| View Mode | List / Kanban | Switches between vertical list and column-based kanban layout |

# **8\. Data Models (Convex Schema)**

| Collection | Key Fields | Notes |
| :---- | :---- | :---- |
| tasks | \_id, userId, title, listId, priority (1-4), dueDate, dueTime, tags\[\], attachments\[\], isCompleted, completedAt, deletedAt, createdAt, updatedAt | Core task entity |
| lists | \_id, userId, name, emoji, color, sortOrder, createdAt | User-defined lists including Inbox (system) |
| tags | \_id, userId, name, color, createdAt | Global tags across all lists |
| habits | \_id, userId, name, emoji, frequency (daily/custom), scheduledDays\[\], goal, startDate, goalDays, section, reminders\[\], autoPopLog, createdAt | Habit definitions |
| habitLogs | \_id, userId, habitId, date (YYYY-MM-DD), completed, logNote, createdAt | One document per habit per day |
| timers | \_id, userId, name, emoji, mode (pomo/stopwatch), pomoDuration, createdAt | Named focus timer presets |
| focusRecords | \_id, userId, timerId, linkedTaskId, mode, duration, completedAt | One record per completed focus session |
| userSettings | \_id, userId, defaultPomoMins, breakMins, autoStartBreak, theme, notificationsEnabled, updatedAt | Singleton per user |
| templates | \_id, userId, name, title, priority, listId, tags\[\], createdAt | Reusable task creation templates |

# **9\. API Endpoints (Convex Functions)**

All functions are scoped to the authenticated user via ctx.auth.getUserIdentity(). Unauthorized calls return an error immediately.

### **Tasks**

| Type | Function Name | Description |
| :---- | :---- | :---- |
| query | tasks:getToday | Returns tasks due today \+ overdue tasks for Today view |
| query | tasks:getNext7Days | Returns tasks with dueDate within next 7 days, grouped by date |
| query | tasks:getByList | Returns all tasks for a given listId, excluding deleted |
| query | tasks:getCompleted | Returns all completed tasks sorted by completedAt desc |
| query | tasks:getTrashed | Returns soft-deleted tasks within 30-day retention window |
| mutation | tasks:create | Inserts new task document |
| mutation | tasks:update | Updates title, priority, dueDate, listId, tags, attachments |
| mutation | tasks:toggleComplete | Flips isCompleted; sets or clears completedAt |
| mutation | tasks:softDelete | Sets deletedAt; removes from all views except Trash |
| mutation | tasks:hardDelete | Permanently removes from DB (called from Trash) |
| mutation | tasks:restore | Clears deletedAt (restores from Trash) |
| mutation | tasks:emptyTrash | Hard deletes all documents where deletedAt is set for userId |
| action | ai:parseTask | Calls Anthropic API to parse natural language task input into structured fields |

### **Habits**

| Type | Function Name | Description |
| :---- | :---- | :---- |
| query | habits:getAll | Returns all active habits for the user |
| query | habits:getStats | Returns streak, monthly count, check-in rate for a habitId |
| query | habits:getCalendar | Returns habitLogs for a given habitId and month |
| mutation | habits:create | Inserts new habit definition |
| mutation | habits:update | Updates habit settings (name, frequency, reminder, etc.) |
| mutation | habits:delete | Soft-deletes habit and all associated logs |
| mutation | habitLogs:toggle | Upserts a habitLog document; toggles completed boolean |
| mutation | habitLogs:setNote | Saves journal note text on a habitLog document |

### **Focus / Timers**

| Type | Function Name | Description |
| :---- | :---- | :---- |
| query | timers:getAll | Returns all named timers for the user |
| query | focusRecords:getOverview | Returns today count, today duration, total count, total duration |
| query | focusRecords:getList | Returns paginated focus records sorted by completedAt desc |
| mutation | timers:create | Creates a named timer preset |
| mutation | timers:update | Updates timer name, emoji, duration |
| mutation | timers:delete | Deletes a timer; preserves orphaned focusRecords |
| mutation | focusRecords:create | Inserts a completed focus session record |
| mutation | focusRecords:delete | Removes a manually added focus record |

### **Lists, Tags, Settings**

| Type | Function Name | Description |
| :---- | :---- | :---- |
| query | lists:getAll | Returns all lists for the user, sorted by sortOrder |
| mutation | lists:create | Creates a new list with name and emoji |
| mutation | lists:update | Updates list name, emoji, color |
| mutation | lists:delete | Deletes list; moves tasks to Inbox (listId \= null) |
| query | tags:getAll | Returns all tags with task count |
| mutation | tags:create | Creates a new tag |
| mutation | tags:delete | Deletes tag; removes from all task.tags arrays |
| query | userSettings:get | Returns singleton settings document |
| mutation | userSettings:update | Updates Pomo duration, break mins, theme, notifications |
| action | search:query | Full-text search across tasks.title, tags.name, lists.name |

# **10\. Development Roadmap**

| Phase | Name | Features | Target Duration |
| :---- | :---- | :---- | :---- |
| 1 | Foundation | Project scaffolding (Electron \+ React \+ TypeScript \+ Tailwind). Convex setup \+ Clerk auth integration. Sidebar navigation shell. Inbox view with task CRUD. Priority flags P1–P4. Due date picker. Design token implementation (colors, typography, spacing). | 2 weeks |
| 2 | Task Power | Today view (3-column layout). Next 7 Days view. Lists with emoji icons. Tags system. View options (group by, sort by, hide completed). Completed section. Trash with restore \+ empty. Inline task expansion toolbar (list picker, tag picker, attachment, template). | 2 weeks |
| 3 | Habits | Habits module: list view with 7-day rolling row. Create Habit modal (all fields). Habit detail panel (stats, calendar heatmap). Daily check-in toggle. Habit Log notes. Auto pop-up log option. Habit sections (Morning / Afternoon / Night). Habits appearing in Today view. | 2 weeks |
| 4 | Focus | Pomodoro module: Pomo \+ Stopwatch modes. Named timers (Add Timer modal). SVG circular ring animation. Task linking. OS notifications. Focus overview panel (stats). Focus Records list. Full-Screen and Mini Mode. Focus Settings (durations, auto-break). | 2 weeks |
| 5 | AI & Search | Global search modal (Cmd+K). Full-text search across tasks, tags, lists. AI natural language task parser (Anthropic API). Habit insight summaries (weekly AI digest). Template system. Reminder system via node-notifier. | 2 weeks |
| 6 | Polish & Ship | Responsive mobile layout. Keyboard navigation (full app). Accessibility audit (WCAG 2.1 AA). Performance profiling (Convex query optimization). Electron packaging (Windows \+ macOS). Onboarding flow for new users. Error boundary \+ offline banner. | 1 week |

TOTAL ESTIMATED TIMELINE: 11 weeks for a solo developer moving at full-time pace. Add 40% buffer for debugging Electron IPC edge cases and Convex subscription performance tuning under large datasets.

# **11\. Non-Functional Requirements**

| Category | Requirement | Target / Spec |
| :---- | :---- | :---- |
| Performance | Today view initial render | Under 200ms with up to 500 tasks |
| Performance | Search result latency | Under 300ms for full-text results |
| Performance | Habit calendar render | Under 150ms for 365-day heatmap |
| Performance | Timer tick accuracy | setInterval drift under 50ms per minute; compensate with Date.now() delta |
| Security | Data isolation | Every Convex query filters by identity.subject; no cross-user data leakage possible |
| Security | API key storage | Anthropic API key in Electron main process env only; never exposed to renderer |
| Offline | Task / habit CRUD | Optimistic updates via Convex; all mutations queued and synced on reconnect |
| Offline | Focus timer | Runs fully client-side; focusRecord saved when connection restores |
| Offline | Search | Falls back to local cache; degraded quality is acceptable and communicated to user |
| Accessibility | Keyboard navigation | All interactive elements focusable; Tab order matches visual order |
| Accessibility | Screen reader labels | All icon buttons have aria-label attributes |
| Accessibility | Color contrast | All text meets WCAG 2.1 AA (4.5:1 for normal, 3:1 for large) |
| Scalability | Task volume | UI must not degrade with up to 10,000 tasks; use virtual scrolling above 200 visible rows |
| Scalability | Habit log size | 3 years of daily logs \= \~1095 documents per habit; calendar render must stay under 150ms |
| AI | Unavailability handling | If Anthropic API is unreachable, AI parse fails silently; user sees unmodified input (no error shown) |
| AI | Token budget per call | Max 500 output tokens for task parse; max 1000 for habit insight summary |
| Notifications | Reminder delivery | OS notification fires within 10 seconds of scheduled reminder time |
| Storage | File attachments | Max 10MB per attachment; stored in Convex file storage; user can download but not preview all types |

# **12\. Critical Questions**

These questions have no answers in this document. They require architectural thinking before writing a single line of code. Skip them and you will refactor later.

6. The Pomodoro timer must survive the app being minimized, the screen being locked, and Electron's renderer process potentially being suspended on low-memory systems. What is your specific strategy for keeping the timer's countdown accurate — and how will you communicate drift to the user if it occurs? (Hint: setInterval is not sufficient alone.)

7. When a habit has a custom frequency (e.g., Mon/Wed/Fri only), the Today view should only show that habit on scheduled days. The Habits 7-day row should show striped circles on unscheduled days. What single data structure and query will serve both the Today view filter and the 7-day row rendering without two separate code paths?

8. The "Today" label in blue (\#3B5BDB) is used as both a date indicator on task cards AND as a section header in the task picker dropdown. The same blue is the primary brand color for buttons and checkboxes. If a user creates a list and names it "Today", what breaks, and how do you prevent the UI from confusing list identity with date identity?

9. Convex subscriptions are real-time, but re-renders caused by habit stats recalculation (streak, rate, monthly count) on every check-in toggle could cause expensive re-renders across the entire habits list. At what data volume does this become a problem, and how will you structure your Convex queries to make stats derivation lazy rather than eager?

10. The reference UI shows that the "Today's Habit" column in the Today view is populated from the Habits module. But a habit is not a task. What is your data contract between the two modules — will you create a read-only "phantom task" from a habit, or will the Today view directly query the habits collection? What are the tradeoffs of each approach for completion state, undo, and data integrity?

11. The focus session links to a task via "Focus \>". What happens to that link if the user deletes the linked task mid-session? What happens if they complete the task during a focus session? The focus record stores linkedTaskId — should this reference be nullable, and should the UI handle the orphaned state gracefully or prevent deletion of in-use tasks?

12. The app is personal (single user), but Clerk supports multi-device login. If the same user opens Nexus on both a laptop and a phone simultaneously, Convex real-time subscriptions will push updates to both. The Pomodoro timer running on the laptop will NOT be aware of any client-side state on the phone. How do you prevent the user from accidentally starting two focus sessions simultaneously, and how do you handle the session conflict if they do?

13. Your search function (action("search:query")) runs full-text search. Convex's built-in search index must be declared in the schema. If you declare a search index on tasks.title and later need to also search tasks.description (a field you add in Phase 6), Convex requires a schema migration and index rebuild. What fields will you commit to in the search index now, knowing that changing it later has a deployment cost?

14. The AI task parser sends raw user input to the Anthropic API. This input may contain personal, sensitive, or academically confidential content (exam names, assignment titles, personal schedule). How will you disclose this to the user, and will you build an opt-out mechanism in Phase 5, or require an explicit opt-in before the first AI call?

15. This PRD specifies Inter as the font throughout. Electron bundles a Chromium renderer, but Inter is not a system font on Windows or most Linux distributions. Will you bundle the Inter font files inside the Electron package (increasing binary size by \~1MB), use a Google Fonts CDN call (requires internet for first render), or accept system font fallback on offline first launch? What does the user see on first launch without an internet connection on a system without Inter installed?

