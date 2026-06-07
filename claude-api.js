// Claude AI API wrapper — window.claude.complete(prompt) → Promise<string>
// API key is stored in localStorage('claude-api-key').
// When no key is set, complete() rejects; the UI hides the AI section in response.
window.claude = (function () {
  const MODEL = 'claude-haiku-4-5-20251001';

  async function complete(prompt) {
    const apiKey = (localStorage.getItem('claude-api-key') || '').trim();
    if (!apiKey) {
      throw new Error('NO_API_KEY');
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API 錯誤 ${response.status}`);
    }
    const data = await response.json();
    return data.content?.[0]?.text || '';
  }

  return { complete };
})();
