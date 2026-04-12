# Nexus - Phased Development Plan

> **PRD Reference**: Nexus v2.0 (Personal Productivity Command Center)  
> **Tech Stack**: React + Vite (Frontend) | Express + Mongoose (Backend) | Clerk Auth  
> **Current Status**: Foundation partially built (old v1 structure exists)  
> **Strategy**: Small, incremental phases with clear deliverables

---

## 📊 Current State Analysis (Pre-Phase 0)

### ✅ Already Implemented (Partial v1)
**Frontend (client/):**
- ✅ Clerk authentication integration
- ✅ React Router setup with protected routes
- ✅ Basic AppShell with Sidebar component
- ✅ Zustand stores (taskStore, projectStore, uiStore)
- ✅ TaskCard, TaskForm, TaskFilters components
- ✅ Kanban board components (KanbanBoard, KanbanCard, KanbanColumn)
- ✅ CalendarView, TimelineView components
- ✅ Basic UI components (Button, Badge, Spinner, EmptyState, ViewSwitcher)
- ✅ Pages: Dashboard, Tasks, Projects, ProjectDetail, Events, Queue, Settings
- ✅ API service layer with axios interceptors
- ✅ SCSS design system with variables, mixins, breakpoints
- ✅ Toast notifications (react-hot-toast)

**Backend (server/):**
- ✅ Express server with security middleware (helmet, cors, morgan)
- ✅ Mongoose MongoDB connection
- ✅ Task model with priority, status, subtasks, activity log
- ✅ Full CRUD API for tasks (`/api/tasks`)
- ✅ Clerk authentication middleware (`requireAuth`)
- ✅ Consistent API response format (`apiResponse.js`)
- ✅ Error handling middleware

### ❌ Major Gaps (Per PRD v2 Requirements)
- ❌ **Design System Mismatch**: Current SCSS doesn't match PRD v2 token spec (colors, spacing, typography)
- ❌ **Missing Core Features**: No Habits module, No Focus/Pomodoro module, No Lists management
- ❌ **Wrong Data Model**: Task model uses `status: "todo/in_progress/review/done"` but PRD wants `isCompleted` boolean + 4-level priority (P1-P4)
- ❌ **Missing Pages**: Today View, Inbox, Next 7 Days, Habits, Focus/Pomodoro, Search
- ❌ **No Lists/Tags System**: Only tasks exist, no list collections or tag management
- ❌ **No View Options**: No group by, sort by, hide completed, kanban/list toggle
- ❌ **No Today View**: 3-column layout (Overdue/Today/Today's Habit) doesn't exist
- ❌ **No Habit Tracker**: Zero implementation
- ❌ **No Focus Timer**: Zero implementation
- ❌ **No Search**: Global Cmd+K search doesn't exist
- ❌ **No AI Integration**: Natural language task parser not built
- ❌ **Mobile Responsiveness**: MobileNav exists but not fully responsive
- ❌ **Server Issues**: `express-validator` unused, no input validation, no graceful shutdown, no 404 handler

---

## 🎯 Phase 0: Cleanup & Preparation

**Goal**: Prepare codebase for v2 implementation by cleaning up old structure and aligning with PRD spec

### Phase 0.1: Audit & Refactor Data Models
- [x] 0.1.1: Update Task model to match PRD v2 schema
  - Change `priority` enum from `"low/medium/high/urgent"` to `1/2/3/4` (P1-P4)
  - Change `status` to `isCompleted` boolean
  - Add `dueTime` field
  - Add `listId` field (reference to Lists collection)
  - Add `deletedAt` field for soft delete/trash
  - Add `attachments` array field
  - Keep `subtasks`, `tags`, `order` fields
  - Remove `projectId`, `startDate`, `activityLog` if not needed for v2

- [x] 0.1.2: Create List model
  - Fields: `_id`, `userId`, `name`, `emoji`, `color`, `sortOrder`, `createdAt`
  - Include system "Inbox" list logic (cannot be deleted)

- [x] 0.1.3: Create Tag model
  - Fields: `_id`, `userId`, `name`, `color`, `createdAt`

- [x] 0.1.4: Create Habit model
  - Fields: `_id`, `userId`, `name`, `emoji`, `frequency`, `scheduledDays[]`, `goal`, `startDate`, `goalDays`, `section`, `reminders[]`, `autoPopLog`, `createdAt`

- [x] 0.1.5: Create HabitLog model
  - Fields: `_id`, `userId`, `habitId`, `date` (YYYY-MM-DD), `completed`, `logNote`, `createdAt`

- [x] 0.1.6: Create Timer model
  - Fields: `_id`, `userId`, `name`, `emoji`, `mode` (pomo/stopwatch), `pomoDuration`, `createdAt`

- [x] 0.1.7: Create FocusRecord model
  - Fields: `_id`, `userId`, `timerId`, `linkedTaskId`, `mode`, `duration`, `completedAt`

- [x] 0.1.8: Create UserSettings model (singleton per user)
  - Fields: `_id`, `userId`, `defaultPomoMins`, `breakMins`, `autoStartBreak`, `theme`, `notificationsEnabled`, `updatedAt`

### Phase 0.2: Implement Design Token System
- [x] 0.2.1: Create CSS custom properties for PRD v2 color tokens
  - File: `client/src/styles/abstracts/_variables.scss`
  - Add all tokens from PRD Section 5.1 (--color-primary, --color-bg-app, --color-priority-p1, etc.)

- [x] 0.2.2: Create typography scale CSS custom properties
  - Add --text-display, --text-heading-1, --text-body-lg, etc.
  - Set font family to Inter (import from Google Fonts or bundle)

- [x] 0.2.3: Create spacing scale CSS custom properties
  - Add --space-1 (4px) through --space-12 (48px)

- [x] 0.2.4: Create border radius rules
  - Add --radius-task-card (8px), --radius-modal (14px), etc.

- [x] 0.2.5: Create shadow scale
  - Add --shadow-resting, --shadow-hover, --shadow-modal, --shadow-dropdown, --shadow-FAB

- [x] 0.2.6: Update global reset/styles to use new tokens
  - File: `client/src/styles/base/_reset.scss`, `_global.scss`

### Phase 0.3: Server Infrastructure Improvements
- [x] 0.3.1: Add input validation middleware using `express-validator`
  - Validate task creation/update payloads
  - Validate ObjectId parameters

- [x] 0.3.2: Add 404 handler for unmatched routes

- [x] 0.3.3: Add graceful shutdown handlers (SIGINT, SIGTERM)

- [x] 0.3.4: Move CORS origin to environment variable

- [x] 0.3.5: Create `.env.example` file in server/

- [x] 0.3.6: Add pagination support to `getTasks` endpoint

- [x] 0.3.7: Create dedicated search endpoint using MongoDB `$text` search

### Phase 0.4: Frontend Routing & Navigation Setup
- [x] 0.4.1: Update routes.jsx to include new page placeholders
  - Add: `/today`, `/inbox`, `/next-7-days`, `/habits`, `/focus`, `/lists/:id`, `/tags/:id`, `/completed`, `/trash`

- [x] 0.4.2: Update Sidebar.jsx to use PRD v2 navigation structure
  - Add: Today, Inbox, Next 7 Days, Lists section, Tags section, Habits, Focus/Pomodoro
  - Remove: Projects, Events, Queue (old v1 features)
  - Add count badges for tasks per list

- [x] 0.4.3: Create empty placeholder pages for all new routes
  - Files: `client/src/pages/Today/Today.jsx`, `Inbox.jsx`, `Next7Days.jsx`, `Habits.jsx`, `Focus.jsx`, etc.

**Phase 0.4 DELIVERABLE**: Complete routing and navigation structure for v2 features. All new pages have placeholder components. Sidebar uses PRD v2 navigation hierarchy. Old v1 routes still exist but are not default.

**Phase 0 DELIVERABLE**: Clean codebase with correct data models, design tokens, and routing structure. Old v1 features removed. Ready to build v2 features.

**Phase 0 Deliverable**: Clean codebase with correct data models, design tokens, and routing structure. Old v1 features removed. Ready to build v2 features.

---

## 🚀 Phase 1: Core Task Management (Inbox Foundation)

**Goal**: Fully functional Inbox with task CRUD, priority flags, due dates, and proper design system

### Phase 1.1: Task Card & List View Refactor
- [x] 1.1.1: Redesign TaskCard component to match PRD v2 spec
  - Priority checkbox circle (20×20px, colored ring based on P1-P4)
  - Task title (flex-grow)
  - Meta row below title (12px, secondary color) showing "Today" tag + list name tag
  - Hover shadow elevation
  - Completed state: strikethrough + fade to gray
  - File: `client/src/components/task/TaskCard/TaskCard.jsx`

- [x] 1.1.2: Update TaskPriorityBadge to use 4 priority levels
  - P1: Red (#FF3B30), P2: Orange (#FF9F0A), P3: Blue (#3B5BDB), P4: Gray (#C7C7CC)
  - Circle style with colored border

- [x] 1.1.3: Create TaskList component (vertical list of TaskCards)
  - File: `client/src/components/task/TaskList/TaskList.jsx`
  - Supports show/hide completed section
  - Collapsible "Completed (N)" section

### Phase 1.2: Inbox Page Implementation
- [x] 1.2.1: Build Inbox page layout
  - File: `client/src/pages/Inbox/Inbox.jsx`
  - Header: "Inbox" with sort icon + options menu
  - Inline "+ Add task" input at top
  - Task list below

- [x] 1.2.2: Create inline task input with expandable toolbar
  - Default: text input with "+" icon
  - Expanded: reveals toolbar with calendar icon, priority flags, list picker, tags picker
  - File: `client/src/components/task/TaskInput/TaskInput.jsx`

- [x] 1.2.3: Implement priority flag picker in toolbar
  - 4 color-coded flags (P1-P4)
  - Dropdown or inline buttons

- [x] 1.2.4: Implement date picker dropdown
  - Calendar widget showing current month
  - Today highlighted with filled blue circle
  - Month navigation arrows
  - OK/Cancel buttons

### Phase 1.3: Task CRUD API Integration
- [x] 1.3.1: Update backend task routes to match new schema
  - `tasks:create` mutation: accepts title, priority (1-4), dueDate, dueTime, listId, tags[]
  - `tasks:update` mutation: allow partial updates
  - `tasks:toggleComplete` mutation: flip isCompleted boolean
  - `tasks:softDelete` mutation: set deletedAt timestamp
  - `tasks:restore` mutation: clear deletedAt
  - `tasks:getByList` query: filter by listId (for Inbox, listId=null)

- [x] 1.3.2: Update frontend taskService.js
  - Add methods: `getByList(listId)`, `toggleComplete(id)`, `softDelete(id)`, `restore(id)`
  - Update existing methods to match new schema

- [x] 1.3.3: Update taskStore.js (Zustand) with optimistic updates
  - Add `addTask` (optimistic append)
  - Add `toggleTaskComplete` (optimistic flip)
  - Add `deleteTask` (optimistic remove with rollback)
  - Keep existing `updateTask`, `updateTaskStatus`

### Phase 1.4: Lists Management (Basic)
- [x] 1.4.1: Create List API endpoints (backend)
  - `GET /api/lists` - get all lists for user
  - `POST /api/lists` - create new list
  - `PATCH /api/lists/:id` - update list
  - `DELETE /api/lists/:id` - delete list (except Inbox)
  - Seed default lists on first user login: Inbox (system), Work, Personal, Learning, Fitness

- [x] 1.4.2: Create List model controllers (backend)
  - File: `server/src/controllers/listController.js`
  - File: `server/src/routes/listRoutes.js`

- [x] 1.4.3: Create List picker component (frontend)
  - Dropdown showing lists with emoji icons
  - Active list shown with blue checkmark
  - File: `client/src/components/task/ListPicker/ListPicker.jsx`

- [x] 1.4.4: Integrate lists into Sidebar
  - "Lists" section with each list showing emoji + name
  - Click navigates to filtered task view
  - "+" icon to create new list
  - Right-click or "..." menu: Rename, Change Icon, Delete

### Phase 1.5: Tags System (Basic)
- [x] 1.5.1: Create Tag API endpoints (backend)
  - `GET /api/tags` - get all tags with task count
  - `POST /api/tags` - create new tag
  - `DELETE /api/tags/:id` - delete tag (removes from all tasks)

- [x] 1.5.2: Create Tag model controllers (backend)
  - File: `server/src/controllers/tagController.js`
  - File: `server/src/routes/tagRoutes.js`

- [x] 1.5.3: Create Tag picker component (frontend)
  - Searchable input to filter tags
  - "No Tags" empty state with tag icon
  - Type to create new tags
  - Multiple selection allowed
  - File: `client/src/components/task/TagPicker/TagPicker.jsx`

- [x] 1.5.4: Add tags to Sidebar
  - "Tags" section showing all tags with task count
  - Click filters task view to matching tasks

### Phase 1.6: View Options Menu
- [x] 1.6.1: Create ViewOptions dropdown component
  - Group by: Date / Priority / List
  - Sort by: Date / Priority / Name
  - Hide Completed: On/Off toggle
  - Show Details: On/Off toggle
  - View Mode: List / Kanban toggle
  - File: `client/src/components/task/ViewOptions/ViewOptions.jsx`

- [x] 1.6.2: Implement grouping logic in TaskList
  - Group tasks by selected field (date/priority/list)
  - Collapsible group headers with count badges

- [x] 1.6.3: Implement sorting logic
  - Sort tasks within groups by selected field

- [x] 1.6.4: Add view mode toggle (List ↔ Kanban)
  - Reuse existing KanbanBoard component for Kanban mode
  - Use TaskList component for List mode

**Phase 1 Deliverable**: Fully functional Inbox with task CRUD, 4-level priority flags, due date picker, lists management, tags system, and view options. Design system matches PRD v2 tokens. User can create, edit, complete, and organize tasks.

---

## 📅 Phase 2: Today View & Advanced Task Views

**Goal**: Implement Today view (3-column layout), Next 7 Days, Completed, and Trash views

### Phase 2.1: Today View (3-Column Layout)
- [x] 2.1.1: Create Today view page layout
  - File: `client/src/pages/Today/Today.jsx`
  - Three-column layout: Overdue | Today | Today's Habit
  - Page title "Today" with hamburger icon on left
  - View options menu (...) on top right
  - Mobile: columns stack vertically (Today first, Overdue second, Habits third)

- [x] 2.1.2: Create TodayColumn component
  - Header: column label (12px uppercase) + count badge + "+" icon
  - Scrollable task list
  - File: `client/src/components/task/TodayColumn/TodayColumn.jsx`

- [x] 2.1.3: Create backend query for Today view tasks
  - `GET /api/tasks/today` - returns overdue + today tasks
  - Query logic: `dueDate < today` (overdue) OR `dueDate === today`
  - Exclude soft-deleted tasks

- [x] 2.1.4: Create Overdue column logic
  - Filter tasks where `dueDate < today` AND `isCompleted === false`
  - Show "Postpone" link (bulk update dueDate to tomorrow)
  - Collapsible "Completed (N)" section at bottom

- [x] 2.1.5: Create Today column logic
  - Filter tasks where `dueDate === today` AND `isCompleted === false`
  - Each card shows priority checkbox + title + "Today" tag (blue) + list tag (gray)

- [x] 2.1.6: Implement inline task creation in Today column
  - "+" icon opens TaskInput pre-filled with today's date

### Phase 2.2: Next 7 Days View
- [x] 2.2.1: Create Next 7 Days page
  - File: `client/src/pages/Next7Days/Next7Days.jsx`
  - Same layout as Inbox but filtered to tasks due within rolling 7-day window
  - Default grouping: by date

- [x] 2.2.2: Create backend query for Next 7 Days
  - `GET /api/tasks/next-7-days` - returns tasks where `today <= dueDate <= today + 7 days`
  - Group by date on frontend or backend

- [x] 2.2.3: Create date group header component
  - Collapsible header with date label + task count
  - File: `client/src/components/task/DateGroupHeader/DateGroupHeader.jsx`

### Phase 2.3: Completed & Trash Views
- [x] 2.3.1: Create Completed page
  - File: `client/src/pages/Completed/Completed.jsx`
  - Shows all completed tasks across all lists
  - Sorted by `completedAt` descending
  - Option to un-complete (flip isCompleted back to false)

- [x] 2.3.2: Create backend query for completed tasks
  - `GET /api/tasks/completed` - returns tasks where `isCompleted === true`
  - Sorted by `completedAt` desc

- [x] 2.3.3: Create Trash page
  - File: `client/src/pages/Trash/Trash.jsx`
  - Shows soft-deleted tasks (where `deletedAt` is set)
  - 30-day retention logic (backend filters tasks deleted > 30 days ago)
  - Individual restore button per task
  - "Empty Trash" button (permanent delete all)

- [x] 2.3.4: Create backend endpoints for trash
  - `GET /api/tasks/trash` - returns soft-deleted tasks within 30 days
  - `PATCH /api/tasks/:id/restore` - clears deletedAt
  - `DELETE /api/tasks/:id/permanent` - hard delete from DB
  - `DELETE /api/tasks/trash/empty` - hard delete all trashed tasks

- [x] 2.3.5: Update taskStore.js with trash operations
  - Add `fetchTrashedTasks`, `restoreTask`, `emptyTrash` actions
  - Add `permanentDeleteTask`, `fetchTodayTasks`, `fetchNext7DaysTasks`, `postponeTask` actions

### Phase 2.4: Task Detail / Metadata Expansion
- [x] 2.4.1: Create task detail expansion in TaskCard
  - Click to expand shows: subtasks, tags, attachments, notes
  - File: Update `client/src/components/task/TaskCard/TaskCard.jsx`

- [x] 2.4.2: Create subtask management UI
  - Add/edit/delete subtasks within task detail
  - Checkbox per subtask
  - Progress indicator (X/Y completed)
  - File: `client/src/components/task/SubtaskList/SubtaskList.jsx`

- [x] 2.4.3: Create attachment upload UI
  - File picker opens system dialog
  - Attached files shown as chips below task title
  - Backend: store in Convex file storage (or local filesystem for now)
  - Supported types: PDF, images, documents
  - File: `client/src/components/task/AttachmentUpload/AttachmentUpload.jsx`

- [x] 2.4.4: Create templates system (basic)
  - "Add from Template" in TaskInput toolbar
  - Template picker showing saved task templates
  - Templates pre-fill: title, priority, list, tags
  - Backend: Create Template model + CRUD endpoints
  - Files: 
    - `server/src/models/Template.js`
    - `server/src/controllers/templateController.js`
    - `server/src/routes/templateRoutes.js`
    - `client/src/services/templateService.js`
    - `client/src/store/templateStore.js`
    - `client/src/components/task/TemplatePicker/TemplatePicker.jsx`

**Phase 2 Deliverable**: Today view with 3-column layout, Next 7 Days view, Completed & Trash views. Full task metadata management (subtasks, attachments, templates). User can manage tasks across multiple views with proper filtering and grouping.

---

## 🎯 Phase 3: Habit Tracker Module

**Goal**: Complete habit tracking with 7-day rolling view, detail panel, calendar heatmap, and analytics

### Phase 3.1: Habits List View
- [x] 3.1.1: Create Habits list page layout
  - File: `client/src/pages/Habits/Habits.jsx`
  - Header: "Habit" with dropdown arrow + "+" icon
  - Rolling 7-day header row: day abbreviations (Tue Wed Thu...) + date numbers
  - Today's column header highlighted in blue

- [x] 3.1.2: Create HabitRowCard component
  - Background: #FFFFFF, border-radius: 10px, resting shadow
  - Left: emoji icon (32×32px circle)
  - Middle: habit name (14px bold) + meta chips (streak count, day count)
  - Right: 7 check-in circles (one per day)
    - Filled blue (#3B5BDB) = complete
    - Light gray empty ring = incomplete
    - Striped = future/not scheduled
  - File: `client/src/components/habit/HabitRowCard/HabitRowCard.jsx`

- [x] 3.1.3: Create backend Habit API endpoints
  - `GET /api/habits` - get all active habits for user
  - `POST /api/habits` - create new habit
  - `PATCH /api/habits/:id` - update habit settings
  - `DELETE /api/habits/:id` - soft-delete habit + associated logs
  - Include habit logs in GET response for 7-day rendering

- [x] 3.1.4: Create backend HabitLog API endpoints
  - `POST /api/habits/:id/check-in` - upsert habitLog; toggle completed boolean
  - `PATCH /api/habits/logs/:id/note` - save journal note text
  - Upsert logic: if log exists for habitId + date, toggle; else create

- [x] 3.1.5: Create habitStore.js (Zustand)
  - Actions: `fetchHabits`, `createHabit`, `updateHabit`, `deleteHabit`, `toggleCheckIn(habitId, date)`, `setLogNote(logId, note)`
  - Optimistic updates for check-in toggle

- [x] 3.1.6: Implement 7-day rolling header calculation
  - Frontend: calculate last 7 days from today
  - Map each day to habitLog.completed status
  - Render check-in circles accordingly

### Phase 3.2: Create Habit Modal
- [x] 3.2.1: Create CreateHabitModal component
  - File: `client/src/components/habit/CreateHabitModal/CreateHabitModal.jsx`
  - Fields:
    - Emoji icon picker (defaults to smiley, click to change)
    - Habit name text input
    - Frequency dropdown: Daily → sub-picker with day-of-week circles (S M T W T F S)
    - Goal dropdown: "Achieve it all" + other modes
    - Start Date: date picker (defaults to today)
    - Goal Days: Forever / 7 / 21 / 30 / 100 / 365 / Custom
    - Section: Others / Morning / Afternoon / Night / + Add Section
    - Reminder: + button opens time picker (30-min intervals), multiple allowed
    - "Auto pop-up of habit log" checkbox
  - Save/Cancel buttons

- [x] 3.2.2: Create day-of-week picker component
  - 7 circles (S M T W T F S), all selected by default
  - Click to toggle selection
  - File: `client/src/components/habit/DayPicker/DayPicker.jsx`

- [x] 3.2.3: Create reminder time picker component
  - Time picker with 30-min interval options
  - Multiple reminders allowed (show as chips)
  - File: `client/src/components/habit/ReminderPicker/ReminderPicker.jsx`

### Phase 3.3: Habit Detail Panel
- [x] 3.3.1: Create HabitDetailPanel component
  - Opens on right side (or full-screen) when clicking habit row
  - File: `client/src/components/habit/HabitDetailPanel/HabitDetailPanel.jsx`
  - Header: habit name + emoji + options (...) icon

- [x] 3.3.2: Create stat cards (4 cards)
  - Monthly check-ins (count + "Days")
  - Total check-ins
  - Monthly check-in rate (%)
  - Streak count (lightning bolt icon)
  - File: `client/src/components/habit/StatCard/StatCard.jsx`

- [x] 3.3.3: Create monthly calendar heatmap
  - Current month grid (7 columns × N rows)
  - Completed days filled with blue circles (#3B5BDB)
  - Today highlighted with blue border ring
  - File: `client/src/components/habit/CalendarHeatmap/CalendarHeatmap.jsx`

- [x] 3.3.4: Create habit log section
  - "Habit Log on [Month]" header
  - Text entries for journal notes per check-in
  - Inline edit to add/update notes
  - File: `client/src/components/habit/HabitLogSection/HabitLogSection.jsx`

- [x] 3.3.5: Create backend stats calculation endpoint
  - `GET /api/habits/:id/stats` - returns streak, monthly count, check-in rate
  - Calculate streak: consecutive days from today backwards
  - Calculate rate: (completed days / scheduled days) × 100
  - Calculate monthly count: sum of completed days in current month

### Phase 3.4: Habit Integration with Today View
- [x] 3.4.1: Create "Today's Habit" column population logic
  - Filter habits scheduled for today (based on frequency + scheduledDays)
  - Show habit cards in third column of Today view
  - Reuse HabitRowCard component (simplified version)

- [x] 3.4.2: Create phantom task contract for habits
  - Decision: Today view directly queries habits collection (not phantom tasks)
  - Frontend merges tasks + habits into Today view
  - Completion state tracked separately (habitLog.completed vs task.isCompleted)

- [x] 3.4.3: Implement habit check-in from Today view
  - Click check-in circle on habit card in Today view
  - Optimistic update fills circle blue
  - Backend: upsert habitLog for today

**Phase 3 Deliverable**: Complete habit tracker with 7-day rolling view, create habit modal (all fields), detail panel (stats, calendar heatmap, log), daily check-in toggle, habit sections (Morning/Afternoon/Night), and integration with Today view. User can build and track daily routines with streak analytics. ✅ COMPLETED

---

## ⏱️ Phase 4: Focus / Pomodoro Module

**Goal**: Complete focus session manager with named timers, SVG ring animation, task linking, and statistics

### Phase 4.1: Pomodoro Timer Core
- [ ] 4.1.1: Create Focus page layout
  - File: `client/src/pages/Focus/Focus.jsx`
  - Header: "Pomodoro" with Pomo/Stopwatch tab switcher
  - "+" icon to add named timer
  - "..." for focus mode options (Full-Screen, Mini Mode, Statistics, Focus Settings)
  - Left: timer area (large SVG ring + controls)
  - Right: overview panel (stats + focus records)
  - Mobile: overview panel collapses to accordion below timer

- [ ] 4.1.2: Create TimerRing component (SVG circular progress)
  - 280×280px SVG circle
  - Background ring: stroke #E5E5EA, stroke-width 8
  - Progress ring: stroke #3B5BDB, stroke-width 8, stroke-linecap round
  - Animated stroke-dashoffset based on time remaining
  - Center: time display in 48px Inter weight 300 (tabular-nums)
  - Below ring: linked task name (13px, secondary color)
  - File: `client/src/components/focus/TimerRing/TimerRing.jsx`

- [ ] 4.1.3: Implement timer countdown logic
  - Zustand focus store: `{ state: "idle/running/paused/stopped", timerId, taskId, startedAt, remainingMs }`
  - Use `setInterval` with `Date.now()` delta for drift compensation
  - Update every 100ms for smooth ring animation
  - File: `client/src/store/focusStore.js`

- [ ] 4.1.4: Create timer controls
  - Start/Pause/Stop pill buttons (blue, 160px wide, rounded)
  - Start: begins countdown, sets state to "running"
  - Pause: pauses countdown, sets state to "paused"
  - Stop: resets to initial time, sets state to "stopped"

- [ ] 4.1.5: Implement timer accuracy strategy
  - Store `startedAt` (Date.now()) and `totalDurationMs`
  - On each tick: `remainingMs = totalDurationMs - (Date.now() - startedAt)`
  - Compensates for setInterval drift and app minimize/screen lock
  - On app visibility change (Page Visibility API), recalculate remaining time

### Phase 4.2: Named Timers
- [ ] 4.2.1: Create AddTimerModal component
  - Fields:
    - Emoji icon picker
    - Timer name input
    - Timer Mode: Pomo (with minute field) or Stopwatch
    - Save/Cancel buttons
  - File: `client/src/components/focus/AddTimerModal/AddTimerModal.jsx`

- [ ] 4.2.2: Create TimerTabSwitcher component
  - Shows named timers as tabs below header
  - Click to switch active timer
  - "+" icon opens AddTimerModal
  - File: `client/src/components/focus/TimerTabSwitcher/TimerTabSwitcher.jsx`

- [ ] 4.2.3: Create backend Timer API endpoints
  - `GET /api/timers` - get all named timers for user
  - `POST /api/timers` - create named timer
  - `PATCH /api/timers/:id` - update timer name, emoji, duration
  - `DELETE /api/timers/:id` - delete timer (preserve orphaned focusRecords)

- [ ] 4.2.4: Create Timer controllers and routes (backend)
  - File: `server/src/controllers/timerController.js`
  - File: `server/src/routes/timerRoutes.js`

### Phase 4.3: Stopwatch Mode
- [ ] 4.3.1: Implement stopwatch countdown (counts up from 00:00:00)
  - Reuse TimerRing component with reverse progress
  - No end time (runs until stopped)
  - Display format: HH:MM:SS

- [ ] 4.3.2: Add lap timer functionality (optional enhancement)
  - "Lap" button records current time
  - Laps shown in list below timer

### Phase 4.4: Task Linking
- [ ] 4.4.1: Create TaskLinkPicker component
  - "Focus >" link opens task picker dropdown
  - Searchable task list
  - Select task to link to current focus session
  - File: `client/src/components/focus/TaskLinkPicker/TaskLinkPicker.jsx`

- [ ] 4.4.2: Display linked task below timer ring
  - Show task name (13px, secondary color)
  - "Today Inbox" tags if applicable
  - Click to open TaskLinkPicker to change

- [ ] 4.4.3: Handle linked task edge cases
  - If linked task deleted mid-session: show "Task deleted" message, clear link
  - If linked task completed during session: allow session to continue, mark focusRecord with taskId still
  - Backend: `linkedTaskId` is nullable in FocusRecord model

### Phase 4.5: Focus Overview Panel
- [ ] 4.5.1: Create FocusOverviewPanel component
  - Right panel showing:
    - Today's Pomos (count integer)
    - Today's Focus Duration (minutes)
    - Total Pomos (all-time count)
    - Total Focus Duration (all-time minutes)
  - File: `client/src/components/focus/FocusOverviewPanel/FocusOverviewPanel.jsx`

- [ ] 4.5.2: Create FocusRecordList component
  - "Focus Record" header with "+" icon (manual add)
  - List of completed sessions: timer name, duration, linked task, completedAt
  - "No focus record yet" empty state with illustration
  - File: `client/src/components/focus/FocusRecordList/FocusRecordList.jsx`

- [ ] 4.5.3: Create backend FocusRecord API endpoints
  - `GET /api/focus-records/overview` - returns today count, today duration, total count, total duration
  - `GET /api/focus-records` - returns paginated records sorted by completedAt desc
  - `POST /api/focus-records` - create completed focus session (auto or manual)
  - `DELETE /api/focus-records/:id` - remove manually added record

- [ ] 4.5.4: Create FocusRecord controllers and routes (backend)
  - File: `server/src/controllers/focusRecordController.js`
  - File: `server/src/routes/focusRecordRoutes.js`

- [ ] 4.5.5: Save focusRecord on timer completion
  - When countdown reaches 00:00:
    - Fire OS notification
    - Call backend: `POST /api/focus-records` with { timerId, linkedTaskId, duration, completedAt }
    - Update overview panel stats

### Phase 4.6: OS Notifications & Focus Settings
- [ ] 4.6.1: Implement OS notification on timer completion
  - Browser: use `Notification` API
  - Electron (future): use `node-notifier` for system-level notifications
  - Message: "Pomo complete! Take a 5-minute break."

- [ ] 4.6.2: Create FocusSettings panel
  - Options:
    - Default Pomo duration (minutes)
    - Break duration (minutes)
    - Auto-start break (toggle)
    - Full-Screen mode (toggle)
    - Mini Mode (toggle)
  - File: `client/src/components/focus/FocusSettings/FocusSettings.jsx`

- [ ] 4.6.3: Create backend UserSettings API endpoints
  - `GET /api/settings` - get user settings
  - `PATCH /api/settings` - update settings (Pomo duration, break duration, theme, notifications)

- [ ] 4.6.4: Implement break timer (optional enhancement)
  - After Pomo completes, auto-start break timer (if enabled)
  - Break timer counts down, notifies on completion

**Phase 4 Deliverable**: Complete Pomodoro module with Pomo + Stopwatch modes, named timers (Add Timer modal), SVG circular ring animation, task linking, OS notifications, focus overview panel (stats), Focus Records list, Full-Screen and Mini Mode, Focus Settings. User can run focus sessions and track productivity.

---

## 🔍 Phase 5: AI & Global Search

**Goal**: Implement global Cmd+K search, AI natural language task parser, and template system

### Phase 5.1: Global Search Modal
- [ ] 5.1.1: Create SearchModal component
  - Full-screen overlay with top search bar
  - Magnifying glass icon + "Search" placeholder + X close icon
  - Blue underline on focus
  - Keyboard shortcut: Cmd+K / Ctrl+K to open
  - File: `client/src/components/search/SearchModal/SearchModal.jsx`

- [ ] 5.1.2: Create search empty state
  - Binoculars illustration
  - "Search tasks, tags, lists and filters" label
  - File: `client/src/components/search/SearchEmpty/SearchEmpty.jsx`

- [ ] 5.1.3: Create search results component
  - Results grouped by type: Tasks, Tags, Lists, Filters
  - Each result shows title + metadata (list, due date)
  - Click result navigates to corresponding page/task
  - File: `client/src/components/search/SearchResults/SearchResults.jsx`

- [ ] 5.1.4: Create backend search endpoint
  - `POST /api/search` - accepts query string, returns results grouped by type
  - Use MongoDB `$text` search index on tasks.title, tasks.tags
  - Search tags.name, lists.name with `$regex` (case-insensitive)
  - Limit results to top 10 per type

- [ ] 5.1.5: Implement search keyboard navigation
  - Arrow up/down to navigate results
  - Enter to select
  - Escape to close

- [ ] 5.1.6: Add search to Sidebar
  - Search icon at top of sidebar
  - Click opens SearchModal

### Phase 5.2: AI Natural Language Task Parser
- [ ] 5.2.1: Create AI parse utility
  - File: `client/src/utils/aiParser.js`
  - Function: `parseTaskInput(rawText)` → sends to backend AI endpoint
  - Debounce: 800ms after user stops typing

- [ ] 5.2.2: Create backend AI parsing endpoint
  - `POST /api/ai/parse-task` - accepts raw text, returns structured JSON
  - Request body: `{ rawInput: "Study DCN chapter 4 tomorrow" }`
  - Response: `{ title: "Study DCN chapter 4", dueDate: "2026-04-12", priority: 3, list: null }`
  - Integrate Anthropic API (claude-sonnet-4-20250514)
  - System prompt defines JSON output schema
  - Max 500 output tokens

- [ ] 5.2.3: Create AI parse controller (backend)
  - File: `server/src/controllers/aiController.js`
  - File: `server/src/routes/aiRoutes.js`
  - Store Anthropic API key in server env only (never exposed to frontend)

- [ ] 5.2.4: Handle AI parser failures gracefully
  - If Anthropic API unreachable: fail silently, show unmodified input
  - No error toast shown to user
  - Log error on backend for debugging

- [ ] 5.2.5: AI parse integration in TaskInput
  - After 800ms debounce, detect intent pattern (date phrase + verb)
  - Call AI parser, pre-fill expanded input form with parsed values
  - User can edit before saving
  - Visual indicator: "AI-suggested fields" badge

- [ ] 5.2.6: Add opt-in mechanism for AI features
  - Settings toggle: "Enable AI task suggestions"
  - First AI call requires explicit user opt-in
  - Disclosure: "Task text is sent to AI service for parsing"

### Phase 5.3: Template System
- [ ] 5.3.1: Create Template model (backend)
  - Fields: `_id`, `userId`, `name`, `title`, `priority`, `listId`, `tags[]`, `createdAt`

- [ ] 5.3.2: Create Template API endpoints
  - `GET /api/templates` - get all templates
  - `POST /api/templates` - create template from current task
  - `DELETE /api/templates/:id` - delete template

- [ ] 5.3.3: Create TemplatePicker component
  - Opens when "Add from Template" clicked in TaskInput toolbar
  - Shows saved templates as cards
  - Click applies template fields to new task
  - File: `client/src/components/task/TemplatePicker/TemplatePicker.jsx`

### Phase 5.4: Habit Insights (Optional Enhancement)
- [ ] 5.4.1: Create weekly AI digest
  - Backend cron job or manual trigger: generates habit summary
  - AI prompt: "Analyze habit check-in patterns for past week, provide insights"
  - Summary shown in Habit detail panel

- [ ] 5.4.2: Create InsightCard component
  - Displays AI-generated habit insights
  - File: `client/src/components/habit/InsightCard/InsightCard.jsx`

**Phase 5 Deliverable**: Global search modal (Cmd+K) with full-text search across tasks, tags, lists. AI natural language task parser (Anthropic API) with opt-in mechanism. Template system for reusable task creation. User can search across all data and use AI to speed up task entry.

---

## ✨ Phase 6: Polish, Mobile & Shipping

**Goal**: Responsive layouts, keyboard navigation, accessibility, performance optimization, Electron packaging (optional)

### Phase 6.1: Responsive Mobile Layout
- [ ] 6.1.1: Update Today view for mobile
  - Columns stack vertically: Today first, Overdue second, Habits third
  - Reduce padding and font sizes
  - Horizontal scroll for 7-day habit header

- [ ] 6.1.2: Update Sidebar for mobile
  - Collapsible sidebar (hamburger menu)
  - Use existing MobileNav component
  - Bottom tab bar for key sections: Today, Inbox, Habits, Focus, More

- [ ] 6.1.3: Update Focus page for mobile
  - Overview panel collapses to accordion below timer
  - Reduce timer ring size to 200×200px
  - Stack stat cards in 2×2 grid

- [ ] 6.1.4: Update all modals for mobile
  - Full-screen on mobile instead of centered card
  - Larger touch targets (min 44×44px)
  - Bottom sheet style for pickers

- [ ] 6.1.5: Add responsive breakpoints to SCSS
  - Use existing `_breakpoints.scss` file
  - Mobile: < 768px, Tablet: 768-1024px, Desktop: > 1024px

### Phase 6.2: Keyboard Navigation
- [ ] 6.2.1: Implement full keyboard navigation
  - Tab order matches visual order
  - All interactive elements focusable (buttons, inputs, cards)
  - Visible focus ring (2px solid #3B5BDB + 2px offset)

- [ ] 6.2.2: Add keyboard shortcuts
  - Cmd+K / Ctrl+K: Open search
  - N: New task (when in Inbox/Today view)
  - Esc: Close modals/search
  - J/K: Navigate up/down in task list
  - Space: Toggle task complete
  - Delete: Move task to trash

- [ ] 6.2.3: Add keyboard shortcut help modal
  - "?" opens keyboard shortcuts reference
  - File: `client/src/components/ui/KeyboardShortcuts/KeyboardShortcuts.jsx`

### Phase 6.3: Accessibility Audit (WCAG 2.1 AA)
- [ ] 6.3.1: Add aria-labels to all icon buttons
  - Checkbox circles, priority flags, list icons, etc.
  - Example: `aria-label="Mark task as complete"`

- [ ] 6.3.2: Verify color contrast ratios
  - All text meets WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text
  - Use contrast checker tool on all color combinations

- [ ] 6.3.3: Add screen reader announcements
  - Toast notifications announced via `aria-live` region
  - Timer completion announced with sound + text

- [ ] 6.3.4: Test with screen reader (NVDA on Windows, VoiceOver on Mac)
  - Verify all navigation and interactions work

### Phase 6.4: Performance Optimization
- [ ] 6.4.1: Optimize Today view rendering
  - Target: < 200ms initial render with up to 500 tasks
  - Use React.memo on TaskCard, TodayColumn components
  - Virtual scrolling for > 200 visible rows (use `react-window`)

- [ ] 6.4.2: Optimize habit calendar heatmap rendering
  - Target: < 150ms for 365-day heatmap
  - Use canvas or SVG for heatmap instead of div grid
  - Memoize month calculation

- [ ] 6.4.3: Optimize search query performance
  - Target: < 300ms for full-text results
  - Use MongoDB text index on tasks.title, tasks.tags
  - Limit results to top 10 per type

- [ ] 6.4.4: Optimize timer tick accuracy
  - Target: setInterval drift < 50ms per minute
  - Use `Date.now()` delta compensation (already implemented in Phase 4)
  - Recalculate on app visibility change

- [ ] 6.4.5: Add pagination to large lists
  - Tasks: paginate at 50 items per page
  - Focus Records: paginate at 20 items per page
  - Infinite scroll or "Load More" button

### Phase 6.5: Error Handling & Offline Support
- [ ] 6.5.1: Create ErrorBoundary component
  - Catches React rendering errors
  - Shows fallback UI with "Try Again" button
  - Logs error to backend (optional)
  - File: `client/src/components/ui/ErrorBoundary/ErrorBoundary.jsx`

- [ ] 6.5.2: Create offline detection banner
  - Detect network status via `navigator.onLine`
  - Show banner: "You're offline. Changes will sync when you reconnect."
  - File: `client/src/components/ui/OfflineBanner/OfflineBanner.jsx`

- [ ] 6.5.3: Handle API errors gracefully
  - Network errors: show toast with retry option
  - Server errors (5xx): show error page
  - Auth errors (401): redirect to login

- [ ] 6.5.4: Implement optimistic update rollback
  - Already implemented in taskStore.js for some actions
  - Extend to all CRUD operations (habits, timers, focus records)

### Phase 6.6: Onboarding Flow (Optional)
- [ ] 6.6.1: Create onboarding wizard for new users
  - Step 1: Welcome + app overview
  - Step 2: Create first task
  - Step 3: Create first habit
  - Step 4: Start first Pomodoro
  - Skip button on each step
  - File: `client/src/components/onboarding/OnboardingWizard/OnboardingWizard.jsx`

- [ ] 6.6.2: Track onboarding completion in UserSettings
  - Add `onboardingCompleted` boolean to UserSettings model
  - Skip onboarding if already completed

### Phase 6.7: Final Polish
- [ ] 6.7.1: Add smooth animations and transitions
  - Task card hover lift
  - Modal open/close fade
  - Sidebar item active state transition
  - Timer ring progress animation

- [ ] 6.7.2: Add loading skeletons
  - Task list skeleton (gray bars) while fetching
  - Habit row skeleton
  - Stat card skeleton
  - File: `client/src/components/ui/Skeleton/Skeleton.jsx`

- [ ] 6.7.3: Add empty states to all views
  - Inbox: "No tasks yet. Add your first task!"
  - Today: "Nothing due today. Enjoy your free time!"
  - Habits: "No habits yet. Create your first daily routine!"
  - Focus: "No timers yet. Create your first Pomodoro!"

- [ ] 6.7.4: Test cross-browser compatibility
  - Chrome, Firefox, Safari, Edge
  - Verify design tokens render consistently

- [ ] 6.7.5: Create production build and test
  - `npm run build` on client
  - Verify no console errors
  - Test all features end-to-end

### Phase 6.8: Electron Packaging (Optional Future)
- [ ] 6.8.1: Set up Electron main process
  - Create `electron/main.js`
  - Load production build of React app
  - Set up system tray icon
  - Handle app lifecycle (open, minimize, close)

- [ ] 6.8.2: Package with electron-builder
  - Windows installer (.exe)
  - macOS DMG
  - Linux AppImage

- [ ] 6.8.3: Add OS-level notifications via Electron
  - Use `node-notifier` for cross-platform notifications
  - Habit reminders fire even when app is minimized

**Phase 6 Deliverable**: Fully responsive, accessible, performant app ready for production use. Keyboard navigation, error handling, offline support, onboarding flow, and polished UX. Optional Electron packaging for desktop distribution.

---

## 📋 Summary Checklist by Phase

| Phase | Focus Area | Key Deliverables | Estimated Effort |
|-------|-----------|------------------|------------------|
| **0** | Cleanup & Prep | Correct data models, design tokens, routing, server improvements | 1 week |
| **1** | Core Tasks | Inbox, task CRUD, priorities P1-P4, lists, tags, view options | 2 weeks |
| **2** | Advanced Views | Today (3-column), Next 7 Days, Completed, Trash, task metadata | 2 weeks |
| **3** | Habits | Habit tracker, 7-day view, detail panel, calendar heatmap, stats | 2 weeks |
| **4** | Focus | Pomodoro + Stopwatch, named timers, SVG ring, task linking, stats | 2 weeks |
| **5** | AI & Search | Global search (Cmd+K), AI task parser, templates | 1.5 weeks |
| **6** | Polish & Ship | Responsive, accessibility, performance, error handling, onboarding | 1.5 weeks |

**Total Estimated Timeline**: 12 weeks for solo developer at full-time pace  
**Add 40% buffer**: ~17 weeks total for debugging, edge cases, and refinement

---

## 🎯 AI Context Retention Rules

> **These rules ensure AI (like me) never forgets context across sessions:**

### Rule 1: Follow Phases Sequentially
- Always complete Phase N before starting Phase N+1
- Never skip phases or jump ahead
- Mark each subtask as `[ ]` (pending) → `[x]` (completed)

### Rule 2: One Subtask at a Time
- Work on ONE checkbox item at a time
- Complete it fully before moving to next
- Test each subtask before marking complete

### Rule 3: Update This File
- After completing each subtask, update this file
- Change `[ ]` to `[x]` for completed items
- Add notes if something was changed from plan

### Rule 4: Maintain Context
- Before starting work, read this file to understand current state
- Check which phase is in progress
- Review completed items to avoid rework

### Rule 5: Test Before Committing
- Run `npm run dev` to test app after each subtask
- Verify no console errors
- Test the specific feature you just built
- Commit after each subtask completion with clear commit message

### Rule 6: Document Deviations
- If plan needs to change, update this file first
- Add comment explaining why deviation was needed
- Keep plan accurate for future AI sessions

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (root)
npm install

# Install dependencies (client)
cd client && npm install

# Install dependencies (server)
cd server && npm install

# Run dev servers (both client + server)
npm run dev

# Run client only
npm run client

# Run server only
npm run server
```

---

## 📚 Reference Files

- **PRD**: `Nexus_v3_PRD.docx.md` (full product requirements)
- **Design Tokens**: `client/src/styles/abstracts/_variables.scss`
- **Routes**: `client/src/routes.jsx`
- **Task Store**: `client/src/store/taskStore.js`
- **API Service**: `client/src/src/services/api.js`
- **Server Entry**: `server/index.js`
- **Task Model**: `server/src/models/Task.js`
- **Auth Middleware**: `server/src/middleware/auth.js`

---

**Last Updated**: April 11, 2026  
**Next Phase to Start**: Phase 0.1.1 (Audit & Refactor Data Models)  
**Current Version**: Nexus v2.0 (In Development)
