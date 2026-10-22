# Responsive UI Guide & Architecture

## Overview
This document outlines the responsive layout system, typography, breakpoints, and component hierarchy implemented for the School App based on the reference design.

---

## 1. Palette & Design Tokens

| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| **Primary Navy** | `#102A43` | Main brand color, header background, dark elements |
| **Action Blue** | `#2F80ED` | Primary active tabs, links, primary buttons |
| **Background** | `#F7F9FC` | Screen surface background |
| **Surface** | `#FFFFFF` | Elevated cards, modal dialogs, pill filters |
| **Success Green** | `#27AE60` | Present attendance badges, completed homework |
| **Warning Orange**| `#F2994A` | Leave status, pending tags, urgent markers |
| **Error Red** | `#EB5757` | Absent status, due date urgency alerts |
| **Text Dark** | `#17202A` | Primary typography |
| **Text Secondary**| `#6B7280` | Subtitles, times, rooms, captions |
| **Border Subtle** | `#EDF2F7` | Card borders and divider lines |

---

## 2. Responsive Breakpoints

Defined in [`src/constants/theme.ts`](file:///c:/Users/Afreen%20Siddiqua/Downloads/school-app/src/constants/theme.ts):
- **Compact Phones** (`< 360`):
  - Summary cards automatically wrap into a 2x2 grid (`width: '48.5%'`) instead of compressing text.
  - Attendance donut and metrics list stack vertically to prevent cramped text.
  - Header padding gently contracts from 16 to 12.
- **Standard Phones** (`360 - 767`):
  - 4 quick-stat cards display in a flexible row.
  - 7-column calendar cells dynamically calculate width using percentage units (`width: '14.28%'`).
  - Attendance summary displays donut chart and metrics side-by-side with equal spacing.
- **Tablets & Desktop** (`>= 768`):
  - Max container width constrained to `640` with `alignSelf: 'center'` to prevent wide distortion on iPads, Android tablets, or web browsers.

---

## 3. Responsive Screen Implementations

### **1. Parent Home Dashboard (`ParentHomeView.tsx`)**
- **Deep Navy Header**:
  - Greeting text (`"Good Morning, Priya! 👋"`) with `flex: 1` and `minWidth: 0` so it never overlaps header action icons.
  - Touch targets for Notification and Profile buttons are sized to at least `44 x 44`.
- **Child Profile Card**:
  - Full-width elevated card displaying student avatar, name, and class. Safely truncates (`numberOfLines={1}`) with `ellipsizeMode="tail"`.
- **Quick-Stat Cards**:
  - Built with `flexWrap: 'wrap'` and dynamic card width. Supports 92% Attendance, 3 Classes Today, 2 Homework Due, and 1 New Update.
- **Today's Schedule**:
  - Flexible rows showing time, colored period indicator, subject name, and room.
- **Homework Due & School Updates**:
  - Card banners with icons, bold titles, and multi-line descriptions.

### **2. Attendance Screen (`ParentAttendanceView.tsx`)**
- **Month Selector**:
  - Centered navigation with previous and next buttons.
- **Donut Summary Card**:
  - Circular attendance ring alongside Present (18), Absent (1), Leave (1), and Working Days (20).
  - Automatically switches between row and column layout based on screen width.
- **Interactive Calendar Grid**:
  - Seven equal columns for `Sun, Mon, Tue, Wed, Thu, Fri, Sat`.
  - Accessible date bubbles with green for Present, red for Absent, orange for Leave, and blue highlight for selected day.
- **Selected Day Status Card**:
  - Shows full details for selected date (`Tue, 12 Nov 2024 - Present - Full Day`).

### **3. Homework Screen (`ParentHomeworkView.tsx`)**
- **Pill Filter Bar**:
  - Segmented control for `All`, `Pending`, and `Completed`.
  - Minimum touch height of 48 layout units.
- **Assignment Cards**:
  - Card heights expand naturally to accommodate varying assignment descriptions.
  - Color-coded subject badges (*Mathematics*, *Science*, *English*, *Social Studies*).
  - Distinct status tags (`Pending` vs `Completed`).
  - Empty state provided when no assignments match the selected filter.

---

## 4. Accessibility & Safe Areas
- Interactive touch targets conform to the minimum recommended dimensions (~44–48 layout units).
- Accessible labels (`accessibilityRole="button"`, `accessibilityLabel`) added to all action icons, calendar date cells, and homework items.
- Bottom navigation bar is anchored outside the scroll view with safe area insets for iOS home indicator and Android navigation bars.
