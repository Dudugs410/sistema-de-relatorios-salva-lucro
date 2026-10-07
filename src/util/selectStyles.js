export const selectStyles = {
  container: (base) => ({ ...base, width: '100%' }),
  control: (base, { isFocused, isDisabled }) => ({
    ...base,
    width: '100%',
    minHeight: 42,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    backgroundColor: 'var(--background-color)',
    borderColor: isFocused ? 'var(--highlight-color)' : 'var(--bs-border-color)',
    boxShadow: isFocused ? '0 0 0 1px var(--highlight-color)' : 'none',
    '&:hover': { borderColor: 'var(--highlight-color)' },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    backgroundColor: 'var(--background-color)',
    border: '1px solid var(--bs-border-color)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }),
  menuList: (base) => ({ ...base, padding: '4px 0', backgroundColor: 'var(--background-color)' }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    cursor: 'pointer',
    padding: '8px 12px',
    color: isSelected ? 'var(--on-highlight-color)' : 'var(--font-color)',
    backgroundColor: isSelected
      ? 'var(--highlight-color)'
      : isFocused
        ? 'rgba(var(--highlight-color-rgb), 0.2)'
        : 'transparent',
    '&:active': { color: 'var(--on-highlight-color)', backgroundColor: 'var(--highlight-color)' },
  }),
  valueContainer: (base) => ({ ...base, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--font-color)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
  }),
  input: (base) => ({ ...base, color: 'var(--font-color)' }),
  placeholder: (base) => ({ ...base, color: 'var(--font-color)', opacity: 0.6 }),
  dropdownIndicator: (base) => ({ ...base, color: 'var(--font-color)', '&:hover': { color: 'var(--highlight-color)' } }),
  clearIndicator: (base) => ({ ...base, color: 'var(--font-color)', '&:hover': { color: 'var(--highlight-color)' } }),
  indicatorSeparator: (base) => ({ ...base, backgroundColor: 'var(--bs-border-color)' }),
  noOptionsMessage: (base) => ({ ...base, color: 'var(--font-color)' }),
  loadingMessage: (base) => ({ ...base, color: 'var(--font-color)' }),
}

export const selectTheme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: 'var(--highlight-color)',
    primary75: 'var(--highlight-color)',
    primary50: 'rgba(var(--highlight-color-rgb), 0.5)',
    primary25: 'rgba(var(--highlight-color-rgb), 0.25)',
    neutral0: 'var(--background-color)',
    neutral5: 'var(--background-color)',
    neutral10: 'var(--background-color)',
    neutral20: 'var(--bs-border-color)',
    neutral30: 'var(--bs-border-color)',
    neutral40: 'var(--font-color)',
    neutral50: 'var(--font-color)',
    neutral60: 'var(--font-color)',
    neutral70: 'var(--font-color)',
    neutral80: 'var(--font-color)',
    neutral90: 'var(--font-color)',
  },
})
