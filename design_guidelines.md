# Design Guidelines: AEON Mall Visit Counter Application

## Design Approach
**Selected Approach:** Design System (Material Design 3)

**Rationale:** This is a utility-focused, data-dense tracking application requiring efficient information display and interaction patterns. Material Design provides excellent support for Japanese typography, clear data visualization, and structured layouts ideal for list-heavy interfaces.

**Core Principles:**
- Clarity and efficiency over decoration
- Japanese-first typography and readability
- Scannable information hierarchy
- Touch-friendly interaction targets
- Data-focused visual organization

---

## Typography System

### Font Selection
- **Primary Font:** Noto Sans JP (Google Fonts) - exceptional Japanese character support with clean, modern aesthetics
- **Accent Font:** Inter (Google Fonts) - for numbers, statistics, and English text
- **Implementation:** `<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`

### Type Scale
- **Page Headers (H1):** 2xl (text-2xl) / Bold (font-bold) - Noto Sans JP
- **Section Headers (H2):** xl (text-xl) / Semibold (font-semibold) - Noto Sans JP
- **Card Titles (H3):** lg (text-lg) / Medium (font-medium) - Noto Sans JP
- **Body Text:** base (text-base) / Regular (font-normal) - Noto Sans JP
- **Visit Counts/Stats:** 2xl-4xl (text-2xl to text-4xl) / Bold (font-bold) - Inter
- **Meta Information:** sm (text-sm) / Regular (font-normal) - Noto Sans JP
- **Labels/Captions:** xs (text-xs) / Medium (font-medium) - Noto Sans JP

---

## Layout System

### Spacing Primitives
**Consistent Tailwind Units:** 2, 4, 6, 8, 12, 16, 20
- **Micro spacing:** p-2, gap-2 (component internals)
- **Standard spacing:** p-4, gap-4, m-4 (card padding, element gaps)
- **Section spacing:** p-6, py-8 (between major sections)
- **Large spacing:** p-12, py-16, py-20 (page sections, hero areas)

### Grid Structure
- **Container:** max-w-7xl mx-auto px-4
- **Mall List Grid:** 
  - Mobile: grid-cols-1
  - Tablet: grid-cols-2 (md:grid-cols-2)
  - Desktop: grid-cols-3 (lg:grid-cols-3)
  - Gap: gap-4 (md:gap-6)
- **Stats Dashboard:** 
  - Mobile: grid-cols-2
  - Desktop: grid-cols-4 (lg:grid-cols-4)
  - Gap: gap-4

---

## Component Library

### Navigation
**Top App Bar:**
- Fixed position with elevation shadow
- Height: h-16
- Contains: Logo/Brand (left), Search (center expandable), User Avatar + Menu (right)
- Padding: px-4 lg:px-8
- Sticky behavior on scroll

**Tab Navigation (Region Filters):**
- Horizontal scrollable tab bar
- Tabs: 全国 (All), 北海道, 東北, 関東, 中部, 近畿, 中国, 四国, 九州
- Active state with bottom border indicator
- Gap: gap-6

### Cards
**Mall Card Component:**
- Structure: Elevated card with rounded corners (rounded-lg)
- Padding: p-4
- Shadow: shadow-md with hover:shadow-lg transition
- Layout:
  - **Header Row:** Mall name (text-lg font-medium) + Prefecture badge (text-xs px-2 py-1 rounded-full)
  - **Address Row:** Icon + Full address (text-sm)
  - **Opening Date:** Icon + Date (text-xs)
  - **Counter Section:** 
    - Visit count display (text-4xl font-bold Inter, centered)
    - Plus button (w-full py-3 rounded-lg font-medium)
    - Last visit timestamp (text-xs, centered)

**Stats Card:**
- Compact design: p-6
- Icon at top (w-12 h-12)
- Large number (text-3xl font-bold Inter)
- Label below (text-sm)

### Forms & Search
**Search Bar:**
- Full-width on mobile, max-w-2xl on desktop
- Height: h-12
- Icon prefix (search icon from Material Icons)
- Placeholder: 「モール名、都道府県で検索」
- Rounded: rounded-full
- Clear button when text present

**Filter Chips:**
- Horizontal scroll container
- Chip: px-4 py-2 rounded-full
- Gap: gap-2
- Toggle states for active/inactive

### Buttons
**Primary Action (Counter Button):**
- Full width: w-full
- Height: py-3
- Rounded: rounded-lg
- Font: font-medium
- Icon + Text combination
- Ripple effect on press

**Icon Buttons:**
- Size: w-10 h-10
- Rounded: rounded-full
- Centered icon (w-5 h-5)

### Data Display
**Statistics Dashboard:**
- Header: 「訪問統計」(text-xl font-semibold)
- Grid of stat cards (4 columns on desktop)
- Metrics: 総訪問回数, 訪問モール数, 最多訪問モール, 今月の訪問
- Padding: py-12

**Visit History List:**
- Timeline-style vertical list
- Each entry: Date (bold) + Mall name + Count indicator
- Dividers between entries
- Padding: py-2 per item

### Overlays
**User Menu Dropdown:**
- Anchored to avatar
- Width: w-56
- Rounded: rounded-lg
- Shadow: shadow-xl
- Items: Profile, Settings, Logout
- Padding per item: px-4 py-3

**Authentication Modal:**
- Centered overlay
- Max width: max-w-md
- Padding: p-8
- Rounded: rounded-2xl
- Logo at top
- Social login buttons (Google, GitHub)
- Email/password form below

---

## Icon Library
**Material Icons (CDN):**
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

**Key Icons:**
- search (検索)
- location_on (位置)
- calendar_today (日付)
- add (追加)
- account_circle (ユーザー)
- filter_list (フィルター)
- trending_up (統計)

---

## Page Layouts

### Main Mall List Page
- App bar (sticky)
- Search + filter section (py-6 bg-surface)
- Region tab navigation
- Mall cards grid (py-8)
- Floating action button (+ 新規追加) - bottom-right

### User Dashboard
- Hero statistics section (py-16, gradient background treatment)
  - Welcome message with user name
  - 4-column stats grid
- Recent visits section (py-12)
  - Timeline list of last 10 visits
- Most visited malls (py-12)
  - Horizontal scrollable cards

### Authentication Page
- Centered modal approach
- Minimal background
- Focus on auth options

---

## Responsive Behavior
- **Mobile First:** Single column layouts, full-width cards
- **Tablet (768px+):** 2-column grids, expanded search bar
- **Desktop (1024px+):** 3-column grids, persistent filters sidebar option
- **Touch Targets:** Minimum 44px height for all interactive elements

---

## Animations
**Minimal & Purposeful:**
- Card hover elevation transitions (duration-200)
- Counter increment animation (scale pulse effect)
- Page transitions: subtle fade (duration-150)
- NO scroll-triggered animations
- NO complex hero animations

---

## Images
**No images required** - This is a data-focused utility application. All visual interest comes from typography hierarchy, spacing, and clean component design. Icons provide sufficient visual cues.