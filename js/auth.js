document.addEventListener('DOMContentLoaded', function() {
    // Basculer entre les onglets de connexion
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Désactiver tous les onglets et formulaires
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Activer l'onglet et le formulaire cible
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
    
    // Gestion de la connexion par email
    const emailForm = document.getElementById('email-login-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simulation de connexion
            if (email && password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                alert('Connexion réussie!');
                
                // Rediriger vers la page précédente ou l'accueil
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
                window.location.href = redirectUrl;
            } else {
                alert('Veuillez remplir tous les champs.');
            }
        });
    }
    
    // Gestion de l'inscription
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }
            
            // Simulation d'inscription
            if (name && email && password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', name);
                alert('Inscription réussie! Vous êtes maintenant connecté.');
                
                // Rediriger vers l'accueil
                window.location.href = 'index.html';
            } else {
                alert('Veuillez remplir tous les champs.');
            }
        });
    }
    
    // Gestion de la connexion par téléphone
    const phoneForm = document.getElementById('phone-login-form');
    if (phoneForm) {
        phoneForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = document.getElementById('phone').value;
            
            // Simulation de connexion par téléphone
            if (phone) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userPhone', phone);
                alert('Code de vérification envoyé! (simulation)');
                
                // Rediriger vers l'accueil
                window.location.href = 'index.html';
            } else {
                alert('Veuillez entrer un numéro de téléphone valide.');
            }
        });
    }
    
    // Connexion avec Google (simulation)
    const googleBtn = document.getElementById('google-login');
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('authMethod', 'google');
            alert('Connexion avec Google réussie! (simulation)');
            window.location.href = 'index.html';
        });
    }
    
    // Connexion avec Facebook (simulation)
    const facebookBtn = document.getElementById('facebook-login');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('authMethod', 'facebook');
            alert('Connexion avec Facebook réussie! (simulation)');
            window.location.href = 'index.html';
        });
    }
    
    // Vérifier si l'utilisateur est déjà connecté
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Afficher le profil au lieu de "Se connecter"
        const loginLinks = document.querySelectorAll('a[href="connexion.html"]');
        loginLinks.forEach(link => {
            link.textContent = 'Mon profil';
            link.href = 'profil.html';
        });
    }
});