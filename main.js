// Función para mostrar productos
function displayProducts(products = null) {
    const perfumesToShow = products || JSON.parse(localStorage.getItem('perfumes')) || [];
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    

    if (perfumesToShow.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No se encontraron perfumes que coincidan con tu búsqueda</p>
            </div>
        `;
        return;
    }

// Verificar si estamos en la página de administración
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    perfumesToShow.forEach(perfume => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Crear enlace de WhatsApp (solo para la página principal)
        const whatsappMessage = `Hola, estoy interesad@ en comprar este perfume: ${perfume.name}`;
        const whatsappLink = `https://wa.me/593967095859?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Determinar qué botones mostrar
        let actionButtonsHTML = '';
        if (isAdminPage) {
            // Solo botones de Editar y Eliminar para admin
            actionButtonsHTML = `
                <div class="admin-actions">
                    <button class="btn-admin edit-btn" data-id="${perfume.id}">Editar</button>
                    <button class="btn-admin delete-btn" data-id="${perfume.id}">Eliminar</button>
                </div>
            `;
        } else {
            // Botón de compra para la página principal
            actionButtonsHTML = `<a href="${whatsappLink}" class="btn-admin" target="_blank">Comprar</a>`;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${perfume.image}" alt="${perfume.name}">
            </div>
            <div class="product-details">
                <div class="product-brand">${perfume.brand}</div>
                <h3 class="product-name">${perfume.name}</h3>
                <p class="product-description">${perfume.description}</p>
                <div class="product-specs">
                    <span>${perfume.content} ml</span>
                    <span class="stock">En stock: ${perfume.stock}</span>
                </div>
                <div class="product-price">
                    <div>
                        ${perfume.offerPrice ? 
                            `<span class="normal-price">S/ ${perfume.normalPrice.toFixed(2)}</span>
                            <div class="offer-price">S/ ${perfume.offerPrice.toFixed(2)}</div>` :
                            `<div class="offer-price">S/ ${perfume.normalPrice.toFixed(2)}</div>`
                        }
                    </div>
                    ${actionButtonsHTML}
                </div>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

// Función para buscar productos
function searchProducts(term) {
    const perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
    if (!term) return perfumes;
    
    return perfumes.filter(perfume => 
        perfume.name.toLowerCase().includes(term.toLowerCase()) ||
        perfume.brand.toLowerCase().includes(term.toLowerCase()) ||
        perfume.description.toLowerCase().includes(term.toLowerCase())
    );
}

// Mostrar productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Buscador
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            const filteredPerfumes = searchProducts(searchTerm);
            displayProducts(filteredPerfumes);
        });
    }

    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') return;
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});


