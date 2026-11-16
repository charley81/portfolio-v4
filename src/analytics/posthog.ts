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
  'stillroom',
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

const commonAllowedProperties = new Set([
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
const webAnalyticsAllowedProperties = new Set([
  '$browser',
  '$browser_version',
  '$current_url',
  '$device',
  '$device_type',
  '$host',
  '$os',
  '$os_version',
  '$pageview_id',
  '$pathname',
  '$prev_pageview_duration',
  '$prev_pageview_id',
  '$prev_pageview_last_content',
  '$prev_pageview_last_content_percentage',
  '$prev_pageview_last_scroll',
  '$prev_pageview_last_scroll_percentage',
  '$prev_pageview_max_content',
  '$prev_pageview_max_content_percentage',
  '$prev_pageview_max_scroll',
  '$prev_pageview_max_scroll_percentage',
  '$prev_pageview_pathname',
  '$referrer',
  '$referring_domain',
  '$screen_height',
  '$screen_width',
  '$session_id',
  '$timezone',
  '$timezone_offset',
  '$viewport_height',
  '$viewport_width',
  '$window_id',
]);
const webAnalyticsEvents = new Set(['$pageview', '$pageleave']);

const sanitizeUrl = (value: unknown) => {
  if (typeof value !== 'string' || value.length === 0) return undefined;

  try {
    const url = new URL(value, window.location.origin);
    return {
      host: url.host,
      origin: url.origin,
      pathname: url.pathname,
      url: `${url.origin}${url.pathname}`,
    };
  } catch {
    return undefined;
  }
};

const sanitizePathname = (value: unknown) => {
  if (typeof value !== 'string' || value.length === 0) return undefined;

  try {
    return new URL(value, window.location.origin).pathname;
  } catch {
    return value.split(/[?#]/, 1)[0] || undefined;
  }
};

const sanitizeProperties = (
  eventName: string,
  eventProperties: Record<string, unknown>,
) => {
  const isWebAnalyticsEvent = webAnalyticsEvents.has(eventName);
  const properties = Object.fromEntries(
    Object.entries(eventProperties).filter(
      ([property]) =>
        commonAllowedProperties.has(property) ||
        (isWebAnalyticsEvent && webAnalyticsAllowedProperties.has(property)),
    ),
  );

  if (!isWebAnalyticsEvent) return properties;

  const currentUrl = sanitizeUrl(properties.$current_url);
  if (currentUrl) {
    properties.$current_url = currentUrl.url;
    properties.$host = currentUrl.host;
    properties.$pathname = currentUrl.pathname;
  } else {
    delete properties.$current_url;
    delete properties.$host;
    delete properties.$pathname;
  }

  const referrer = sanitizeUrl(properties.$referrer);
  if (referrer) {
    properties.$referrer = referrer.origin;
    properties.$referring_domain = referrer.host;
  } else {
    delete properties.$referrer;
    delete properties.$referring_domain;
  }

  const previousPathname = sanitizePathname(properties.$prev_pageview_pathname);
  if (previousPathname) {
    properties.$prev_pageview_pathname = previousPathname;
  } else {
    delete properties.$prev_pageview_pathname;
  }

  return properties;
};

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
    capture_pageview: true,
    capture_pageleave: true,
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
    save_referrer: true,
    before_send: (event) => {
      if (!event?.properties) return event;

      return {
        ...event,
        properties: sanitizeProperties(event.event, event.properties),
      };
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
