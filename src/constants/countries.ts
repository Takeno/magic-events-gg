const countries = ['italia'] as const;

export type Country = typeof countries[number];

export default countries;
