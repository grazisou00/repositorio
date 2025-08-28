// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillBars = document.querySelectorAll('.skill-progress');
const editableElements = document.querySelectorAll('.editable-content');
const contactForm = document.getElementById('contact-form');
const projectsGrid = document.getElementById('projects-grid');

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animate skill bars on scroll
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !bar.classList.contains('animated')) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
            bar.classList.add('animated');
        }
    });
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Scroll event listener
window.addEventListener('scroll', () => {
    animateSkillBars();
    
    // Header background on scroll
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Editable content functionality
editableElements.forEach(element => {
    element.addEventListener('click', () => {
        if (element.classList.contains('editing')) return;
        
        const currentText = element.textContent;
        const field = element.getAttribute('data-field');
        
        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText.startsWith('[') ? '' : currentText;
        input.className = 'edit-input';
        input.style.cssText = `
            width: 100%;
            padding: 0.5rem;
            border: 2px solid #3182ce;
            border-radius: 4px;
            font-family: inherit;
            font-size: inherit;
            background: white;
        `;
        
        element.classList.add('editing');
        element.innerHTML = '';
        element.appendChild(input);
        input.focus();
        
        // Save on Enter or blur
        const saveEdit = () => {
            const newValue = input.value.trim();
            element.classList.remove('editing');
            
            if (newValue) {
                element.textContent = newValue;
                // Save to localStorage
                localStorage.setItem(field, newValue);
            } else {
                element.textContent = currentText;
            }
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    });
});

// Load saved editable content
editableElements.forEach(element => {
    const field = element.getAttribute('data-field');
    const savedValue = localStorage.getItem(field);
    if (savedValue) {
        element.textContent = savedValue;
    }
});

// GitHub Projects Integration
const loadGitHubProjects = async () => {
    try {
        const response = await fetch('https://api.github.com/users/grazisou00/repos?sort=updated&per_page=6');
        const repos = await response.json();
        
        if (Array.isArray(repos)) {
            displayProjects(repos);
        } else {
            displayFallbackProjects();
        }
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        displayFallbackProjects();
    }
};

const displayProjects = (repos) => {
    projectsGrid.innerHTML = '';
    
    repos.forEach(repo => {
        const projectCard = createProjectCard({
            name: repo.name,
            description: repo.description || 'Projeto desenvolvido como parte dos estudos em programação.',
            language: repo.language,
            html_url: repo.html_url,
            homepage: repo.homepage
        });
        projectsGrid.appendChild(projectCard);
    });
};

const displayFallbackProjects = () => {
    const fallbackProjects = [
        {
            name: 'Formato-de-intercambio-de-dados',
            description: 'Projeto focado em formatos de intercâmbio de dados e suas aplicações.',
            language: 'Dart',
            html_url: 'https://github.com/grazisou00/Formato-de-intercambio-de-dados'
        },
        {
            name: 'Biblioteca-digital',
            description: 'Sistema de biblioteca digital desenvolvido para gerenciamento de livros.',
            language: 'Dart',
            html_url: 'https://github.com/grazisou00/Biblioteca-digital'
        },
        {
            name: 'Analise-de-sequencias-de-DNA',
            description: 'Ferramenta para análise de sequências de DNA com algoritmos especializados.',
            language: 'Dart',
            html_url: 'https://github.com/grazisou00/Analise-de-sequencias-de-DNA'
        },
        {
            name: 'API-Nasa',
            description: 'Integração com a API da NASA para exibição de dados espaciais.',
            language: 'JavaScript',
            html_url: 'https://github.com/grazisou00/API-Nasa'
        }
    ];
    
    displayProjects(fallbackProjects);
};

const createProjectCard = (project) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const languageColors = {
        'Python': '#3776ab',
        'JavaScript': '#f7df1e',
        'Dart': '#0175c2',
        'CSS': '#1572b6',
        'HTML': '#e34f26'
    };
    
    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${project.name.replace(/-/g, ' ')}</h3>
            <p class="project-description">${project.description}</p>
        </div>
        ${project.language ? `
        <div class="project-tech">
            <span class="tech-tag" style="background-color: ${languageColors[project.language] || '#6b7280'}20; color: ${languageColors[project.language] || '#6b7280'}">
                ${project.language}
            </span>
        </div>
        ` : ''}
        <div class="project-links">
            <a href="${project.html_url}" target="_blank" class="project-link primary">
                <i class="fab fa-github"></i>
                Código
            </a>
            ${project.homepage ? `
            <a href="${project.homepage}" target="_blank" class="project-link secondary">
                <i class="fas fa-external-link-alt"></i>
                Demo
            </a>
            ` : ''}
        </div>
    `;
    
    return card;
};


// Profile image error handling
const profileImg = document.getElementById('profile-img');
profileImg.addEventListener('error', () => {
    profileImg.src = 'https://via.placeholder.com/200x200/3182ce/ffffff?text=GS';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGitHubProjects();
    
    // Add loading animation to skill bars
    setTimeout(() => {
        animateSkillBars();
    }, 500);
});

// Typing effect for hero title
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.innerHTML = '';
    
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

// Initialize typing effect
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add smooth reveal animations
const revealElements = document.querySelectorAll('.skill-item, .project-card, .stat-item, .detail-item');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(element);
});

