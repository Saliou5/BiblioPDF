// js/generate.js
async function loadPDFs() {
    try {
        const response = await fetch('data/pdfs.json');
        const data = await response.json();
        
        const pdfGrid = document.querySelector('.pdf-grid');
        if (!pdfGrid) return;
        
        pdfGrid.innerHTML = '';
        
        data.pdfs.forEach(pdf => {
            const pdfCard = `
                <div class="pdf-card">
                    <img src="${pdf.image}" alt="${pdf.title}" class="pdf-cover-img" 
                         onerror="this.style.display='none'; document.getElementById('${pdf.id}-placeholder').style.display='flex';">
                    <div id="${pdf.id}-placeholder" class="pdf-cover-placeholder" style="display: none;">
                        PDF COUVERTURE
                    </div>
                    <div class="pdf-info">
                        <h3 class="pdf-title">${pdf.title}</h3>
                        <div class="pdf-meta">
                            <span>${pdf.category}</span>
                            <span>${pdf.size}</span>
                        </div>
                        <div class="pdf-views">
                            <i class="fas fa-eye"></i> <span id="view-count-${pdf.id}">${pdf.views}</span> vues
                        </div>
                        <div class="pdf-actions">
                            <button class="btn btn-download" onclick="window.location.href='help.html'">
                                <i class="fas fa-download"></i> Télécharger
                            </button>
                            <button class="btn btn-view" onclick="checkAuth('${pdf.driveLink}', '${pdf.id}')">
                                <i class="fas fa-eye"></i> Voir
                            </button>
                        </div>
                    </div>
                </div>
            `;
            pdfGrid.innerHTML += pdfCard;
        });
    } catch (error) {
        console.error('Erreur loading PDFs:', error);
    }
}

// Charger au démarrage
document.addEventListener('DOMContentLoaded', loadPDFs);
