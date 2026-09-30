const form = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (form) {
  const submitButton = form.querySelector<HTMLButtonElement>(
    '[data-submit-button]',
  );
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const formStatus = form.querySelector<HTMLElement>('[data-form-status]');
  const successMessage = form.querySelector<HTMLElement>('[data-form-success]');
  const failureMessage = form.querySelector<HTMLElement>('[data-form-failure]');

  const dispatchAnalytics = (
    event: 'portfolio_contact_form_submitted' | 'portfolio_contact_form_failed',
    reason?: 'network' | 'service' | 'unknown',
  ) => {
    document.dispatchEvent(
      new CustomEvent('portfolio:analytics', {
        detail: reason ? { event, reason } : { event },
      }),
    );
  };

  form.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();

    if (!form.reportValidity() || !submitButton || !submitLabel) return;

    submitButton.disabled = true;
    submitLabel.textContent = 'Sending…';
    formStatus?.setAttribute('hidden', '');
    successMessage?.setAttribute('hidden', '');
    failureMessage?.setAttribute('hidden', '');

    const body = new URLSearchParams();
    for (const [key, value] of new FormData(form).entries()) {
      if (typeof value === 'string') body.append(key, value);
    }

    try {
      const response = await fetch(form.action || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (!response.ok) {
        formStatus?.removeAttribute('hidden');
        failureMessage?.removeAttribute('hidden');
        dispatchAnalytics('portfolio_contact_form_failed', 'service');
        return;
      }

      form.reset();
      formStatus?.removeAttribute('hidden');
      successMessage?.removeAttribute('hidden');
      dispatchAnalytics('portfolio_contact_form_submitted');
    } catch {
      formStatus?.removeAttribute('hidden');
      failureMessage?.removeAttribute('hidden');
      dispatchAnalytics('portfolio_contact_form_failed', 'network');
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Send message →';
    }
  });
}
