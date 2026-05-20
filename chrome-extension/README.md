# SheldonAI Chrome Extension

Posts SheldonAI sentence-level essay annotations as native Google Docs comments.

---

## One-time setup

### 1. Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a new project (e.g. "SheldonAI Extension").
2. In the left sidebar go to **APIs & Services → Library**.
3. Search for and enable both:
   - **Google Docs API**
   - **Google Drive API**

### 2. Get your extension ID

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the `chrome-extension/` folder.
4. Copy the **Extension ID** shown under the extension name (a 32-character string like `abcdefghijklmnopabcdefghijklmnop`).

### 3. Create OAuth2 credentials

1. In Google Cloud Console go to **APIs & Services → Credentials**.
2. Click **Create Credentials → OAuth client ID**.
3. Set **Application type** to **Chrome Extension**.
4. In the **Application ID** field paste your Extension ID from step 2.
5. Click **Create** and copy the generated **Client ID**.

### 4. Add the Client ID to the manifest

Open `chrome-extension/manifest.json` and replace the placeholder:

```json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
  ...
}
```

with your actual client ID, e.g.:

```json
"oauth2": {
  "client_id": "123456789012-abcdefghijklmnop.apps.googleusercontent.com",
  ...
}
```

### 5. Reload the extension

1. Go back to `chrome://extensions`.
2. Click the **refresh icon** on the SheldonAI extension card.

---

## Using the extension

1. Open your college essay in Google Docs.
2. Click the **SheldonAI icon** in the Chrome toolbar.
3. Click **Analyze Essay**.
4. Sign in with Google when prompted (first time only).
5. Watch the progress — each annotation is posted as a comment.
6. When done, open the **Comments panel** in Google Docs (top-right speech bubble icon) to read all feedback anchored to the relevant sentences.

---

## Notes

- The extension reads your doc as plain text — no formatting data is sent to SheldonAI.
- Comments are posted using the Google Drive API and appear exactly as they would if a teacher left them.
- The `quotedFileContent` field in each comment shows the exact sentence being annotated.
- The first run requires a Google sign-in prompt. Subsequent runs reuse the cached token.
