// Configuration Supabase
const SUPABASE_CONFIG = {
    url: 'https://votre-project-id.supabase.co',
    key: 'votre-anon-key-public'
}

// Initialiser Supabase
const supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key)

// Gestionnaire d'authentification
class AuthManager {
    constructor() {
        this.checkAuthState()
    }
    
    // Vérifier l'état de connexion
    async checkAuthState() {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
            this.onUserSignedIn(user)
        } else {
            this.onUserSignedOut()
        }
    }
    
    // Inscription
    async signUp(email, password, userData) {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: userData,
                emailRedirectTo: 'https://saliou5.github.io/BiblioPDF/'
            }
        })
        
        if (error) throw error
        return data
    }
    
    // Connexion
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        
        if (error) throw error
        return data
    }
    
    // Déconnexion
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }
    
    // Utilisateur connecté
    onUserSignedIn(user) {
        console.log('Utilisateur connecté:', user)
        // Mettre à jour l'interface
        this.updateUIForAuthenticatedUser(user)
    }
    
    onUserSignedOut() {
        console.log('Utilisateur déconnecté')
        // Mettre à jour l'interface
        this.updateUIForAnonymousUser()
    }
    
    updateUIForAuthenticatedUser(user) {
        // Cacher les formulaires de connexion
        const authElements = document.querySelectorAll('.auth-required')
        authElements.forEach(el => el.style.display = 'none')
        
        // Afficher le contenu protégé
        const protectedElements = document.querySelectorAll('.protected-content')
        protectedElements.forEach(el => el.style.display = 'block')
        
        // Afficher le nom d'utilisateur
        const userElements = document.querySelectorAll('.user-name')
        userElements.forEach(el => {
            el.textContent = user.email || 'Utilisateur'
        })
    }
    
    updateUIForAnonymousUser() {
        // Afficher les formulaires de connexion
        const authElements = document.querySelectorAll('.auth-required')
        authElements.forEach(el => el.style.display = 'block')
        
        // Cacher le contenu protégé
        const protectedElements = document.querySelectorAll('.protected-content')
        protectedElements.forEach(el => el.style.display = 'none')
    }
}

// Gestionnaire des PDFs
class PDFManager {
    constructor() {
        this.authManager = new AuthManager()
    }
    
    // Récupérer les PDFs de l'utilisateur
    async getUserPDFs() {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) throw new Error('Utilisateur non connecté')
        
        const { data, error } = await supabase
            .from('pdf_documents')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    }
    
    // Uploader un PDF
    async uploadPDF(file, metadata = {}) {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) throw new Error('Utilisateur non connecté')
        
        // 1. Upload du fichier
        const fileExt = file.name.split('.').pop()
        const fileName = `pdfs/${user.id}/${Date.now()}_${file.name}`
        
        const { data: fileData, error: uploadError } = await supabase.storage
            .from('pdf-files')
            .upload(fileName, file)
        
        if (uploadError) throw uploadError
        
        // 2. Récupérer l'URL publique
        const { data: urlData } = supabase.storage
            .from('pdf-files')
            .getPublicUrl(fileName)
        
        // 3. Enregistrer dans la base de données
        const { data: dbData, error: dbError } = await supabase
            .from('pdf_documents')
            .insert([
                {
                    title: metadata.title || file.name.replace('.pdf', ''),
                    description: metadata.description || '',
                    author: metadata.author || '',
                    file_name: file.name,
                    file_url: urlData.publicUrl,
                    file_size: file.size,
                    user_id: user.id
                }
            ])
            .select()
        
        if (dbError) throw dbError
        return dbData
    }
    
    // Rechercher des PDFs
    async searchPDFs(query) {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) throw new Error('Utilisateur non connecté')
        
        const { data, error } = await supabase
            .from('pdf_documents')
            .select('*')
            .eq('user_id', user.id)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,author.ilike.%${query}%`)
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    }
}

// Initialiser les gestionnaires
const authManager = new AuthManager()
const pdfManager = new PDFManager()

// Exposer aux autres fichiers
window.supabaseAuth = authManager
window.supabasePDF = pdfManager
