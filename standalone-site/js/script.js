const N8N_WEBHOOK_URL = 'https://marahamj.app.n8n.cloud/webhook/11e919ba-fff0-423c-a748-104e4f586835/chat';
  const REQUEST_TIMEOUT_MS = 30000;
  const SESSION_KEY = 'nano_it_chat_session';

  const form = document.getElementById('chat-form');
  const input = document.getElementById('question');
  const messages = document.getElementById('messages');
  const sendButton = form.querySelector('.send');
  const suggestions = document.querySelector('.suggestions');
  const helpButton = document.querySelector('.help');

  // إنشاء أو استرجاع sessionId مرة واحدة فقط
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'web_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  function addMessage(text, role = 'assistant') {
    const message = document.createElement('div');
    message.className = 'message';
    message.textContent = text;

    if (role === 'user') {
      message.style.marginLeft = 'auto';
      message.style.marginTop = '12px';
      message.style.background = '#e4f4ef';
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function previewAnswer(question) {
    const q = question.toLowerCase();

    if (q.includes('تواصل') || q.includes('الفريق') || q.includes('contact')) {
      return 'بالتأكيد. أرسل طلب التواصل وسيتابع معك أحد أعضاء فريق Nano IT قريباً.';
    }
    if (q.includes('تقنيات') || q.includes('التقنية') || q.includes('technolog')) {
      return 'وفق قاعدة المعرفة، تشمل التقنيات والخدمات: تطوير الواجهات، تطوير الأنظمة، التكاملات، والأتمتة.';
    }
    if (q.includes('خدمات') || q.includes('service')) {
      return 'نقدم خدمات تطوير الويب، تطبيقات الأعمال، التكامل مع الأنظمة، والأتمتة حسب احتياج مشروعك.';
    }

    return 'هذه معاينة للواجهة حالياً. ضع رابط Webhook الإنتاج من n8n لتفعيل الإجابات الحقيقية.';
  }

  async function getAnswer(question) {
    // لو الرابط فاضي → استخدم المعاينة
    if (!N8N_WEBHOOK_URL.trim()) {
      return previewAnswer(question);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: question,
          sessionId: sessionId
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const result = Array.isArray(data) ? data[0] : data;

      return (
        result?.output ||
        result?.answer ||
        result?.response ||
        result?.message ||
        result?.text ||
        'لم تصل إجابة مفهومة من الخادم.'
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  async function sendMessage(value) {
    const question = value.trim();
    if (!question || sendButton.disabled) return;

    addMessage(question, 'user');
    input.value = '';
    sendButton.disabled = true;
    sendButton.textContent = '…';

    const typing = addMessage('جاري الكتابة…');

    try {
      const answer = await getAnswer(question);
      typing.remove();
      addMessage(String(answer), 'assistant');
    } catch (error) {
      typing.textContent =
        error.name === 'AbortError'
          ? 'انتهت مهلة الاتصال. حاول مرة أخرى.'
          : 'تعذر الاتصال بالخادم حالياً. تحقق من رابط Webhook وإعدادات CORS.';
      typing.style.color = '#a34d43';
      console.error('Nano IT Assistant error:', error);
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = '↑';
      input.focus();
    }
  }

  // الأحداث
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  if (suggestions) {
    suggestions.addEventListener('click', (event) => {
      if (event.target.matches('.suggestion')) {
        sendMessage(event.target.textContent);
      }
    });
  }

  if (helpButton) {
    helpButton.addEventListener('click', () => {
      addMessage(
        'أنا مساعد Nano IT. اسأل عن الخدمات والتقنيات الموجودة في قاعدة المعرفة.',
        'assistant'
      );
    });
   
  }