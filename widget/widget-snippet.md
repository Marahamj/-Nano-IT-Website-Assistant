# Nano IT — Embeddable Chat Widget

Paste this snippet just before `</body>` on any page to add the Nano IT floating
chat bubble. It connects directly to the P2 RAG chat agent (bilingual AR/EN,
grounded in the Nano IT knowledge base).

```html
<script
  src="https://melodic-daffodil-f4b689.netlify.app/wedjet.js"
  data-webhook="https://marahamj.app.n8n.cloud/webhook/11e919ba-fff0-423c-a748-104e4f586835/chat">
</script>
```

## What it does

- Renders a floating chat bubble (bottom corner of the page).
- On click, opens a small chat panel with a greeting message in both Arabic and English.
- Sends each visitor message to the P2 n8n Chat Trigger webhook and displays the reply.
- Auto-aligns each message left-to-right or right-to-left based on detected language.
- Persists a `sessionId` in `sessionStorage` so the agent's conversation memory
  stays consistent across messages within the same browser session.

## Source

The widget script itself lives at
[`wedjet.js`](https://melodic-daffodil-f4b689.netlify.app/wedjet.js) and is also
included in this repo at [`widget/nano-it-chat-widget.js`](../widget/nano-it-chat-widget.js)
for reference/version control.

## Configuration

No build step required. To point the widget at a different n8n webhook (e.g. after
re-deploying P2), just change the `data-webhook` attribute value above — no code edits needed.
