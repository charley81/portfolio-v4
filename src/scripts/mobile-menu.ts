const openButton =
  document.querySelector<HTMLButtonElement>('[data-menu-open]');
const dialog = document.querySelector<HTMLDialogElement>(
  '#mobile-navigation-dialog',
);

if (openButton && dialog) {
  const closeMenu = () => {
    if (dialog.open) {
      dialog.close();
    }
  };

  const openMenu = () => {
    if (!dialog.open) {
      dialog.showModal();
    }
  };

  openButton.addEventListener('click', openMenu);

  dialog
    .querySelectorAll<HTMLElement>('[data-menu-close]')
    .forEach((control) => {
      control.addEventListener('click', closeMenu);
    });

  dialog.addEventListener('close', () => {
    openButton.setAttribute('aria-expanded', 'false');
    document.body.removeAttribute('data-menu-open');
    openButton.focus();
  });

  dialog.addEventListener('cancel', () => {
    openButton.setAttribute('aria-expanded', 'false');
    document.body.removeAttribute('data-menu-open');
  });

  dialog.addEventListener('toggle', () => {
    if (dialog.open) {
      openButton.setAttribute('aria-expanded', 'true');
      document.body.setAttribute('data-menu-open', '');
    }
  });

  const desktopQuery = window.matchMedia('(min-width: 1100px)');
  desktopQuery.addEventListener('change', ({ matches }) => {
    if (matches) closeMenu();
  });
}
