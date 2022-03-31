export function trackFormat(format: Format) {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'track-format',
    format: format,
  });
}

export function trackEvent(eventId: string, format: Format, organizer: string) {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'track-event',
    eventId,
    format,
    organizer,
  });
}

export function trackEventSubscriptionLink(
  eventId: string,
  format: Format,
  organizer: string
) {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'track-event-subscription-link',
    eventId,
    format,
    organizer,
  });
}
