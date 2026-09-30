import * as stylex from '@stylexjs/stylex';
import { tokens } from './tokens.stylex';

export const layoutStyles = stylex.create({
  skipLink: {
    position: 'fixed',
    top: '12px',
    left: '12px',
    zIndex: 200,
    paddingBlock: '10px',
    paddingInline: '14px',
    borderRadius: tokens.radiusControl,
    backgroundColor: tokens.actionPrimary,
    color: tokens.surfacePage,
    fontFamily: tokens.fontMono,
    fontSize: '14px',
    fontWeight: 700,
    textDecoration: 'none',
    transform: 'translateY(-200%)',
    transitionProperty: 'transform',
    transitionDuration: '160ms',
    ':focus': {
      transform: 'translateY(0)',
    },
  },
});
