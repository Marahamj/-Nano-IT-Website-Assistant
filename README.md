# Nano IT — RAG Chat Agent (P2)

Bilingual (Arabic/English) RAG-based chat assistant for `nanoitcompany.com`, built as part of the AI Agent & Automation Internship at Nano IT Company.

Built as part of the AI Agent & Automation Internship at Nano IT Company.
---
## 🌐 Live Links
* **Live Assistant (Standalone Page):** https://nanochatbot73d1d.netlify.app/
* **Embeddable Widget Snippet:** Available in `https://melodic-daffodil-f4b689.netlify.app/wedjet.js`

---


## 🏗️ Architecture & Workflow Overview

```text
Visitor (widget or standalone page)
        │  message
        ▼

n8n Chat Trigger (P2 — public webhook)
        │
        ▼

AI Agent (OpenAI gpt-5-mini)
   ├── Tool: search_knowledge_base → Supabase Vector Store (pgvector)
   │            ▲

   │            │ embeddings (OpenAI)
   │            │ chunked knowledge base (bilingual AR/EN)
   │
   └── Tool: create_lead → P1 Smart Lead Intake Bot (sub-workflow call)
                  │
                  ├── Append row → Google Sheets
                  └── Notify team → Telegram


**⚙️ How It Works**
Knowledge Base Ingestion: Nano IT's website content, service descriptions, and FAQs (bilingual AR/EN) were compiled into a structured document, chunked using Recursive Character Text Splitter (chunkSize: 300, overlap: 30, markdown-aware), embedded via OpenAI Embeddings, and stored in a Supabase (pgvector) table.


Chat Agent: An n8n AI Agent workflow retrieves relevant context via search_knowledge_base to ground every factual response. Session memory (last 10 messages) is maintained per conversation.


Lead Capture: When a visitor asks to be contacted or the agent cannot answer confidently, it collects their name and contact info, confirms the details, and invokes the create_lead tool which triggers the P1 workflow as a seamless sub-workflow.


Session Logging: Each conversation turn is persisted for later review and analytics

**🧰 Tools Exposed to the AI Agent**
Tool Name	Purpose:

search_knowledge_base	Retrieves top-matching chunks from the Supabase vector store to ground every factual answer.

create_lead	Submits a confirmed lead (name, email/phone, service interest, message, language, source) to the P1 Lead Intake Bot.

**🛠️ Tech Stack**
Orchestration: n8n (Cloud)

LLM: OpenAI gpt-5-mini

Embeddings: OpenAI Embeddings

Vector Store: Supabase (pgvector)

Lead Pipeline: P1 — Smart Lead Intake Bot ( Google Sheets + Telegram)

Frontend: Vanilla HTML/CSS/JS chat widget & standalone page (via @n8n/chat)

Hosting: Netlify (Static hosting)

📊 Evaluation & Acceptance Criteria
A 25-question bilingual evaluation set covering pricing, services, timelines, tech stack, contact info, and out-of-scope refusal cases was used to test accuracy.

Full Results: View Evaluation Set

Pass Rate: 92.6%  (25/27)
[evaluation-set-25-questions.md](./evaluation-set-25-questions.md)
 






🚀 Setup & Reproduction
Import workflows/p1-lead-intake-bot.json and workflows/p2-nano-it-rag.json into n8n.

Configure credentials for OpenAI API, Supabase, Google Sheets/Postgres, and Telegram (P1).

Create a Supabase table with a vector(1536) embedding column and set up the match_documents RPC function.

Upload knowledge-base/nano-it-unified-knowledge-base.docx to the data loader source and run it once to populate the vector store.

Publish and activate both workflows on n8n Cloud.

Copy the P2 Chat Trigger's Production Webhook URL into webhookUrl in both files under widget/.

Deploy widget/nano-it-chat-standalone.html via Netlify for the live URL.

Embed the snippet from widget/nano-it-chat-widget-embed.html into any target website.

💡 Known Limitations
Very short, terse Arabic contact queries occasionally under-retrieve compared to English equivalents; mitigated by increasing Top K on the Supabase Vector Store node.

create_lead requires both P1 and P2 workflows to be active on n8n; if P1 is paused, lead submissions fail gracefully with a human-handoff message rather than a false confirmation
