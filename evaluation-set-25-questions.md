# Nano IT — RAG Chat Agent Evaluation Set

Bilingual evaluation log used to test the P2 chat agent against the project's acceptance criteria (≥ 90% accuracy, no hallucinated pricing/clients/guarantees, graceful refusal + human handoff).

**Test date:** 2026-08-27 (post Top-K tuning)
**Total questions:** 27
**Passed:** 25
**Failed:** 2
**Pass rate: 92.6%** ✅ (target: ≥ 90%)

## Legend
- ✅ Pass — accurate, grounded in knowledge base, or correctly refused/escalated
- ⚠️ Fail — factually available information was not surfaced (retrieval gap, not hallucination)

| # | Lang | Question | Actual Answer (summary) | Result |
|---|---|---|---|---|
| 1 | AR | سعر Basic Website Development | $250–$600, 1-2 weeks, React/Node.js | ✅ Pass |
| 2 | EN | Ecommerce Website price range | $500–$1500, 3-5 weeks, React/Node.js/Stripe | ✅ Pass |
| 3 | AR | مدة تطوير تطبيق Android | 3-6 أسابيع | ✅ Pass |
| 4 | AR | Tech stack المذكور في قاعدة المعرفة | React, Node.js, Stripe, Electron, Python + usage context | ✅ Pass |
| 5 | EN | Does Nano IT build custom systems for companies? | Yes — custom dashboards, system optimization, support | ✅ Pass |
| 6 | EN | Price range for all services | Listed 5 services with accurate ranges | ✅ Pass |
| 7 | AR | ما أفضل شركة برمجيات في الأردن؟ (out-of-scope) | Correctly refused, no fabrication | ✅ Pass |
| 8 | EN | Can you guarantee project success? (out-of-scope) | Correctly refused, no fabricated guarantee | ✅ Pass |
| 9 | AR | طلب تواصل — نور علي (name+email+phone) | Confirmed details, asked for approval | ✅ Pass |
| 10 | AR | تأكيد الطلب — نور علي | create_lead executed successfully | ✅ Pass |
| 11 | AR/EN | ما هي خدماتكم؟ + What technologies do you use? | Services answered; technologies incorrectly said "not available" | ⚠️ Fail |
| 12 | EN | Which technologies are in the knowledge base? | Incorrectly said technologies not specified | ⚠️ Fail |
| 13 | EN | Consultation request — Omar Saleh | Confirmed details correctly | ✅ Pass |
| 14 | EN | Confirm — Omar Saleh | create_lead executed successfully | ✅ Pass |
| 15 | EN | Can you share past clients or case studies? (out-of-scope) | Correctly refused, no invented names | ✅ Pass |
| 16 | EN | Hello, I want to learn more about your services | Accurate general company overview | ✅ Pass |
| 17 | EN | Who are Nano IT's clients? (out-of-scope) | Correctly refused | ✅ Pass |
| 18 | EN | What is Nano IT's contact email? | Info@nanoitcompany.com | ✅ Pass |
| 19 | EN | Blockchain services offered | Full accurate list (Consulting, DApp, Smart Contracts, Network Dev) | ✅ Pass |
| 20 | AR | طرق التواصل + إيميل + واتساب + ساعات العمل | Full accurate answer incl. WhatsApp number | ✅ Pass |
| 21 | AR | خدمات تطوير الأنظمة فقط | Accurate multi-service breakdown with prices/durations/stack | ✅ Pass |
| 22 | AR | استشارة معقدة — أحمد ناصر (اسم+شركة+خدمتين) | Correctly confirmed all fields incl. company name | ✅ Pass |
| 23 | AR | تأكيد — أحمد ناصر | create_lead executed successfully | ✅ Pass |
| 24 | EN | How many revisions are included in the base price? | Two (2) revisions + 1 month free support | ✅ Pass |
| 25 | AR | سعر Custom Dashboard Development | $500–$1500, 3-5 weeks | ✅ Pass |
| 26 | AR | كيف آلية تسليم المشروع؟ | Accurate multi-part answer (deposit, delivery, support, revisions, comms) | ✅ Pass |
| 27 | AR | معلومات مطلوبة للتواصل مع الفريق | Accurate — name + valid contact method | ✅ Pass |

## Known limitation

General questions that lack the specification of a particular service (e.g., asking: "What technologies do you use?" without mentioning a specific service) may sometimes fail to retrieve Tech Stack information, even though the same information appears correctly if a specific service name is mentioned (as in cases #4 and #21) or if the question is longer and more specific.

Nature of the problem: This problem is related to a retrieval-ranking gap and is not a "hallucination." The bot never invents technology names on its own; it only suffers from a weakness in data retrieval with this specific pattern of short, general questions.

Temporary solution (Mitigation): The Top-K value in the Supabase Vector Store has been increased from 3-4 to 5-6, which previously succeeded in solving a similar problem related to contact information questions. As for general technology questions, a minor issue remains open that requires additional modification in prompt phrasing or improvement in the search process later.