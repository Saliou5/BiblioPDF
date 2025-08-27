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