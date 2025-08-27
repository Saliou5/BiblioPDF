// Vérification de l'authentification
function checkAuth(driveLink, pdfId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'connexion.html';
    } else {
        window.open(driveLink, '_blank');
        // Incrémenter le compteur de vues pour ce PDF
        incrementViewCounter(pdfId);
    }
}

// Incrémenter le compteur de vues pour un PDF spécifique
function incrementViewCounter(pdfId) {
    let pdfViews = JSON.parse(localStorage.getItem('pdfViews')) || {};
    
    if (!pdfViews[pdfId]) {
        pdfViews[pdfId] = 0;
    }
    
    pdfViews[pdfId]++;
    localStorage.setItem('pdfViews', JSON.stringify(pdfViews));
    
    // Mettre à jour l'affichage du compteur pour ce PDF
    updatePdfViewCount(pdfId);
    
    // Mettre à jour le compteur global
    updateGlobalViewCounter();
}

// Mettre à jour l'affichage du compteur pour un PDF spécifique
function updatePdfViewCount(pdfId) {
    const pdfViews = JSON.parse(localStorage.getItem('pdfViews')) || {};
    const viewCountElement = document.getElementById(`view-count-${pdfId}`);
    
    if (viewCountElement) {
        viewCountElement.textContent = pdfViews[pdfId] || 0;
    }
}

// Mettre à jour le compteur global
function updateGlobalViewCounter() {
    const pdfViews = JSON.parse(localStorage.getItem('pdfViews')) || {};
    let totalViews = 0;
    
    for (const pdfId in pdfViews) {
        totalViews += pdfViews[pdfId];
    }
    
    document.querySelector('.counter-number').textContent = totalViews.toLocaleString();
}

// Initialisation des compteurs
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les compteurs pour chaque PDF
    const pdfIds = ['pdf1', 'pdf2', 'pdf3'];
    pdfIds.forEach(pdfId => {
        updatePdfViewCount(pdfId);
    });
    
    // Mettre à jour le compteur global
    updateGlobalViewCounter();
    
    // Gestion des filtres
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Gestion de la soumission du formulaire
    document.querySelector('.request-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Votre demande a été enregistrée. Nous vous contacterons dès que le PDF sera disponible.');
        this.reset();
    });
});
// Dans js/script.js
function checkAuth(driveLink, pdfId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        window.location.href = 'connexion.html';
    } else {
        // Afficher une pub avant la redirection
        showAd().then(() => {
            incrementViewCounter(pdfId);
            window.open(driveLink, '_blank');
        });
    }
}

function showAd() {
    return new Promise((resolve) => {
        // Simuler une publicité
        if (Math.random() > 0.7) { // 30% de chance d'afficher une pub
            const ad = confirm('📢 Supportez-nous en regardant une publicité rapide!\n\nCliquez sur OK pour continuer.');
            if (ad) {
                // Ici intégrer un vrai réseau publicitaire
                setTimeout(resolve, 2000);
            } else {
                resolve();
            }
        } else {
            resolve();
        }
    });
}
