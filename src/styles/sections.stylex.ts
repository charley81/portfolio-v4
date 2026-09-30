import * as stylex from '@stylexjs/stylex';
import { tokens } from './tokens.stylex';

export const sectionStyles = stylex.create({
  content: {
    width: '100%',
  },
  capabilitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: {
      default: '12px',
      '@media (min-width: 900px)': '16px',
    },
    width: '100%',
  },
  capabilityRow: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 900px)': 'row',
    },
    alignItems: {
      default: 'flex-start',
      '@media (min-width: 900px)': 'center',
    },
    gap: {
      default: '12px',
      '@media (min-width: 900px)': '32px',
    },
    width: '100%',
    paddingBlock: {
      default: '16px',
      '@media (min-width: 900px)': '24px',
    },
  },
  rowBorder: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderSubtle,
    paddingBottom: {
      default: '19px',
      '@media (min-width: 900px)': '23px',
    },
  },
  capabilityIndex: {
    flex: '0 0 auto',
    width: {
      default: 'auto',
      '@media (min-width: 900px)': '40px',
    },
    color: tokens.textSecondary,
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: 'normal',
  },
  capabilityTitle: {
    flex: '0 0 auto',
    width: {
      default: '100%',
      '@media (min-width: 900px)': '300px',
    },
    color: tokens.textPrimary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '20px',
      '@media (min-width: 900px)': '24px',
    },
    fontWeight: 700,
    lineHeight: 'normal',
  },
  capabilityDescription: {
    flex: '1 1 0',
    minWidth: 0,
    color: tokens.textSecondary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    fontWeight: 400,
    lineHeight: 1.5,
  },
  aboutContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '24px',
      '@media (min-width: 900px)': '32px',
    },
    width: '100%',
  },
  aboutNarrative: {
    display: 'flex',
    flexDirection: 'column',
    gap: {
      default: '16px',
      '@media (min-width: 900px)': '24px',
    },
    width: '100%',
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
  aboutResume: {
    color: {
      default: tokens.actionPrimary,
      '@media (min-width: 900px)': tokens.textPrimary,
    },
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '14px',
      '@media (min-width: 900px)': '16px',
    },
    fontWeight: 700,
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
  },
  skillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: {
      default: '16px',
      '@media (min-width: 900px)': 0,
    },
    width: '100%',
  },
  skillRow: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 900px)': 'row',
    },
    alignItems: 'flex-start',
    gap: {
      default: '6px',
      '@media (min-width: 900px)': '32px',
    },
    width: '100%',
    height: {
      default: 'auto',
      '@media (min-width: 900px)': '64px',
    },
    paddingBlock: {
      default: 0,
      '@media (min-width: 900px)': '20px',
    },
  },
  skillRowBorder: {
    paddingTop: {
      default: '15px',
      '@media (min-width: 900px)': '20px',
    },
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.borderSubtle,
  },
  skillCategory: {
    flex: '0 0 auto',
    width: {
      default: '100%',
      '@media (min-width: 900px)': '260px',
    },
    color: tokens.textPrimary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '15px',
      '@media (min-width: 900px)': '16px',
    },
    fontWeight: 700,
    lineHeight: {
      default: '18px',
      '@media (min-width: 900px)': '20px',
    },
  },
  skillTools: {
    flex: '1 1 0',
    minWidth: 0,
    width: '100%',
    color: tokens.textSecondary,
    fontFamily: tokens.fontMono,
    fontSize: {
      default: '13px',
      '@media (min-width: 900px)': '16px',
    },
    lineHeight: {
      default: '18px',
      '@media (min-width: 900px)': '24px',
    },
  },
  experienceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: {
      default: '16px',
      '@media (min-width: 900px)': '24px',
    },
    width: '100%',
  },
  experienceItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '8px',
      '@media (min-width: 900px)': '12px',
    },
    width: '100%',
    paddingBottom: {
      default: 0,
      '@media (min-width: 900px)': '24px',
    },
  },
  experienceBorder: {
    paddingBottom: {
      default: '15px',
      '@media (min-width: 900px)': '23px',
    },
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderSubtle,
  },
  experienceTitle: {
    width: '100%',
    color: tokens.textPrimary,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '18px',
      '@media (min-width: 900px)': '24px',
    },
    fontWeight: 700,
    lineHeight: 'normal',
  },
  experienceDescription: {
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
  projects: {
    display: 'flex',
    flexDirection: 'column',
    gap: {
      default: '32px',
      '@media (min-width: 900px)': '40px',
    },
    width: '100%',
  },
  project: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: {
      default: '16px',
      '@media (min-width: 900px)': '32px',
    },
    width: '100%',
  },
  projectCategory: {
    width: '100%',
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
  projectTitleLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    color: tokens.textPrimary,
    textDecoration: 'none',
    transitionProperty: 'color',
    transitionDuration: '160ms',
    ':hover': {
      color: tokens.actionPrimary,
    },
  },
  projectTitle: {
    minWidth: 0,
    color: 'inherit',
    fontFamily: tokens.fontSans,
    fontSize: {
      default: '24px',
      '@media (min-width: 900px)': '40px',
    },
    fontWeight: 700,
    lineHeight: {
      default: '29px',
      '@media (min-width: 900px)': '49px',
    },
  },
  projectArrow: {
    flex: '0 0 auto',
    width: {
      default: '20px',
      '@media (min-width: 900px)': '24px',
    },
    height: {
      default: '20px',
      '@media (min-width: 900px)': '24px',
    },
  },
  projectDescription: {
    width: '100%',
    color: tokens.textPrimary,
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
  projectTechnologies: {
    width: '100%',
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
  projectDivider: {
    width: '100%',
    height: '1px',
    backgroundColor: {
      default: tokens.borderFaint,
      '@media (min-width: 900px)': tokens.borderSubtle,
    },
  },
});
