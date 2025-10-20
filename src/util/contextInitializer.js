export const initializeContext = () => {
  const savedContext = localStorage.getItem('selectedContext') || 'SL';
  document.documentElement.setAttribute('data-context', savedContext);
};