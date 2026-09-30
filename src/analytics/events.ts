import type {
  ContactMethod,
  NavigationDestination,
  ProjectId,
  ResumeLocation,
} from '../content/portfolio';

export type NavigationLocation = 'desktop_header' | 'mobile_menu';
export type ContactLocation = 'masthead' | 'mobile_menu' | 'contact';
export type FormFailureReason = 'network' | 'service' | 'unknown';

export type PortfolioAnalyticsEvent =
  | { event: 'portfolio_viewed' }
  | {
      event: 'portfolio_navigation_clicked';
      destination: NavigationDestination;
      location: NavigationLocation;
    }
  | { event: 'portfolio_project_opened'; project: ProjectId }
  | { event: 'portfolio_resume_opened'; location: ResumeLocation }
  | {
      event: 'portfolio_contact_method_clicked';
      method: ContactMethod;
      location: ContactLocation;
    }
  | { event: 'portfolio_contact_form_submitted' }
  | { event: 'portfolio_contact_form_failed'; reason: FormFailureReason };
