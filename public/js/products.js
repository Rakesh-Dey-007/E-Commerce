// Initialize Lucide icons
lucide.createIcons();

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const moonIcon = `<i data-lucide="moon"></i>`;
const sunIcon = `<i data-lucide="sun"></i>`;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
  
  // Refresh Lucide icons after theme change
  lucide.createIcons();
});

function updateThemeIcon(theme) {
  themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
}