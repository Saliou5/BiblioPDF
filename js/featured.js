// Gestion des PDFs featured/suggestions
class FeaturedPDFs {
    constructor() {
        this.featuredPDFs = []
    }
    
    // Récupérer les PDFs populaires (exemple : les plus récents ou les plus consultés)
    async loadFeaturedPDFs() {
        try {
            // Option 1: Les 6 PDFs les plus récents (tous utilisateurs)
            const { data, error } = await supabase
                .from('pdf_documents')
                .select('*, user_email:users(email)')
                .order('created_at', { ascending: false })
                .limit(6)
            
            if (error) throw error
            
            this.featuredPDFs = data
            this.displayFeaturedPDFs()
            
        } catch (error) {
            console.error('Erreur chargement PDFs featured:', error)
            // Fallback : PDFs exemple
            this.loadFallbackPDFs()
        }
    }
    
    // Fallback si pas de PDFs en base
    loadFallbackPDFs() {
        this.featuredPDFs = [
            {
                id: 1,
                title: "Guide Supabase Débutant",
                author: "Équipe Supabase",
                description: "Apprenez à utiliser Supabase",
                file_url: "#",
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                title: "JavaScript Moderne",
                author: "MDN Web Docs",
                description: "Les nouvelles fonctionnalités JS",
                file_url: "#",
                created_at: new Date().toISOString()
            }
        ]
        this.displayFeaturedPDFs()
    }
    
    // Afficher les PDFs suggestions
    displayFeaturedPDFs() {
        const container = document.getElementById('featured-pdfs')
        if (!container) return
        
        container.innerHTML = this.featuredPDFs.map(pdf => `
            <div class="pdf-card">
                <div class="pdf-title">${this.escapeHtml(pdf.title)}</div>
                <div class="pdf-author">Par ${this.escapeHtml(pdf.author || 'Auteur inconnu')}</div>
                <div class="pdf-description">${this.escapeHtml(pdf.description || 'Aucune description')}</div>
                <div class="pdf-actions">
                    <a href="${pdf.file_url}" target="_blank" class="btn btn-primary">📖 Lire</a>
                    <button onclick="addToFavorites(${pdf.id})" class="btn btn-secondary">⭐ Favoris</button>
                </div>
                <div class="pdf-meta">
                    <small>Ajouté le ${new Date(pdf.created_at).toLocaleDateString('fr-FR')}</small>
                </div>
            </div>
        `).join('')
    }
    
    // Échapper le HTML pour la sécurité
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Gestionnaire de recherche globale
class GlobalSearch {
    constructor() {
        this.init()
    }
    
    init() {
        // Recherche en temps réel
        const searchInput = document.getElementById('global-search')
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.performSearch(searchInput.value)
            }, 300))
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value)
                }
            })
        }
    }
    
    // Anti-rebond pour les recherches
    debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }
    
    // Effectuer la recherche
    async performSearch(query) {
        if (!query.trim()) {
            this.showFeaturedPDFs()
            return
        }
        
        try {
            const { data: { user } } = await supabase.auth.getUser()
            
            let results
            if (user) {
                // Recherche dans les PDFs de l'utilisateur
                results = await this.searchUserPDFs(query, user.id)
            } else {
                // Recherche dans les PDFs publics
                results = await this.searchPublicPDFs(query)
            }
            
            this.displaySearchResults(results, query)
            
        } catch (error) {
            console.error('Erreur recherche:', error)
        }
    }
    
    // Recherche dans les PDFs utilisateur
    async searchUserPDFs(query, userId) {
        const { data, error } = await supabase
            .from('pdf_documents')
            .select('*')
            .eq('user_id', userId)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,author.ilike.%${query}%`)
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    }
    
    // Recherche dans les PDFs publics
    async searchPublicPDFs(query) {
        const { data, error } = await supabase
            .from('pdf_documents')
            .select('*')
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,author.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .limit(20)
        
        if (error) throw error
        return data
    }
    
    // Afficher les résultats de recherche
    displaySearchResults(results, query) {
        const featuredContainer = document.getElementById('featured-pdfs')
        const personalContainer = document.getElementById('user-pdfs')
        
        const html = results.map(pdf => `
            <div class="pdf-card">
                <div class="pdf-title">${this.escapeHtml(pdf.title)}</div>
                <div class="pdf-author">Par ${this.escapeHtml(pdf.author || 'Auteur inconnu')}</div>
                <div class="pdf-description">${this.escapeHtml(pdf.description || 'Aucune description')}</div>
                <div class="pdf-actions">
                    <a href="${pdf.file_url}" target="_blank" class="btn btn-primary">📖 Lire</a>
                </div>
            </div>
        `).join('')
        
        const resultsHTML = `
            <h3>Résultats pour "${query}" (${results.length} trouvés)</h3>
            <div class="pdf-grid">${html}</div>
        `
        
        if (featuredContainer) {
            featuredContainer.innerHTML = resultsHTML
        }
        if (personalContainer) {
            personalContainer.innerHTML = html
        }
    }
    
    // Revenir aux PDFs suggestions
    showFeaturedPDFs() {
        featuredPDFsManager.displayFeaturedPDFs()
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialisation
const featuredPDFsManager = new FeaturedPDFs()
const globalSearchManager = new GlobalSearch()

// Charger les PDFs suggestions au démarrage
document.addEventListener('DOMContentLoaded', function() {
    featuredPDFsManager.loadFeaturedPDFs()
})

// Fonction globale pour la recherche
function globalSearch() {
    const query = document.getElementById('global-search').value
    globalSearchManager.performSearch(query)
}

// Ajouter aux favoris
function addToFavorites(pdfId) {
    alert('Fonctionnalité favoris à implémenter! PDF ID: ' + pdfId)
}
