class ThemeManager {
    static THEMES = {
        DARK: 'dark-theme',
        LIGHT: 'light-theme'
    };

    static currentTheme = ThemeManager.THEMES.DARK;

    static toggleTheme() {
        const html = document.documentElement;
        if (this.currentTheme === this.THEMES.DARK) {
            html.classList.replace(this.THEMES.DARK, this.THEMES.LIGHT);
            this.currentTheme = this.THEMES.LIGHT;
        } else {
            html.classList.replace(this.THEMES.LIGHT, this.THEMES.DARK);
            this.currentTheme = this.THEMES.DARK;
        }
        return this.currentTheme;
    }
}

class NotificationSystem {
    static notifications = [
        {
            id: 1,
            type: 'success',
            title: 'Deployment Successful',
            message: 'Your latest deployment was completed successfully.',
            time: '2 minutes ago',
            unread: true,
            icon: 'check-circle'
        },
        {
            id: 2,
            type: 'warning',
            title: 'Server Load Alert',
            message: 'Server load is at 92% capacity. Consider optimizing.',
            time: '5 minutes ago',
            unread: true,
            icon: 'exclamation-circle',
            actions: ['View Details', 'Dismiss']
        },
        {
            id: 3,
            type: 'info',
            title: 'New User Registration',
            message: 'Sarah Smith has registered as a new user.',
            time: '10 minutes ago',
            unread: true,
            icon: 'user-plus'
        }
    ];

    static show(message, type = 'success', duration = 3000) {
        if (!this.shouldShowNotification()) return;

        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-circle'}"></i>
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;

        container.appendChild(notification);
        notification.style.animation = 'slideIn 0.3s ease forwards';

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    static shouldShowNotification() {
        const lastAction = localStorage.getItem('lastAction');
        const currentTime = Date.now();
        
        const allowedActions = ['settings', 'markAllRead', 'clearNotifications'];
        return allowedActions.includes(lastAction);
    }

    static init() {
        const notificationList = document.querySelector('.notification-list');
        const notificationTrigger = document.querySelector('.notification-trigger');
        const notificationsDropdown = document.querySelector('.notifications-dropdown');
        const markAllRead = document.querySelector('.action-button.secondary');
        const filterPills = document.querySelectorAll('.filter-pill');
        const filterButtons = document.querySelectorAll('.filter-button');

        this.renderNotifications();

        if (notificationTrigger) {
            notificationTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationsDropdown.classList.toggle('active');
            });
        }

        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                localStorage.setItem('lastAction', 'markAllRead');
                this.notifications.forEach(notif => notif.unread = false);
                this.renderNotifications();
            });
        }

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.renderNotifications(pill.textContent.toLowerCase());
            });
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!notificationsDropdown?.contains(e.target)) {
                notificationsDropdown?.classList.remove('active');
            }
        });
    }

    static renderNotifications(filter = 'all') {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;

        let filteredNotifications = this.notifications;
        if (filter === 'unread') {
            filteredNotifications = this.notifications.filter(n => n.unread);
        } else if (filter === 'important') {
            filteredNotifications = this.notifications.filter(n => n.type === 'warning');
        }

        notificationList.innerHTML = filteredNotifications.map(notification => `
            <div class="notification-item ${notification.unread ? 'unread' : ''}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                    ${notification.actions ? `
                        <div class="notification-actions">
                            ${notification.actions.map(action => `
                                <button class="notification-button ${action.toLowerCase() === 'view details' ? 'view' : 'dismiss'}">
                                    ${action === 'View Details' ? 
                                        '<i class="fas fa-eye"></i> View' : 
                                        '<i class="fas fa-times"></i> Dismiss'}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        const badge = document.querySelector('.notification-badge');
        const unreadCount = this.notifications.filter(n => n.unread).length;
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }

        const notificationItems = notificationList.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const notification = this.notifications.find(n => n.id === id);
                if (notification && notification.unread) {
                    notification.unread = false;
                    this.renderNotifications(filter);
                }
            });
        });
    }
}

class NavigationSystem {
    static init() {
        const navLinks = document.querySelectorAll('.nav-links li');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.switchSection(link.dataset.section, link.dataset.content);
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    static switchSection(section, contentId) {
        document.querySelectorAll('.content-section').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(contentId).classList.add('active');
    }
}

class ChartManager {
    static revenueChartOptions = {
        series: [{
            name: 'Revenue',
            data: [31000, 40000, 28000, 51000, 42000, 109000, 100000]
        }],
        chart: {
            type: 'area',
            height: 300,
            background: 'transparent',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: ['#6d5acd'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100]
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        grid: {
            borderColor: '#1a1d25',
            strokeDashArray: 5
        },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            labels: {
                style: { colors: '#a0a3bd' }
            }
        },
        yaxis: {
            labels: {
                style: { colors: '#a0a3bd' },
                formatter: (value) => `$${value.toLocaleString()}`
            }
        },
        tooltip: { theme: 'dark' }
    };

    static userActivityChartOptions = {
        series: [{
            name: 'New Users',
            data: [44, 55, 57, 56, 61, 58, 63]
        }, {
            name: 'Returning Users',
            data: [76, 85, 101, 98, 87, 105, 91]
        }],
        chart: {
            type: 'bar',
            height: 300,
            background: 'transparent',
            toolbar: { show: false },
            stacked: true
        },
        colors: ['#4361ee', '#6d5acd'],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 5,
                columnWidth: '70%'
            }
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: '#1a1d25',
            strokeDashArray: 5
        },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            labels: {
                style: { colors: '#a0a3bd' }
            }
        },
        yaxis: {
            labels: {
                style: { colors: '#a0a3bd' }
            }
        },
        tooltip: { theme: 'dark' }
    };

    static salesTrendOptions = {
        series: [{
            name: 'Sales',
            data: [4800, 5200, 4900, 6500, 7200, 6800, 7400]
        }],
        chart: {
            type: 'area',
            height: 350,
            background: 'transparent',
            toolbar: { show: false }
        },
        colors: ['#4361ee'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100]
            }
        },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            labels: { style: { colors: '#a0a3bd' } }
        },
        yaxis: {
            labels: {
                style: { colors: '#a0a3bd' },
                formatter: (value) => `$${value}`
            }
        },
        tooltip: { theme: 'dark' }
    };

    static conversionOptions = {
        series: [76, 24],
        chart: {
            type: 'donut',
            height: 350,
            background: 'transparent'
        },
        colors: ['#4361ee', '#6d5acd'],
        labels: ['Converted', 'Not Converted'],
        plotOptions: {
            pie: {
                donut: {
                    size: '75%'
                }
            }
        },
        legend: {
            position: 'bottom',
            labels: { colors: '#a0a3bd' }
        },
        tooltip: { theme: 'dark' }
    };

    static init() {
        const charts = [
            {
                element: "#revenueChart",
                options: this.revenueChartOptions
            },
            {
                element: "#userActivityChart",
                options: this.userActivityChartOptions
            },
            {
                element: "#salesTrendChart",
                options: this.salesTrendOptions
            },
            {
                element: "#conversionChart",
                options: this.conversionOptions
            }
        ];

        charts.forEach(chart => {
            const element = document.querySelector(chart.element);
            if (element) {
                new ApexCharts(element, chart.options).render();
            }
        });
    }
}

class ActivityManager {
    static activities = [
        {
            user: 'John Doe',
            action: 'Created a new project',
            time: '2 minutes ago',
            icon: 'folder-plus',
            color: '#4361ee'
        },
        {
            user: 'Sarah Smith',
            action: 'Uploaded new files',
            time: '5 minutes ago',
            icon: 'upload',
            color: '#6d5acd'
        },
        {
            user: 'Mike Johnson',
            action: 'Completed task: Dashboard UI',
            time: '10 minutes ago',
            icon: 'check-circle',
            color: '#2ed573'
        }
    ];

    static init() {
        const activityList = document.getElementById('activityList');
        if (activityList) {
            this.activities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <div class="activity-icon" style="background: ${activity.color}20; color: ${activity.color}">
                        <i class="fas fa-${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p><strong>${activity.user}</strong> ${activity.action}</p>
                        <span>${activity.time}</span>
                    </div>
                `;
                activityList.appendChild(activityItem);
            });
        }
    }
}

class CounterAnimation {
    static init() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const prefix = counter.hasAttribute('data-prefix') ? counter.getAttribute('data-prefix') : '';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = `${prefix}${Math.ceil(current).toLocaleString()}`;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = `${prefix}${target.toLocaleString()}`;
                }
            };

            updateCounter();
        });
    }
}

class ProfileDropdown {
    static init() {
        const profileTrigger = document.querySelector('.profile-trigger');
        const profileDropdown = document.querySelector('.profile-dropdown');
        
        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });

            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('change', () => {
                    const newTheme = ThemeManager.toggleTheme();
                });
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    NavigationSystem.init();
    ChartManager.init();
    ActivityManager.init();
    CounterAnimation.init();
    ProfileDropdown.init();
    NotificationSystem.init();

    const settingsLink = document.querySelector('.dropdown-menu li:nth-child(2)');
    if (settingsLink) {
        settingsLink.addEventListener('click', () => {
            localStorage.setItem('lastAction', 'settings');
        });
    }
});