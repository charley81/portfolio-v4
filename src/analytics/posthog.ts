import posthog from 'posthog-js';
import type {
  ContactLocation,
  FormFailureReason,
  NavigationLocation,
  PortfolioAnalyticsEvent,
} from './events';
import type {
  ContactMethod,
  NavigationDestination,
  ProjectId,
  ResumeLocation,
} from '../content/portfolio';

const navigationDestinations = [
  'capabilities',
  'about',
  'skills',
  'experience',
  'work',
  'contact',
] as const satisfies readonly NavigationDestination[];
const navigationLocations = [
  'desktop_header',
  'mobile_menu',
] as const satisfies readonly NavigationLocation[];
const projectIds = [
  'bassment',
  'marsh_ember',
] as const satisfies readonly ProjectId[];
const resumeLocations = [
  'desktop_header',
  'mobile_menu',
  'masthead',
  'about',
  'contact',
] as const satisfies readonly ResumeLocation[];
const contactMethods = [
  'email',
  'linkedin',
  'github',
] as const satisfies readonly ContactMethod[];
const contactLocations = [
  'masthead',
  'mobile_menu',
  'contact',
] as const satisfies readonly ContactLocation[];
const failureReasons = [
  'network',
  'service',
  'unknown',
] as const satisfies readonly FormFailureReason[];

const isOneOf = <Value extends string>(
  value: string | undefined,
  allowed: readonly Value[],
): value is Value =>
  typeof value === 'string' && allowed.some((candidate) => candidate === value);

const capture = (event: PortfolioAnalyticsEvent) => {
  const { event: eventName, ...properties } = event;
  posthog.capture(eventName, properties);
};

const configureAnalytics = (key: string, host: string) => {
  posthog.init(key, {
    api_host: host,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    capture_exceptions: false,
    disable_compression: true,
    disable_session_recording: true,
    disable_surveys: true,
    disable_web_experiments: true,
    disable_external_dependency_loading: true,
    advanced_disable_decide: true,
    advanced_disable_feature_flags: true,
    advanced_disable_flags: true,
    person_profiles: 'never',
    persistence: 'memory',
    loaded: (client) => client.capture('portfolio_viewed'),
    request_batching: false,
    save_campaign_params: false,
    save_referrer: false,
    before_send: (event) => {
      if (!event?.properties) return event;

      const allowedProperties = new Set([
        '$device_id',
        '$insert_id',
        '$is_identified',
        '$lib',
        '$lib_version',
        '$process_person_profile',
        '$time',
        'destination',
        'distinct_id',
        'location',
        'method',
        'project',
        'reason',
        'token',
      ]);
      const properties = Object.fromEntries(
        Object.entries(event.properties).filter(([property]) =>
          allowedProperties.has(property),
        ),
      );

      return { ...event, properties };
    },
  });

  document.addEventListener('click', (clickEvent) => {
    if (!(clickEvent.target instanceof Element)) return;
    const element = clickEvent.target.closest<HTMLElement>(
      '[data-analytics-event]',
    );
    if (!element) return;

    const eventName = element.dataset.analyticsEvent;

    if (
      eventName === 'portfolio_navigation_clicked' &&
      isOneOf(element.dataset.analyticsDestination, navigationDestinations) &&
      isOneOf(element.dataset.analyticsLocation, navigationLocations)
    ) {
      capture({
        event: eventName,
        destination: element.dataset.analyticsDestination,
        location: element.dataset.analyticsLocation,
      });
    }

    if (
      eventName === 'portfolio_project_opened' &&
      isOneOf(element.dataset.analyticsProject, projectIds)
    ) {
      capture({ event: eventName, project: element.dataset.analyticsProject });
    }

    if (
      eventName === 'portfolio_resume_opened' &&
      isOneOf(element.dataset.analyticsLocation, resumeLocations)
    ) {
      capture({
        event: eventName,
        location: element.dataset.analyticsLocation,
      });
    }

    if (
      eventName === 'portfolio_contact_method_clicked' &&
      isOneOf(element.dataset.analyticsMethod, contactMethods) &&
      isOneOf(element.dataset.analyticsLocation, contactLocations)
    ) {
      capture({
        event: eventName,
        method: element.dataset.analyticsMethod,
        location: element.dataset.analyticsLocation,
      });
    }
  });

  document.addEventListener('portfolio:analytics', (analyticsEvent) => {
    if (
      !(analyticsEvent instanceof CustomEvent) ||
      typeof analyticsEvent.detail !== 'object'
    )
      return;

    const detail = analyticsEvent.detail as {
      event?: unknown;
      reason?: unknown;
    };
    if (detail.event === 'portfolio_contact_form_submitted') {
      capture({ event: detail.event });
    }

    if (
      detail.event === 'portfolio_contact_form_failed' &&
      typeof detail.reason === 'string' &&
      isOneOf(detail.reason, failureReasons)
    ) {
      capture({ event: detail.event, reason: detail.reason });
    }
  });
};

const analyticsRoot = document.querySelector<HTMLElement>(
  '[data-posthog-key][data-posthog-host]',
);
const key = analyticsRoot?.dataset.posthogKey;
const host = analyticsRoot?.dataset.posthogHost;

if (key && host) {
  try {
    configureAnalytics(key, host);
  } catch {
    // Analytics must never interfere with portfolio navigation or contact.
  }
}
