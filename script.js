document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Countdown Timer
    function updateCountdown() {
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const diff = midnight - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);

    // Exit Intent Popup
    let popupShown = false;

    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !popupShown) {
            document.getElementById('exitIntentPopup').style.display = 'block';
            popupShown = true;
            startExitCountdown();
        }
    });

    document.querySelector('#exitIntentPopup .close').addEventListener('click', function() {
        closePopupWithEffect();
    });

    document.querySelector('#exitIntentPopup .cta-button').addEventListener('click', function() {
        closePopupWithEffect();
    });

    function startExitCountdown() {
        let timeLeft = 300; // 5 minutes
        const countdownElement = document.getElementById('exitCountdown');

        const countdownInterval = setInterval(function() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                document.getElementById('exitIntentPopup').style.display = 'none';
            }

            timeLeft--;
        }, 1000);
    }

    // Add to Cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const selectedPackageElement = document.getElementById('selectedPackage');
    const orderTotalElement = document.getElementById('orderTotal');
    const stickyOrderSummary = document.getElementById('stickyOrderSummary');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const option = this.closest('.option');
            const bottles = option.dataset.bottles;
            const total = option.querySelector('.total').textContent.split('$')[1];

            selectedPackageElement.textContent = `${bottles} bottle${bottles > 1 ? 's' : ''}`;
            orderTotalElement.textContent = `$${total}`;
            stickyOrderSummary.style.display = 'block';

            // Scroll to next section
            const nextSection = option.closest('section').nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Smooth Scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero, .study-content, .pine-bark-content, .option, .guarantee, .final-cta').forEach(el => {
        observer.observe(el);
    });

    // Add animation classes
    document.querySelectorAll('.hero, .study-content, .pine-bark-content, .option, .guarantee, .final-cta').forEach(el => {
        el.classList.add('fade-in');
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // Purchase Notification
    function showPurchaseNotification() {
        const notification = document.getElementById('purchaseNotification');
        const names = ['John D.', 'Mike S.', 'Robert L.', 'David K.', 'William T.'];
        const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];

        document.getElementById('purchaserName').textContent = randomName;
        document.getElementById('purchaserLocation').textContent = randomLocation;

        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    // Show purchase notification every 30 seconds
    setInterval(showPurchaseNotification, 30000);

    // Parallax effect for sections with 'parallax-section' class
    window.addEventListener('scroll', function() {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        parallaxSections.forEach(section => {
            const distance = window.pageYOffset;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (distance > sectionTop - window.innerHeight && distance < sectionTop + sectionHeight) {
                const speed = section.dataset.speed || 0.5;
                const yPos = (distance - sectionTop) * speed;
                section.style.backgroundPositionY = `${yPos}px`;
            }
        });
    });

    // Animated counter for benefits
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach((card, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        animateValue(card.querySelector('h3'), 0, parseInt(card.dataset.value), 2000);
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(card);
    });

    // Image zoom effect on hover
    const zoomImages = document.querySelectorAll('.zoom-image');
    zoomImages.forEach(img => {
        img.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = img.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        });
    });

    // Função para formatar números menores que 10 adicionando zero à esquerda
    function padNumber(number) {
        return number < 10 ? '0' + number : number;
    }

    // Função para iniciar o countdown
    function startCountdown() {
        // Define o tempo inicial (5 minutos)
        let timeLeft = 5 * 60; // 5 minutos em segundos

        // Atualiza o countdown a cada segundo
        const countdownInterval = setInterval(() => {
            // Calcula horas, minutos e segundos
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;

            // Atualiza os elementos na página
            document.getElementById('hours').textContent = padNumber(hours);
            document.getElementById('minutes').textContent = padNumber(minutes);
            document.getElementById('seconds').textContent = padNumber(seconds);

            // Reduz o tempo restante
            timeLeft--;

            // Se o tempo acabou, para o countdown
            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
            }
        }, 1000);
    }

    // Inicia o countdown quando a página carregar
    document.addEventListener('DOMContentLoaded', startCountdown);

    function closePopupWithEffect() {
        const popup = document.getElementById('exitIntentPopup');
        
        // Adiciona classe para efeito de fade out
        popup.classList.add('fade-out');
        
        // Aguarda a animação terminar antes de esconder o popup
        setTimeout(() => {
            popup.style.display = 'none';
            // Remove a classe para futuras exibições
            popup.classList.remove('fade-out');
        }, 300);
    }

    // Adiciona observer para transições de seção
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('section-transition');
        sectionObserver.observe(section);
    });

    // Efeito parallax suave
    window.addEventListener('scroll', () => {
        const parallaxElements = document.querySelectorAll('.parallax-section');
        parallaxElements.forEach(element => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    });

    function scrollToProducts() {
        const productSection = document.querySelector('.product-options');
        if (productSection) {
            productSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Adicionar evento de clique para o botão CTA
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productSection = document.querySelector('.product-options');
            if (productSection) {
                productSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});