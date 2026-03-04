# Configuration & PDP Updates

## ✅ PDP Configuration Implemented

### **New Config Settings**
Added to `src/config.json`:
```json
"pdp": {
    "showBrandName": true,
    "showInStock": true,
    "stockThresholds": {
        "low": 10,     // 1-10: Low Stock
        "medium": 100  // 11-100: Medium Stock
    }
}
```

### **Stock Logic Implementation**
In `src/app/product/[id]/page.tsx`:

| Quantity | Display Text | Color |
|----------|-------------|-------|
| 0 | **Out of Stock** | Red |
| 1 - `low` | **Low Stock** | Light Red |
| `low`+1 - `medium` | **Medium Stock** | Light Yellow |
| > `medium` | **High Stock** | Light Green |

**Note:** Actual stock numbers are never hidden, they are replaced by these status labels.

### **Brand Visibility**
- Controlled by `config.pdp.showBrandName`.
- If `false`, brand name is hidden from PDP.

---

## ✅ Additional Improvements

### **Search Page**
- Breadcrumb is now always visible, even when no search query is entered (e.g., initial search page).

### **Header**
- Clicking the Logo (Desktop & Mobile) now correctly navigates to the Homepage (`/`).

---

## **Current Config State**

```json
{
    "vtex": {
        "accountName": "sobharealtypoc",
        "checkoutPath": ".myvtex.com/checkout",
        "sellerId": "1"
    },
    "globalSettings": {
        "currency": "AED",
        "installmentProductCard": false,
        "gtmContainerId": ""
    },
    "marketplace": {
        "showSellerId": true
    },
    "pdp": {
        "showBrandName": true,
        "showInStock": true,
        "stockThresholds": {
            "low": 10,
            "medium": 100
        }
    }
}
```

The application is fully configured and optimized according to your latest requirements! 🚀
