
        document.addEventListener('DOMContentLoaded', () => {
            // --- App State ---
            let loggedInUser = null;

            // --- UI Elements ---
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const allModals = document.querySelectorAll('.modal');
            const closeModalBtns = document.querySelectorAll('.close-modal-btn');
            
            // Auth UI
            const desktopAuthButtons = document.getElementById('desktop-auth-buttons');
            const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
            const desktopProfileIcon = document.getElementById('desktop-profile-icon');
            const mobileProfileIcon = document.getElementById('mobile-profile-icon');
            const profileDropdown = document.getElementById('profile-dropdown');
            const dropdownUserName = document.getElementById('dropdown-user-name');
            const dropdownUserEmail = document.getElementById('dropdown-user-email');
            const signoutBtn = document.getElementById('signout-btn');

            // --- Mobile Menu ---
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    if (!link.classList.contains('login-btn') && !link.classList.contains('signup-btn')) {
                        mobileMenu.classList.add('hidden');
                    }
                });
            });

            // --- Reveal on Scroll ---
            const revealElements = document.querySelectorAll('.reveal');
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            revealElements.forEach(el => revealObserver.observe(el));

            // --- Generic Modal Handler ---
            const openModal = (modal) => {
                if (!modal) return;
                const modalPanel = modal.querySelector('.modal-content');
                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';
                modalPanel.style.transform = 'scale(1)';
            };

            const closeModal = (modal) => {
                if (!modal) return;
                const modalPanel = modal.querySelector('.modal-content');
                modal.style.opacity = '0';
                modalPanel.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    modal.style.pointerEvents = 'none';
                    if (modal.id === 'order-modal') {
                        resetOrderModal();
                    }
                }, 300);
            };

            allModals.forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal(modal);
                });
            });

            closeModalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const modal = btn.closest('.modal');
                    closeModal(modal);
                });
            });


            // --- Order Modal ---
            const orderModal = document.getElementById('order-modal');
            const orderBtns = document.querySelectorAll('.order-btn');
            const modalProductName = document.getElementById('modal-product-name');
            const modalProductPrice = document.getElementById('modal-product-price');
            const modalStep1 = document.getElementById('modal-step-1');
            const modalStep2 = document.getElementById('modal-step-2');
            const modalStep3 = document.getElementById('modal-step-3');
            const completePurchaseBtn = document.getElementById('complete-purchase-btn');
            const addressForm = document.getElementById('address-form');

            const resetOrderModal = () => {
                modalStep1.classList.remove('hidden');
                modalStep2.classList.add('hidden');
                modalStep3.classList.add('hidden');
                addressForm.reset();
            };
            
            orderBtns.forEach(btn => btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const product = button.dataset.product || 'Aura Light Pro'; 
                const price = button.dataset.price || '$149'; 
                
                modalProductName.textContent = product;
                modalProductPrice.textContent = price;
                openModal(orderModal);
            }));

            completePurchaseBtn.addEventListener('click', () => {
                modalStep1.classList.add('hidden');
                modalStep2.classList.remove('hidden');
            });

            addressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                modalStep2.classList.add('hidden');
                modalStep3.classList.remove('hidden');
            });


            // --- Login, Signup & Profile Logic ---
            const loginModal = document.getElementById('login-modal');
            const signupModal = document.getElementById('signup-modal');
            const loginBtns = document.querySelectorAll('.login-btn');
            const signupBtns = document.querySelectorAll('.signup-btn');
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const switchToSignupLinks = document.querySelectorAll('.switch-to-signup-link');
            const switchToLoginLinks = document.querySelectorAll('.switch-to-login-link');

            const getInitials = (name, email) => {
                if (name && name.trim().length > 0) {
                    const parts = name.trim().split(' ');
                    if (parts.length > 1) {
                        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                    }
                    return name.substring(0, 2).toUpperCase();
                }
                return email.substring(0, 2).toUpperCase();
            };

            const updateNavUI = () => {
                if (loggedInUser) {
                    desktopAuthButtons.classList.add('hidden');
                    mobileAuthButtons.classList.add('hidden');
                    
                    const initials = loggedInUser.initials;
                    desktopProfileIcon.textContent = initials;
                    mobileProfileIcon.textContent = initials;
                    
                    desktopProfileIcon.classList.remove('hidden');
                    mobileProfileIcon.classList.remove('hidden');

                    dropdownUserName.textContent = loggedInUser.name || 'Aura Light User';
                    dropdownUserEmail.textContent = loggedInUser.email;

                } else {
                    desktopAuthButtons.classList.remove('hidden');
                    mobileAuthButtons.classList.remove('hidden');
                    desktopProfileIcon.classList.add('hidden');
                    mobileProfileIcon.classList.add('hidden');
                }
            };
            
            loginBtns.forEach(btn => btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(loginModal);
            }));

            signupBtns.forEach(btn => btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(signupModal);
            }));

            switchToSignupLinks.forEach(link => link.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(loginModal);
                openModal(signupModal);
            }));

            switchToLoginLinks.forEach(link => link.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(signupModal);
                openModal(loginModal);
            }));
            
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                loggedInUser = {
                    email: email,
                    initials: getInitials(null, email)
                };
                updateNavUI();
                closeModal(loginModal);
            });

            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                loggedInUser = {
                    name: name,
                    email: email,
                    initials: getInitials(name, email)
                };
                updateNavUI();
                closeModal(signupModal);
            });
            
            // --- Profile Dropdown Handlers ---
            [desktopProfileIcon, mobileProfileIcon].forEach(icon => {
                icon.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevents the window click listener from firing immediately
                    profileDropdown.classList.toggle('hidden');
                    profileDropdown.classList.toggle('visible');
                });
            });
            
            signoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loggedInUser = null;
                updateNavUI();
                profileDropdown.classList.add('hidden');
                profileDropdown.classList.remove('visible');
            });
            
            // Close dropdown if clicked outside
            window.addEventListener('click', (e) => {
                if (!profileDropdown.classList.contains('hidden')) {
                     if (!profileDropdown.contains(e.target) && !desktopProfileIcon.contains(e.target) && !mobileProfileIcon.contains(e.target)) {
                        profileDropdown.classList.add('hidden');
                        profileDropdown.classList.remove('visible');
                     }
                }
            });

            // --- Newsletter Form ---
            const newsletterForm = document.getElementById('newsletter-form');
            const newsletterSection = document.getElementById('newsletter-section').querySelector('.container');
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('name-input');
                const emailInput = document.getElementById('email-input');
                if (emailInput.value && nameInput.value) {
                    newsletterSection.innerHTML = `
                        <div style="text-align: center; opacity: 1; transition: opacity 0.5s;">
                            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--green-500); margin-bottom: 1rem;"></i>
                            <h2 style="font-size: 2.25rem; font-weight: 700; margin: 0 0 1rem 0;">Thank You, ${nameInput.value.split(' ')[0]}!</h2>
                            <p style="color: var(--gray-600);">We've received your message. Look out for updates from Aura Light!</p>
                        </div>
                    `;
                }
            });

            // --- Active Nav on Scroll ---
            const sections = document.querySelectorAll('main section[id]');
            const navLinks = document.querySelectorAll('#desktop-nav a[href^="#"]');
            const navObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => {
                            link.classList.toggle('nav-active', link.getAttribute('href').substring(1) === entry.target.id);
                        });
                    }
                });
            }, { rootMargin: '-50% 0px -50% 0px' });
            sections.forEach(sec => navObserver.observe(sec));
        });
   