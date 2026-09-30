import * as stylex from '@stylexjs/stylex';
import { tokens } from './tokens.stylex';

export const footerStyles = stylex.create({
  footer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    height: {
      default: '85px',
      '@media (min-width: 900px)': '124px',
    },
    paddingBlock: {
      default: '32px',
      '@media (min-width: 900px)': '50px',
    },
    paddingInline: {
      default: '20px',
      '@media (min-width: 600px)': 'clamp(32px, 6.944vw, 100px)',
      '@media (min-width: 1440px)': '100px',
    },
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.borderSubtle,
    fontFamily: tokens.fontMono,
    lineHeight: 'normal',
  },
  copyright: {
    flex: '1 1 0',
    minWidth: 0,
    color: tokens.textSecondary,
    fontSize: {
      default: '12px',
      '@media (min-width: 900px)': '16px',
    },
  },
  backToTop: {
    flex: '0 0 auto',
    color: tokens.textPrimary,
    fontSize: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    textDecoration: 'none',
  },
});
