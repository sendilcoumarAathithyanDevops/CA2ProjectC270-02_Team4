# Bug Testing Report - Angry Birds Game Application

## Date: January 28, 2026
## Status: ✅ Tests Pass | ⚠️ Issues Found

---

## Test Results Summary

### Unit Tests: ✅ PASSING
```
Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        9.514 s
```

### Security Audit: ✅ PASSED
- No vulnerable dependencies found
- All packages audited: 0 vulnerabilities

---

## 🐛 Bugs & Issues Identified

### 1. **Resource Leaks - Server Process Not Cleanly Exiting**
**Severity:** MEDIUM  
**File:** `src/server/server.js`  
**Issue:** Test worker process fails to exit gracefully
```
A worker process has failed to exit gracefully and has been force exited. 
This is likely caused by tests leaking due to improper teardown.
```
**Root Cause:** Server instance not being properly closed after tests  
**Fix Recommended:** Add `server.close()` in test teardown

---

### 2. **Async Test Logging Issue**
**Severity:** LOW  
**File:** `src/server/server.js` (line 858)  
**Issue:** Console log occurs after tests are done
```
Cannot log after tests are done. Did you forget to wait for something async in your test?
Attempted to log "Server running at http://localhost:3000/"
```
**Root Cause:** Server starts logging after test completes; missing cleanup  
**Fix Recommended:** Mock or suppress console.log in tests

---

### 3. **Line Ending Inconsistency - CRLF vs LF**
**Severity:** HIGH (Code Quality)  
**Files Affected:**
- `src/server/server.js` - All lines
- `tests/game.test.js` - All lines  
- `tests/server.test.js` - All lines

**Issue:** 141,634 ESLint errors due to CRLF line endings on Windows  
**Fix Recommended:**
```bash
npm install --save-dev dos2unix
# Convert files to Unix line endings
dos2unix src/server/server.js tests/**/*.js
```

Or configure `.gitattributes`:
```
* text=auto eol=lf
*.js text eol=lf
```

---

### 4. **Minified Library Code - Not Included in Linting**
**Severity:** LOW  
**File:** `src/client/lib/matter.js` (minified code)  
**Issue:** Massive number of linting errors (~138,781) from minified code  
**Root Cause:** ESLint configured to check library files  
**Fix Recommended:** 
Add to `.eslintignore`:
```
src/client/lib/*.js
node_modules/
```

---

### 5. **Jest Global Variables Not Recognized**
**Severity:** LOW  
**Files:** `tests/game.test.js`, `tests/server.test.js`  
**Errors:** 'describe', 'test', 'expect' marked as undefined  
**Issue:** Missing Jest environment in `.eslintrc` configuration  
**Fix Recommended:**
Update `.eslintrc.js`:
```javascript
env: {
  jest: true  // Add this
}
```

---

### 6. **Console Statement in Production Code**
**Severity:** MEDIUM  
**File:** `src/server/server.js:61`  
**Issue:** `console.log()` used directly (should be removed in production)
```javascript
console.log(`Server running at http://localhost:${port}/`);
```
**Fix Recommended:** Use proper logging library or conditionally log

---

### 7. **Path Traversal Security Check - Incomplete**
**Severity:** MEDIUM  
**File:** `src/server/server.js:33`  
**Current Code:**
```javascript
if (!filePath.startsWith(baseDir)) {
  res.statusCode = 403;
  res.end('Forbidden');
  return;
}
```
**Issue:** Path could be normalized differently; symbolic link attacks possible  
**Fix Recommended:**
```javascript
const realPath = fs.realpathSync(filePath);
if (!realPath.startsWith(baseDir)) {
  res.statusCode = 403;
  res.end('Forbidden');
  return;
}
```

---

### 8. **Low Test Coverage**
**Severity:** MEDIUM  
**Metrics:**
- Statement Coverage: 24.24%
- Branch Coverage: 16.66%
- Function Coverage: 0%

**Issue:** Only 25 lines of code covered by tests  
**Fix Recommended:** Add tests for:
- File serving functionality
- MIME type detection
- Error handling paths
- Edge cases

---

### 9. **Missing Error Handling in Stream**
**Severity:** MEDIUM  
**File:** `src/server/server.js:50-53`  
**Issue:** Stream error handled but response may already be sent
```javascript
stream.on('error', () => {
  res.statusCode = 500;
  res.end('Server error');
});
```
**Risk:** Response header already sent by `writeHead()`  
**Fix Recommended:**
```javascript
let errorHandled = false;
stream.on('error', () => {
  if (!errorHandled) {
    errorHandled = true;
    res.statusCode = 500;
    res.end('Server error');
  }
});
```

---

### 10. **Missing Encoding Declaration**
**Severity:** LOW  
**File:** `src/server/server.js`  
**Issue:** No charset specified in Content-Type header  
**Current:** `text/html` should be `text/html; charset=utf-8`  
**Fix Recommended:**
```javascript
'text/html': 'text/html; charset=utf-8',
'application/json': 'application/json; charset=utf-8',
```

---

## Summary of Fixes

### High Priority (Security/Stability):
- [ ] Fix path traversal vulnerability with `fs.realpathSync()`
- [ ] Fix line ending inconsistency (CRLF → LF)
- [ ] Add proper error handling for stream responses

### Medium Priority (Code Quality):
- [ ] Increase test coverage (target: 70%+)
- [ ] Fix resource cleanup in tests
- [ ] Add charset to Content-Type headers

### Low Priority (Code Style):
- [ ] Configure ESLint for Jest globals
- [ ] Add `.eslintignore` for library files
- [ ] Remove/mock console.log statements

---

## Recommendations

1. **Run tests with fixes:**
   ```bash
   npm run lint --fix  # Fix auto-fixable issues
   npm test            # Re-run tests
   ```

2. **Update CD Pipeline:** The `cd.yml` includes security scanning and will catch these issues automatically.

3. **Configure Git:** Add `.gitattributes` to enforce LF line endings across the team

4. **Add Pre-commit Hook:** Prevent committing files with CRLF endings
   ```bash
   npm install --save-dev husky lint-staged
   ```
