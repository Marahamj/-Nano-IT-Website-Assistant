/**
 * Nano IT — Embeddable Chat Widget
 * Usage: <script src="https://YOUR_HOST/nano-it-chat-widget.js" data-webhook="https://YOUR_N8N_WEBHOOK_URL"></script>
 *
 * Reads the n8n Production Webhook URL from the `data-webhook` attribute on
 * its own <script> tag, or falls back to WEBHOOK_URL below if you prefer to
 * hardcode it once you have a stable endpoint.
 */
(function () {
  "use strict";

  var CURRENT_SCRIPT = document.currentScript;
  var WEBHOOK_URL =
    (CURRENT_SCRIPT && CURRENT_SCRIPT.getAttribute("data-webhook")) ||
    "https://marahamj.app.n8n.cloud/webhook/11e919ba-fff0-423c-a748-104e4f586835/chat"; 

  var SESSION_KEY = "nano_it_chat_session";
  var sessionId =
    sessionStorage.getItem(SESSION_KEY) ||
    "web_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  sessionStorage.setItem(SESSION_KEY, sessionId);

  function isArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
  }

  // ---------- Styles ----------
  var css =
    "#nit-launcher{position:fixed;bottom:24px;inset-inline-end:24px;width:60px;height:60px;" +
    "border-radius:50%;background:#12172B;border:1px solid #262E47;cursor:pointer;z-index:999998;" +
    "box-shadow:0 8px 24px rgba(15,20,40,.35);display:flex;align-items:center;justify-content:center;" +
    "transition:transform .15s ease;}" +
    "#nit-launcher:hover{transform:scale(1.06);}" +
    "#nit-launcher .nit-dot{position:absolute;top:8px;inset-inline-end:8px;width:9px;height:9px;" +
    "border-radius:50%;background:#17E3B5;box-shadow:0 0 0 0 rgba(23,227,181,.6);" +
    "animation:nit-pulse 2.2s infinite;}" +
    "@keyframes nit-pulse{0%{box-shadow:0 0 0 0 rgba(23,227,181,.55);}70%{box-shadow:0 0 0 8px rgba(23,227,181,0);}100%{box-shadow:0 0 0 0 rgba(23,227,181,0);}}" +
    "#nit-panel{position:fixed;bottom:96px;inset-inline-end:24px;width:368px;max-width:92vw;height:520px;" +
    "max-height:76vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,20,40,.28);" +
    "display:none;flex-direction:column;overflow:hidden;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;}" +
    "#nit-panel.nit-open{display:flex;}" +
    "#nit-head{background:#12172B;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.035) 0 2px,transparent 2px 14px);" +
    "color:#fff;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;}" +
    "#nit-head .nit-title{font-size:15px;font-weight:700;letter-spacing:.2px;}" +
    "#nit-head .nit-sub{font-size:11.5px;color:#8B93AC;margin-top:2px;}" +
    "#nit-close{background:none;border:none;color:#8B93AC;font-size:20px;cursor:pointer;line-height:1;padding:4px;}" +
    "#nit-close:hover{color:#fff;}" +
    "#nit-msgs{flex:1;overflow-y:auto;padding:16px;background:#F7F8FA;display:flex;flex-direction:column;gap:10px;}" +
    ".nit-row{display:flex;}" +
    ".nit-row.bot{justify-content:flex-start;}" +
    ".nit-row.user{justify-content:flex-end;}" +
    ".nit-bubble{max-width:80%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.5;white-space:pre-wrap;}" +
    ".nit-row.bot .nit-bubble{background:#fff;border:1px solid #E7E9F0;color:#1A1F2E;border-start-start-radius:4px;}" +
    ".nit-row.user .nit-bubble{background:#12172B;color:#fff;border-start-end-radius:4px;}" +
    ".nit-typing{display:flex;gap:4px;padding:12px 13px;}" +
    ".nit-typing span{width:6px;height:6px;border-radius:50%;background:#B6BBCB;animation:nit-bounce 1.2s infinite;}" +
    ".nit-typing span:nth-child(2){animation-delay:.15s;}.nit-typing span:nth-child(3){animation-delay:.3s;}" +
    "@keyframes nit-bounce{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-4px);opacity:1;}}" +
    "#nit-inputrow{display:flex;gap:8px;padding:12px;border-top:1px solid #ECEEF3;background:#fff;}" +
    "#nit-input{flex:1;border:1px solid #DFE2EA;border-radius:10px;padding:10px 12px;font-size:13.5px;" +
    "font-family:inherit;resize:none;outline:none;max-height:80px;}" +
    "#nit-input:focus{border-color:#17E3B5;}" +
    "#nit-send{background:#12172B;color:#fff;border:none;border-radius:10px;padding:0 16px;cursor:pointer;" +
    "font-size:13px;font-weight:600;}" +
    "#nit-send:disabled{opacity:.5;cursor:default;}" +
    "@media (max-width:480px){#nit-panel{inset-inline-end:12px;bottom:84px;width:calc(100vw - 24px);}}";

  var styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ---------- DOM ----------
  var launcher = document.createElement("div");
  launcher.id = "nit-launcher";
  launcher.innerHTML =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M4 4h16v11H8l-4 4V4z" stroke="#17E3B5" stroke-width="1.7" stroke-linejoin="round"/>' +
    '</svg><span class="nit-dot"></span>';
  document.body.appendChild(launcher);

  var panel = document.createElement("div");
  panel.id = "nit-panel";
  panel.innerHTML =
    '<div id="nit-head">' +
    '<div><div class="nit-title">Nano IT Assistant</div><div class="nit-sub">Usually replies in seconds · نساعدك بالعربي والإنجليزي</div></div>' +
    '<button id="nit-close" aria-label="Close">&times;</button>' +
    "</div>" +
    '<div id="nit-msgs"></div>' +
    '<div id="nit-inputrow">' +
    '<textarea id="nit-input" rows="1" placeholder="Ask about services, pricing, timelines… / اسأل عن الخدمات والأسعار"></textarea>' +
    '<button id="nit-send">Send</button>' +
    "</div>";
  document.body.appendChild(panel);

  var msgsEl = panel.querySelector("#nit-msgs");
  var inputEl = panel.querySelector("#nit-input");
  var sendBtn = panel.querySelector("#nit-send");
  var closeBtn = panel.querySelector("#nit-close");
  var opened = false;

  function addMessage(text, who) {
    var row = document.createElement("div");
    row.className = "nit-row " + who;
    var bubble = document.createElement("div");
    bubble.className = "nit-bubble";
    bubble.style.direction = isArabic(text) ? "rtl" : "ltr";
    bubble.style.textAlign = isArabic(text) ? "right" : "left";
    bubble.textContent = text;
    row.appendChild(bubble);
    msgsEl.appendChild(row);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return row;
  }

  function showTyping() {
    var row = document.createElement("div");
    row.className = "nit-row bot";
    row.id = "nit-typing-row";
    row.innerHTML =
      '<div class="nit-bubble nit-typing"><span></span><span></span><span></span></div>';
    msgsEl.appendChild(row);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  function hideTyping() {
    var row = document.getElementById("nit-typing-row");
    if (row) row.remove();
  }

  function greet() {
    if (msgsEl.children.length) return;
    addMessage(
      "Hi! I'm the Nano IT assistant — ask me about our services, pricing, or timelines.",
      "bot"
    );
    addMessage(
      "مرحبًا! أنا مساعد Nano IT — اسألني عن خدماتنا أو أسعارنا أو مددنا الزمنية.",
      "bot"
    );
  }

  async function sendMessage() {
    var text = inputEl.value.trim();
    if (!text) return;
    addMessage(text, "user");
    inputEl.value = "";
    inputEl.style.height = "auto";
    sendBtn.disabled = true;
    showTyping();

    try {
      var res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
          source: "P2_chat_widget",
        }),
      });
      var data = await res.json().catch(function () {
        return {};
      });
      hideTyping();
      var reply =
        data.output || data.reply || data.text || data.message ||
        "Sorry, something went wrong. Please try again. / عذرًا، حدث خطأ، جرّبي مرة أخرى.";
      addMessage(reply, "bot");
    } catch (err) {
      hideTyping();
      addMessage(
        "Connection error — please try again in a moment. / خطأ بالاتصال، جرّبي بعد قليل.",
        "bot"
      );
    } finally {
      sendBtn.disabled = false;
    }
  }

  launcher.addEventListener("click", function () {
    opened = !opened;
    panel.classList.toggle("nit-open", opened);
    if (opened) {
      greet();
      inputEl.focus();
    }
  });
  closeBtn.addEventListener("click", function () {
    opened = false;
    panel.classList.remove("nit-open");
  });
  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  inputEl.addEventListener("input", function () {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + "px";
  });
});