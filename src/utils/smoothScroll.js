// Smooth scroll to element with offset for fixed header
export const smoothScrollToElement = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementTop - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

// Add active state to navigation based on scroll position
export const updateActiveNavigation = (items) => {
  const scrollPosition = window.scrollY + 100;

  const current = items.find((item) => {
    const section = document.getElementById(item);
    if (!section) return false;

    const { offsetTop, offsetHeight } = section;
    return scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight;
  });

  return current;
};
