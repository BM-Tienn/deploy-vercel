import i18next from 'i18next';

export const filterOptions = {
  number: [
    {
      condition: 'equal',
      label: i18next.t('type_filter.types.equal'),
      value: undefined,
    },
    {
      condition: 'biggerThan',
      label: i18next.t('type_filter.types.bigger_than'),
      value: undefined,
    },
    {
      condition: 'smallerThan',
      label: i18next.t('type_filter.types.smaller_than'),
      value: undefined,
    },
  ],
  string: [
    {
      condition: 'includes',
      label: i18next.t('type_filter.types.includes'),
      value: undefined,
    },
    {
      condition: 'notIncludes',
      label: i18next.t('type_filter.types.not_includes'),
      value: undefined,
    },
  ],
  boolean: [
    {
      condition: 'alike',
      label: i18next.t('type_filter.types.alike'),
      value: true,
    },
    {
      condition: 'notAlike',
      label: i18next.t('type_filter.types.not_alike'),
      value: true,
    },
  ],
  date: [
    {
      condition: 'before',
      label: i18next.t('type_filter.types.before'),
      value: undefined,
    },
    {
      condition: 'after',
      label: i18next.t('type_filter.types.after'),
      value: undefined,
    },
  ],
};
