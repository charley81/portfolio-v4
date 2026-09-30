import * as stylex from '@stylexjs/stylex';
import { tokens } from './tokens.stylex';

export const commonStyles = stylex.create({
  page: {
    width: '100%',
    maxWidth: tokens.pageMax,
    minWidth: '320px',
    marginInline: 'auto',
    overflow: 'clip',
    backgroundColor: tokens.surfacePage,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '32px',
      '@media (min-width: 900px)': '40px',
    },
    paddingBlock: {
      default: '48px',
      '@media (min-width: 900px)': '100px',
    },
    paddingInline: {
      default: '20px',
      '@media (min-width: 600px)': 'clamp(32px, 6.944vw, 100px)',
      '@media (min-width: 1440px)': '100px',
    },
  },
  sectionHeading: {
    color: tokens.textSecondary,
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '16px',
      '@media (min-width: 900px)': '24px',
    },
    fontWeight: 400,
    lineHeight: {
      default: '24px',
      '@media (min-width: 900px)': '36px',
    },
    whiteSpace: 'nowrap',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    textUnderlineOffset: '0.18em',
    transitionProperty:
      'color, text-decoration-color, background-color, border-color',
    transitionDuration: '160ms',
    ':hover': {
      color: tokens.actionPrimary,
    },
  },
  underlineLink: {
    textDecorationLine: 'underline',
    textDecorationColor: tokens.actionPrimary,
    textDecorationThickness: '20%',
  },
  resumeUnderlineLink: {
    textDecorationLine: 'underline',
    textDecorationColor: tokens.resumeUnderline,
    textDecorationThickness: '20%',
  },
  buttonLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
    paddingBlock: '8px',
    paddingInline: '16px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: tokens.borderSubtle,
    borderRadius: tokens.radiusControl,
    color: tokens.textPrimary,
    fontFamily: tokens.fontMono,
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    textDecoration: 'none',
    transitionProperty: 'color, border-color',
    transitionDuration: '160ms',
    ':hover': {
      color: tokens.actionPrimary,
      borderColor: tokens.actionPrimary,
    },
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: {
      default: '48px',
      '@media (min-width: 900px)': '52px',
    },
    paddingBlock: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    paddingInline: {
      default: '16px',
      '@media (min-width: 900px)': '20px',
    },
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: tokens.actionPrimary,
    borderRadius: tokens.radiusControl,
    backgroundColor: tokens.actionPrimary,
    color: tokens.surfacePage,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '15px',
      '@media (min-width: 900px)': '16px',
    },
    fontWeight: 700,
    lineHeight: 'normal',
    transitionProperty: 'background-color, color',
    transitionDuration: '160ms',
    ':hover': {
      backgroundColor: tokens.textPrimary,
      borderColor: tokens.textPrimary,
    },
    ':disabled': {
      cursor: 'wait',
      opacity: 0.7,
    },
  },
  mono: {
    fontFamily: tokens.fontMono,
  },
  sans: {
    fontFamily: tokens.fontSans,
  },
});
