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
// === FONCTIONS VERCEL BLOB === //
const BLOB_API_BASE ='1_SONTRbkHQIMVLEEuMFOV6hkAq7wpOCw'

class BlobManager {
    constructor() {
        this.currentFiles = [];
    }

    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${BLOB_API_BASE}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur upload:', error);
            throw error;
        }
    }

    async searchFiles(query = '') {
        try {
            const response = await fetch(`${BLOB_API_BASE}/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            
            const result = await response.json();
            this.currentFiles = result.files || [];
            return this.currentFiles;
        } catch (error) {
            console.error('Erreur recherche:', error);
            throw error;
        }
    }

    async deleteFile(fileUrl) {
        try {
            const response = await fetch(`${BLOB_API_BASE}/delete?url=${encodeURIComponent(fileUrl)}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur suppression:', error);
            throw error;
        }
    }
}

// Initialisation globale
window.blobManager = new BlobManager();

// === FONCTIONNALITÉS EXISTANTES === //
// [Vos fonctions existantes restent ici...]
// Fonctions d'intégration Supabase
async function uploadPDF() {
    const fileInput = document.getElementById('pdf-upload')
    const file = fileInput.files[0]
    
    if (!file) {
        alert('Veuillez sélectionner un fichier PDF')
        return
    }
    
    try {
        const result = await window.supabasePDF.uploadPDF(file, {
            title: document.getElementById('pdf-title')?.value,
            description: document.getElementById('pdf-desc')?.value,
            author: document.getElementById('pdf-author')?.value
        })
        
        alert('PDF uploadé avec succès!')
        loadUserPDFs() // Recharger la liste
        
    } catch (error) {
        alert('Erreur lors de l\'upload: ' + error.message)
    }
}

async function loadUserPDFs() {
    try {
        const pdfs = await window.supabasePDF.getUserPDFs()
        displayPDFs(pdfs)
    } catch (error) {
        console.error('Erreur chargement PDFs:', error)
    }
}

function displayPDFs(pdfs) {
    const container = document.getElementById('pdf-list')
    if (!container) return
    
    container.innerHTML = pdfs.map(pdf => `
        <div class="pdf-item">
            <h4>${pdf.title}</h4>
            <p>Auteur: ${pdf.author || 'Non spécifié'}</p>
            <p>Taille: ${(pdf.file_size / 1024 / 1024).toFixed(2)} MB</p>
            <a href="${pdf.file_url}" target="_blank">Voir le PDF</a>
        </div>
    `).join('')
}

// Recherche de PDFs
async function searchPDFs() {
    const query = document.getElementById('search-input').value
    if (!query) return
    
    try {
        const results = await window.supabasePDF.searchPDFs(query)
        displayPDFs(results)
    } catch (error) {
        console.error('Erreur recherche:', error)
    }
}
