import * as stylex from '@stylexjs/stylex';
import { tokens } from './tokens.stylex';

export const contactStyles = stylex.create({
  content: {
    width: '100%',
  },
  columns: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 900px)': 'row',
    },
    alignItems: 'flex-start',
    gap: {
      default: '40px',
      '@media (min-width: 900px)': '64px',
    },
    width: '100%',
  },
  intro: {
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '16px',
      '@media (min-width: 900px)': '24px',
    },
    width: {
      default: '100%',
      '@media (min-width: 900px)': '560px',
    },
  },
  heading: {
    width: '100%',
    color: tokens.textPrimary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '24px',
      '@media (min-width: 900px)': '40px',
    },
    fontWeight: 700,
    lineHeight: 'normal',
  },
  description: {
    width: '100%',
    color: tokens.textSecondary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: {
      default: '21px',
      '@media (min-width: 900px)': '26px',
    },
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '16px',
      '@media (min-width: 900px)': '24px',
    },
    width: '100%',
    paddingTop: {
      default: 0,
      '@media (min-width: 900px)': '12px',
    },
  },
  emailLink: {
    width: '100%',
    color: tokens.actionPrimary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '18px',
      '@media (min-width: 900px)': '24px',
    },
    fontWeight: 700,
    lineHeight: {
      default: '22px',
      '@media (min-width: 900px)': '29px',
    },
    textDecorationLine: 'underline',
    textUnderlineOffset: '0.15em',
  },
  secondaryLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: {
      default: '16px',
      '@media (min-width: 900px)': '32px',
    },
    width: '100%',
    color: tokens.textPrimary,
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '13px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: {
      default: '19px',
      '@media (min-width: 900px)': '24px',
    },
  },
  form: {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '16px',
      '@media (min-width: 900px)': '24px',
    },
    minWidth: 0,
    width: '100%',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '6px',
      '@media (min-width: 900px)': '8px',
    },
    width: '100%',
  },
  label: {
    color: tokens.textSecondary,
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '13px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: {
      default: '19px',
      '@media (min-width: 900px)': '24px',
    },
  },
  control: {
    width: '100%',
    height: {
      default: '44px',
      '@media (min-width: 900px)': '48px',
    },
    paddingBlock: {
      default: '12px',
      '@media (min-width: 900px)': '14px',
    },
    paddingInline: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: tokens.textSecondary,
    borderRadius: tokens.radiusControl,
    backgroundColor: tokens.surfacePage,
    color: tokens.textPrimary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: 'normal',
    '::placeholder': {
      color: tokens.textSecondary,
      opacity: 1,
    },
  },
  nameControl: {
    borderColor: tokens.borderSubtle,
  },
  textarea: {
    height: {
      default: '100px',
      '@media (min-width: 900px)': '112px',
    },
    lineHeight: {
      default: 1.4,
      '@media (min-width: 900px)': 1.5,
    },
    resize: 'vertical',
  },
  formStatus: {
    width: '100%',
    color: tokens.textPrimary,
    fontFamily: tokens.fontMono,
    fontSize: '14px',
    lineHeight: 1.5,
  },
  formStatusFailure: {
    color: tokens.textPrimary,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.actionPrimary,
    paddingLeft: '12px',
  },
});
