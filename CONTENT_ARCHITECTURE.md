# Content Decoupling Architecture

This document explains how content is organized for a microservices approach.

## File Structure

### `/src/menu-content.json`
**Purpose:** Navigation menu structure  
**Used by:** `Navigation` component  
**Contains:**
- Categories (top-level menu items)
- Subcategories (dropdown items)
- Links and routing

**Microservice Ready:** This file can be replaced by an API endpoint in the future, making it easy to:
- Manage menu items via CMS
- Update navigation without deployment
- A/B test different menu structures
- Personalize menus per user segment

---

### `/src/site-content.json`
**Purpose:** General site content and static text  
**Contains:**
- Header text
- Search messages
- Cart labels
- Banner content
- Footer content

---

### `/src/config.json`
**Purpose:** Application configuration  
**Contains:**
- VTEX account settings
- Currency settings
- Feature flags
- GTM configuration

---

## Migration Path to Microservices

### Phase 1: Decoupled Files (Current)
```
menu-content.json  → Navigation Component
site-content.json  → Various Components
config.json        → Global Settings
```

### Phase 2: Content API (Future)
```
GET /api/content/menu       → Navigation Component
GET /api/content/site       → Various Components
GET /api/content/config     → Global Settings
```

### Phase 3: Full CMS Integration (Future)
```
CMS Dashboard → Content API → Components
```

---

## Benefits

1. **Separation of Concerns**
   - Menu management independent of other content
   - Easier to update specific parts

2. **Microservices Ready**
   - Each file can become an independent service
   - API endpoints can replace JSON files seamlessly

3. **Team Collaboration**
   - Marketing can manage menu structure
   - Development team manages config
   - Content team manages site text

4. **Version Control**
   - Changes to menu don't affect other content
   - Easier to track what changed

5. **Cache Strategy**
   - Different cache rules for different content types
   - Menu can cache longer than promotional content

---

## Implementation Example

### Current (File-based)
```typescript
import menuContent from '@/menu-content.json';
const { categories } = menuContent;
```

### Future (API-based)
```typescript
const menuContent = await fetch('/api/content/menu');
const { categories } = await menuContent.json();
```

---

## Best Practices

1. **Keep JSON Files Small**
   - One responsibility per file
   - Easier to load and parse

2. **Use Clear Naming**
   - `menu-content.json` not `data.json`
   - Self-documenting file purpose

3. **Version Your Content**
   - Consider adding version field
   - Helps with cache invalidation

4. **Document Structure**
   - TypeScript interfaces for content shape
   - Easier for teams to understand

---

## Next Steps for Full Microservices

1. Create API endpoints that return the same JSON structure
2. Add environment variable to switch between file/API mode
3. Implement content versioning and caching strategy
4. Add CMS integration for non-technical content updates
