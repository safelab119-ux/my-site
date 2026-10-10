(() => {
  const form = document.getElementById('inquiry-form');
  const msg = document.getElementById('form-msg');
  if (!form) return;

  const show = (text, kind) => {
    msg.textContent = text;
    msg.className = 'form-msg ' + kind;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = form.elements;
    const data = {
      name: f.name.value.trim(),
      contact: f.contact.value.trim(),
      message: f.message.value.trim(),
      website: f.website.value,
      consent: f.consent.checked,
    };
    if (!data.name || !data.contact) { show('이름과 연락처를 적어 주세요.', 'err'); (data.name ? f.contact : f.name).focus(); return; }
    if (!data.consent) { show('개인정보 수집·이용에 동의해 주세요.', 'err'); f.consent.focus(); return; }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    show('보내는 중이에요.', '');
    try {
      const r = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || '보내지 못했어요. 잠시 뒤 다시 시도해 주세요.');
      form.reset();
      show('문의가 접수됐어요. 확인 후 연락드릴게요.', 'ok');
    } catch (err) {
      show(err.message || '보내지 못했어요. 잠시 뒤 다시 시도해 주세요.', 'err');
    } finally {
      btn.disabled = false;
    }
  });
})();
