import validate from 'validate.js';

validate.validators.newEventLocation = function (
  value: EventLocation | undefined,
  options: any,
  key: any,
  attributes: any
) {
  if (
    attributes.customLocation === false ||
    attributes.location === undefined
  ) {
    return;
  }

  return validate(value, eventLocationConstraints);
};

validate.validators.updateEventLocation = function (
  value: EventLocation | undefined,
  options: any,
  key: any,
  attributes: any
) {
  return validate(value, eventLocationConstraints);
};

export const eventLocationConstraints = {
  address: {
    presence: true,
  },
  city: {
    presence: true,
  },
  province: {
    presence: true,
    length: {
      is: 2,
    },
  },
  country: {
    presence: true,
  },
  latitude: {
    presence: true,
    numericality: true,
  },
  longitude: {
    presence: true,
    numericality: true,
  },
};

export const newEventConstraints = {
  title: {
    presence: true,
  },
  format: {
    presence: true,
    inclusion: [
      'modern',
      'legacy',
      'standard',
      'pioneer',
      'vintage',
      'commander',
      'pauper',
    ],
  },
  timestamp: {
    presence: true,
  },
  location: {
    newEventLocation: true,
  },
};

export const updateEventConstraints = {
  title: {
    presence: true,
  },
  format: {
    presence: true,
    inclusion: [
      'modern',
      'legacy',
      'standard',
      'pioneer',
      'vintage',
      'commander',
      'pauper',
    ],
  },
  timestamp: {
    presence: true,
  },
  location: {
    updateEventLocation: true,
  },
};

export const updateOrganizerConstraints = {
  facebook: {
    type: 'string',
  },
  whatsapp: {
    type: 'string',
  },
  email: {
    type: 'string',
  },
};
