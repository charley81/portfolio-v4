import * as stylex from '@stylexjs/stylex';
import { tokens } from './tokens.stylex';

export const mastheadStyles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  main: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 900px)': 'row',
    },
    alignItems: 'flex-start',
    gap: {
      default: '40px',
      '@media (min-width: 900px)': '48px',
    },
    width: '100%',
  },
  intro: {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '40px',
      '@media (min-width: 900px)': '64px',
    },
    minWidth: 0,
  },
  location: {
    display: 'flex',
    flexDirection: 'column',
    gap: {
      default: '6px',
      '@media (min-width: 900px)': '8px',
    },
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: {
      default: '21px',
      '@media (min-width: 900px)': '24px',
    },
  },
  author: {
    color: tokens.textPrimary,
  },
  secondary: {
    color: tokens.textSecondary,
  },
  mid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    color: tokens.textPrimary,
  },
  heading: {
    color: tokens.textPrimary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '36px',
      '@media (min-width: 900px)': '56px',
    },
    fontWeight: 700,
    lineHeight: {
      default: '41px',
      '@media (min-width: 900px)': '62px',
    },
  },
  description: {
    maxWidth: '100%',
    color: tokens.textPrimary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '15px',
      '@media (min-width: 900px)': '16px',
    },
    fontWeight: 400,
    lineHeight: {
      default: '23px',
      '@media (min-width: 900px)': '26px',
    },
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '24px',
      '@media (min-width: 900px)': '16px',
    },
    width: '100%',
  },
  actionList: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 900px)': 'row',
    },
    alignItems: 'flex-start',
    gap: {
      default: '12px',
      '@media (min-width: 900px)': '24px',
    },
    paddingTop: {
      default: 0,
      '@media (min-width: 900px)': '12px',
    },
    color: {
      default: tokens.actionPrimary,
      '@media (min-width: 900px)': tokens.textPrimary,
    },
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: {
      default: '21px',
      '@media (min-width: 900px)': '24px',
    },
  },
  availability: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    paddingTop: {
      default: 0,
      '@media (min-width: 900px)': '16px',
    },
  },
  statusIcon: {
    flex: '0 0 auto',
    width: {
      default: '10px',
      '@media (min-width: 900px)': '16px',
    },
    height: {
      default: '10px',
      '@media (min-width: 900px)': '16px',
    },
  },
  availabilityText: {
    color: tokens.textSecondary,
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '12px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: {
      default: '18px',
      '@media (min-width: 900px)': '24px',
    },
  },
  sidebar: {
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    alignItems: {
      default: 'flex-start',
      '@media (min-width: 900px)': 'flex-end',
    },
    gap: {
      default: '12px',
      '@media (min-width: 900px)': '16px',
    },
    width: {
      default: '100%',
      '@media (min-width: 900px)': '160px',
    },
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: {
      default: '21px',
      '@media (min-width: 900px)': '24px',
    },
  },
  sidebarLabel: {
    color: tokens.textSecondary,
    textTransform: 'uppercase',
  },
  socialList: {
    display: 'flex',
    flexDirection: {
      default: 'row',
      '@media (min-width: 900px)': 'column',
    },
    flexWrap: 'wrap',
    alignItems: {
      default: 'flex-start',
      '@media (min-width: 900px)': 'flex-end',
    },
    gap: '16px',
    color: tokens.textPrimary,
  },
});
