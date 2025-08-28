// Données de démonstration pour la recherche
const pdfDocuments = [
    { title: "Introduction à la programmation", category: "Informatique", tags: ["programmation", "débutant"] },
    { title: "Mathématiques avancées", category: "Mathématiques", tags: ["algèbre", "calcul"] },
    { title: "Histoire de l'Afrique", category: "Histoire", tags: ["Afrique", "culture"] },
    { title: "Cours de physique quantique", category: "Physique", tags: ["quantique", "science"] },
    { title: "Géographie du monde", category: "Géographie", tags: ["monde", "cartes"] },
    { title: "Apprendre l'anglais", category: "Langues", tags: ["anglais", "linguistique"] },
    { title: "Economie politique", category: "Economie", tags: ["politique", "économie"] },
    { title: "Biologie cellulaire", category: "Biologie", tags: ["cellule", "science"] },
];

// Catégories disponibles
const categories = [
    "Informatique", "Mathématiques", "Histoire", "Physique", 
    "Chimie", "Biologie", "Géographie", "Economie", "Langues", 
    "Littérature", "Philosophie", "Droit", "Arts"
];

// Initialisation de la recherche
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('search-suggestions');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Remplir les filtres par catégorie
    const filtersContainer = document.getElementById('filters-container');
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = category;
        button.setAttribute('data-category', category);
        filtersContainer.appendChild(button);
    });
    
    // Écouter la saisie dans la barre de recherche
    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        
        if (value.length > 2) {
            // Filtrer les suggestions
            const suggestions = pdfDocuments.filter(doc => 
                doc.title.toLowerCase().includes(value) || 
                doc.tags.some(tag => tag.toLowerCase().includes(value))
            );
            
            // Afficher les suggestions
            showSuggestions(suggestions);
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Gérer les clics sur les filtres
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Basculer la classe active
            this.classList.toggle('active');
            
            // Filtrer les documents (simulation)
            filterDocuments();
        });
    });
    
    // Cacher les suggestions en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    function showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        suggestionsContainer.innerHTML = '';
        suggestions.forEach(doc => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = doc.title;
            item.addEventListener('click', function() {
                searchInput.value = doc.title;
                suggestionsContainer.style.display = 'none';
                // Ici, vous pourriez déclencher la recherche
            });
            suggestionsContainer.appendChild(item);
        });
        
        suggestionsContainer.style.display = 'block';
    }
    
    function filterDocuments() {
        // Récupérer les catégories actives
        const activeCategories = Array.from(document.querySelectorAll('.filter-btn.active'))
            .map(btn => btn.getAttribute('data-category'));
        
        // Filtrer les documents (simulation)
        console.log('Filtrage par catégories:', activeCategories);
        // Ici, vous implémenteriez le filtrage réel des documents affichés
    }
});
// === INTÉGRATION GOOGLE DRIVE === //
const DRIVE_API_KEY = '';
const DRIVE_FOLDER_ID = ';

async function searchDriveFiles(query) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name contains '${query}' and '${DRIVE_FOLDER_ID}' in parents&key=${DRIVE_API_KEY}`
        );
        const data = await response.json();
        return data.files || [];
    } catch (error) {
        console.error('Erreur recherche Drive:', error);
        return [];
    }
}

async function getDriveFileInfo(fileId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,size,webViewLink&key=${DRIVE_API_KEY}`
        );
        return await response.json();
    } catch (error) {
        console.error('Erreur info fichier Drive:', error);
        return null;
    }
}

// Fonction pour combiner les résultats Vercel Blob + Google Drive
async function searchAllFiles(query) {
    try {
        const [blobResults, driveResults] = await Promise.all([
            blobManager.searchFiles(query),
            searchDriveFiles(query)
        ]);

        // Formater les résultats Drive
        const formattedDriveResults = await Promise.all(
            driveResults.map(async (file) => {
                const info = await getDriveFileInfo(file.id);
                return {
                    name: file.name,
                    url: info?.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
                    size: info?.size ? formatFileSize(info.size) : 'Inconnu',
                    type: getFileType(file.name),
                    source: 'google_drive'
                };
            })
        );

        // Combiner les résultats
        return [
            ...blobResults.map(item => ({ ...item, source: 'vercel_blob' })),
            ...formattedDriveResults
        ];
    } catch (error) {
        console.error('Erreur recherche combinée:', error);
        return [];
    }
}

// Fonction utilitaire pour la taille des fichiers
function formatFileSize(bytes) {
    if (!bytes) return 'Inconnu';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const types = {
        'pdf': 'PDF Document', 'jpg': 'Image', 'jpeg': 'Image', 
        'png': 'Image', 'doc': 'Word', 'docx': 'Word', 'txt': 'Text'
    };
    return types[extension] || 'File';
}
