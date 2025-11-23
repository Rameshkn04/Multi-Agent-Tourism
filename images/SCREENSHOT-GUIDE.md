# 📸 Screenshot Guide for Deployed App

This guide will help you take screenshots of the working deployed API for the README.

## Required Screenshots

You need to take **5 screenshots** showing the deployed app working:

1. **Health Check** - Browser screenshot
2. **Places API Test** - Postman/API tool screenshot
3. **Weather API Test** - Postman/API tool screenshot
4. **Combined Test** - Postman/API tool screenshot
5. **Error Handling Test** - Postman/API tool screenshot

---

## Step-by-Step Instructions

### 1. Health Check Screenshot

**File name:** `deployed-health-check.png`

1. Open your browser
2. Navigate to: `https://multi-agent-tourism-r63s.onrender.com/health`
3. You should see:
   ```json
   {
     "status": "ok",
     "message": "Multi-Agent Tourism System is running"
   }
   ```
4. Take a screenshot showing:
   - The URL in the address bar
   - The JSON response displayed in the browser

---

### 2. Places API Test Screenshot

**File name:** `deployed-places-test.png`

**Using Postman:**
1. Open Postman
2. Create a new request
3. Set method to **POST**
4. Enter URL: `https://multi-agent-tourism-r63s.onrender.com/api/ask`
5. Go to **Headers** tab, add:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **Body** tab, select **raw** and **JSON**
7. Paste this body:
   ```json
   {
     "query": "I'm going to go to Bangalore, let's plan my trip."
   }
   ```
8. Click **Send**
9. Take a screenshot showing:
   - The request configuration (URL, method, headers, body)
   - The response (status: 200 OK, response body with places)

**Using Thunder Client (VS Code):**
1. Install Thunder Client extension in VS Code
2. Create new request
3. Set method to **POST**
4. URL: `https://multi-agent-tourism-r63s.onrender.com/api/ask`
5. Headers: Add `Content-Type: application/json`
6. Body: Select JSON and paste the query above
7. Click Send
8. Take a screenshot of the request and response

---

### 3. Weather API Test Screenshot

**File name:** `deployed-weather-test.png`

Follow the same steps as #2, but use this request body:

```json
{
  "query": "I'm going to Bangalore, what is the temperature there?"
}
```

Take a screenshot showing the weather response.

---

### 4. Combined Test Screenshot

**File name:** `deployed-combined-test.png`

Follow the same steps as #2, but use this request body:

```json
{
  "query": "I'm going to Bangalore, what is the temperature there? And what places can I visit?"
}
```

Take a screenshot showing both weather and places in the response.

---

### 5. Error Handling Test Screenshot

**File name:** `deployed-error-test.png`

Follow the same steps as #2, but use this request body:

```json
{
  "query": "I'm going to go to XyzInvalidPlace123, let's plan my trip."
}
```

Take a screenshot showing:
- The request
- The error response: `{"success": false, "message": "I don't know this place exists"}`

---

## Screenshot Tips

✅ **Do:**
- Make sure the URL is visible in the screenshot
- Show both request and response clearly
- Include the status code (200 OK)
- Use a clean, readable tool (Postman, Thunder Client, Insomnia)
- Crop unnecessary UI elements

❌ **Don't:**
- Include personal information or API keys
- Show browser bookmarks or personal tabs
- Make screenshots too small to read
- Include unnecessary toolbars or menus

---

## Alternative: Using curl with Output

If you prefer command-line screenshots, you can also take screenshots of terminal output:

```bash
curl -X POST https://multi-agent-tourism-r63s.onrender.com/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "I'\''m going to go to Bangalore, let'\''s plan my trip."}'
```

Take a screenshot of the terminal showing the command and response.

---

## File Naming Convention

Save all screenshots in the `images/` directory with these exact names:
- `deployed-health-check.png`
- `deployed-places-test.png`
- `deployed-weather-test.png`
- `deployed-combined-test.png`
- `deployed-error-test.png`

---

## Quick Checklist

- [ ] Health check screenshot taken
- [ ] Places API test screenshot taken
- [ ] Weather API test screenshot taken
- [ ] Combined test screenshot taken
- [ ] Error handling test screenshot taken
- [ ] All files saved in `images/` directory
- [ ] All files named correctly
- [ ] Screenshots are clear and readable

---

Once you have all screenshots, they will automatically appear in the README.md file!

