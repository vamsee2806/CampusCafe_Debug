# CampusCafe — Debugging Report

## 1. Project Overview

CampusCafe is a two-page student café ordering application built with HTML, CSS, and JavaScript. It includes a menu page and a checkout page.

The project was initially affected by broken resource paths, incorrect JavaScript behavior, missing filtering logic, cart calculation bugs, and incomplete checkout features.

---

## 2. Before Debugging

### Resource and Navigation Problems

- `index.html` referred to incorrect CSS paths.
- The stylesheet `theme.css` was misspelled as `them.css`.
- `menuData.js` was loaded from an incorrect folder.
- Checkout styles and scripts used paths that did not account for the `pages` folder.
- The back-to-menu link pointed to the wrong location.
- The checkout grand-total JavaScript ID did not match the HTML ID.
- Menu images used nonexistent or misspelled paths.
- The theme background asset used an incorrect relative path.

### JavaScript Problems

- Only the first Add-to-Cart button received an event listener.
- Adding the same item created duplicate cart rows.
- Cart prices were loaded or displayed as strings.
- The subtotal did not multiply price by quantity correctly.
- The cart badge displayed the number of unique rows instead of total quantity.
- Saved cart data used different keys on the menu and checkout pages.
- Category filtering and search functionality were missing.
- Cart quantity controls were missing.
- Empty-cart checkout was not prevented.
- Promo-code logic was missing.
- Order confirmation validation was missing.

---

## 3. Changes Made

### 3.1 HTML and Resource Paths

Updated `index.html`:

- `css/main.css` → `styles/main.css`
- `styles/them.css` → `styles/theme.css`
- `js/menuData.js` → `scripts/menuData.js`
- Ensured `menuData.js` loads before `app.js`

Updated `pages/checkout.html`:

- Changed stylesheet paths to `../styles/main.css` and `../styles/theme.css`.
- Changed the checkout script path to `../scripts/checkout.js`.
- Changed the back-to-menu link to `../index.html`.
- Matched the grand-total JavaScript ID with the HTML ID `grand-total`.

Updated `styles/theme.css`:

- Changed the background pattern path to `../assets/bg-pattern.svg`.

### 3.2 Menu Data and Icons

Updated `scripts/menuData.js`:

- Converted menu prices into numeric values.
- Corrected Cold Brew Coffee to `assets/icons/coffee.svg`.
- Corrected Grilled Veg Sandwich to `assets/icons/sandwich.svg`.
- Corrected Choco Chip Muffin to `assets/icons/muffin.svg`.
- Corrected Fresh Orange Juice to `assets/icons/juice.svg`.

### 3.3 Menu Filtering and Search

Updated `scripts/app.js` to:

- Filter items by All, Drinks, or Snacks.
- Highlight the selected category button.
- Search menu item names in real time.
- Apply category and search filters together.

### 3.4 Cart Functionality

Updated cart behavior to:

- Increase quantity when an existing item is added again.
- Prevent duplicate cart rows.
- Provide working `+` and `−` quantity buttons.
- Remove an item when its quantity reaches zero.
- Calculate the subtotal numerically using price × quantity.
- Display the total item quantity in the cart badge.
- Store cart data consistently for the menu and checkout pages.

### 3.5 Empty-Cart Protection

The checkout button now:

- Prevents navigation when the cart is empty.
- Displays: “Your cart is empty. Add an item before checkout.”

### 3.6 Checkout Calculations

Updated `scripts/checkout.js` to:

- Load cart items from `cartItems` or `campus_cart` Local Storage.
- Calculate the subtotal using numeric prices.
- Calculate GST as 5% of the subtotal.
- Display the discount amount.
- Calculate the grand total as:

  `Subtotal + GST − Discount`

### 3.7 Promo-Code Logic

The `STUDENT15` promo now:

- Gives a 15% discount.
- Works only when the subtotal is at least ₹150.
- Displays an error for invalid codes.
- Displays an error when the subtotal is below ₹150.
- Resets the discount to zero when the promo is invalid or not applicable.

### 3.8 Order Confirmation

The checkout form now:

- Rejects an empty cart.
- Requires Full Name.
- Requires Roll Number.
- Generates an order ID beginning with `CC-`.
- Displays a success confirmation message.
- Removes the cart from Local Storage after confirmation.
- Resets the checkout summary and form.

---

## 4. Before and After Comparison

| Feature | Before | After |
|---|---|---|
| CSS loading | Incorrect or misspelled paths | Correct page-relative stylesheet paths |
| Script loading | Menu data loaded incorrectly | Menu data loads before application logic |
| Menu images | Broken or missing SVG images | Every icon loads from `assets/icons` |
| Add-to-Cart | Only first button worked reliably | Every menu card has working cart behavior |
| Re-adding an item | Created duplicate rows | Increased the existing quantity |
| Cart totals | Used strings or ignored quantity | Used numeric price × quantity calculations |
| Cart count | Counted cart rows | Counted the total quantity |
| Quantity controls | Missing | Working `+` and `−` buttons |
| Menu filtering | Missing | All, Drinks, and Snacks filters work |
| Search | Missing | Filters names in real time |
| Empty checkout | Allowed navigation | Blocked with a helpful message |
| Checkout cart | Could not find saved cart data | Loads shared Local Storage cart data |
| Grand total | Element mismatch or missing result | Displays the calculated grand total |
| Promo code | Not implemented | Validates and applies `STUDENT15` |
| Order confirmation | Missing validation | Validates cart and student details |

---

## 5. Calculation Example

For two Cold Brew Coffee items:

- Subtotal: `2 × ₹120 = ₹240`
- GST: `₹240 × 5% = ₹12`
- `STUDENT15` discount: `₹240 × 15% = ₹36`
- Grand total: `₹240 + ₹12 − ₹36 = ₹216`

---

## 6. Verification

The application was verified with a local HTTP server.

Verified behavior includes:

- All four menu items are displayed.
- All SVG icons load.
- Category filters and search work.
- Re-adding an item increases quantity.
- Plus and minus controls update the cart.
- The cart subtotal is numeric.
- Cart items appear on the checkout page.
- GST and discount calculations appear correctly.
- `STUDENT15` applies only under the correct conditions.
- Student details and empty-cart validation work.
- VS Code reported no code errors.

---

## 7. Reflection

Pasting one file into a standard chat window does not provide enough context to solve every issue in a multi-file project. Such a chat may not know the project folder structure, existing asset filenames, relative paths, script loading order, HTML element IDs, or shared Local Storage keys.

Workspace-aware tools can inspect the complete project and trace relationships across HTML, CSS, JavaScript, and assets. This allows them to locate and fix problems more accurately and verify the complete application behavior.
