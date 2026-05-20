const SHELDON_API = "https://sheldon-ai-red.vercel.app/api/annotate";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("analyzeBtn");
  const statusEl = document.getElementById("status");

  btn.addEventListener("click", analyze);

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = type || "";
  }

  function getDocId(url) {
    const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  function getToken() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(token);
        }
      });
    });
  }

  function formatCategory(category) {
    return (category || "")
      .replace(/_/g, " ")
      .toUpperCase();
  }

  function buildCommentContent(ann) {
    const header = `[${formatCategory(ann.category)} — ${(ann.severity || "").toUpperCase()}]`;
    const parts = [header, "", ann.feedback || ""];
    if (ann.question && ann.question.trim()) {
      parts.push("", `Sheldon asks: ${ann.question}`);
    }
    return parts.join("\n");
  }

  async function postComment(docId, token, ann) {
    const body = {
      content: buildCommentContent(ann),
      quotedFileContent: {
        mimeType: "text/plain",
        value: ann.sentence || "",
      },
    };

    const resp = await fetch(
      `https://www.googleapis.com/drive/v3/files/${docId}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    return resp.ok;
  }

  async function analyze() {
    btn.disabled = true;
    setStatus("Getting current tab…");

    try {
      // 1. Get current tab URL
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const docId = getDocId(tab.url || "");

      if (!docId) {
        setStatus("Open a Google Docs document first.", "error");
        btn.disabled = false;
        return;
      }

      // 2. Authenticate
      setStatus("Authenticating with Google…");
      let token;
      try {
        token = await getToken();
      } catch (e) {
        setStatus("Sign-in failed: " + e.message, "error");
        btn.disabled = false;
        return;
      }

      // 3. Fetch document text
      setStatus("Reading document…");
      const txtResp = await fetch(
        `https://docs.google.com/document/export?format=txt&id=${docId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!txtResp.ok) {
        setStatus("Could not read document. Check that you have access.", "error");
        btn.disabled = false;
        return;
      }

      const text = await txtResp.text();

      if (!text || text.trim().length < 100) {
        setStatus("Document is too short to annotate.", "error");
        btn.disabled = false;
        return;
      }

      // 4. Send to SheldonAI
      setStatus("Analyzing essay with SheldonAI…");
      const annotResp = await fetch(SHELDON_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: text.trim(), essayType: "commonapp" }),
      });

      if (!annotResp.ok) {
        let errMsg = annotResp.statusText;
        try {
          const errBody = await annotResp.json();
          if (errBody.error) errMsg = errBody.error;
        } catch (_) {}
        setStatus("Analysis failed: " + errMsg, "error");
        btn.disabled = false;
        return;
      }

      const result = await annotResp.json();
      const annotations = Array.isArray(result.annotations) ? result.annotations : [];

      if (annotations.length === 0) {
        setStatus("No annotations returned.", "error");
        btn.disabled = false;
        return;
      }

      // 5. Post every annotation as a Drive comment
      let posted = 0;
      const total = annotations.length;

      for (let i = 0; i < total; i++) {
        setStatus(`Posting comment ${i + 1} of ${total}…`);
        const ok = await postComment(docId, token, annotations[i]);
        if (ok) posted++;
      }

      setStatus(`Done — ${posted} comment${posted !== 1 ? "s" : ""} posted`, "success");
    } catch (e) {
      setStatus("Unexpected error: " + e.message, "error");
    }

    btn.disabled = false;
  }
});
