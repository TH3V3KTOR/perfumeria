// script.js
// Datos iniciales de productos
let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [
    {
        id: 1,
        name: "Seducción Nocturna",
        brand: "YANBAL",
        stock: 15,
        normalPrice: 120.00,
        offerPrice: 99.00,
        content: 100,
        description: "Una fragancia intensa con notas de vainilla y ámbar, perfecta para la noche.",
        image: "https://images.unsplash.com/photo-1592945403247-b9c5e0e4b1a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 2,
        name: "Brisa Tropical",
        brand: "ESIKA",
        stock: 8,
        normalPrice: 95.00,
        offerPrice: 79.00,
        content: 80,
        description: "Notas frescas de coco y flor de hibisco para un día soleado.",
        image: "https://images.unsplash.com/photo-1590738900913-82c8c0d76d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 3,
        name: "Far Away Infinity",
        brand: "AVON",
        stock: 22,
        normalPrice: 85.00,
        offerPrice: null,
        content: 75,
        description: "Una fragancia floral con toques de frutas exóticas y maderas preciosas.",
        image: "https://images.unsplash.com/photo-1590738900913-82c8c0d76d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 4,
        name: "Esencia de Oro",
        brand: "YANBAL",
        stock: 5,
        normalPrice: 150.00,
        offerPrice: 129.00,
        content: 120,
        description: "Lujo en una botella con notas de jazmín, rosa y sándalo.",
        image: "https://images.unsplash.com/photo-1592945403247-b9c5e0e4b1a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
];

// Guardar datos iniciales
localStorage.setItem('perfumes', JSON.stringify(perfumes));

// Función para mostrar productos
function displayProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    perfumes.forEach(perfume => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
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
                    <button class="btn-admin">Comprar</button>
                </div>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

// Mostrar productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Login de administrador
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validación simple (admin/admin123)
        if(username === 'admin' && password === 'angie25') {
            // Mostrar modal para agregar perfume
            document.getElementById('addPerfumeModal').style.display = 'flex';
        } else {
            alert('Usuario o contraseña incorrectos. Intente nuevamente.');
        }
    });
    
    // Cerrar modal
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('addPerfumeModal').style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('addPerfumeModal')) {
            document.getElementById('addPerfumeModal').style.display = 'none';
        }
    });
    
    // Previsualización de imagen
    document.getElementById('image').addEventListener('change', function(e) {
        const preview = document.getElementById('image-preview');
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                preview.innerHTML = '<img src="' + e.target.result + '" alt="Previsualización" style="max-width: 200px; margin-top: 10px;">';
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // Agregar nuevo perfume
    document.getElementById('perfumeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const name = document.getElementById('perfumeName').value;
        const brand = document.getElementById('brand').value;
        const stock = parseInt(document.getElementById('stock').value);
        const normalPrice = parseFloat(document.getElementById('normalPrice').value);
        const offerPrice = parseFloat(document.getElementById('offerPrice').value) || null;
        const content = parseInt(document.getElementById('content').value);
        const description = document.getElementById('description').value;
        
        // Manejar la imagen
        let imageUrl = '';
        const imageInput = document.getElementById('image');
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(imageInput.files[0]);
            reader.onload = function() {
                imageUrl = reader.result;
                addPerfume(name, brand, stock, normalPrice, offerPrice, content, imageUrl, description);
            };
        } else {
            // Usar imagen por defecto si no se selecciona
            imageUrl = 'https://via.placeholder.com/300x200?text=Perfume';
            addPerfume(name, brand, stock, normalPrice, offerPrice, content, imageUrl, description);
        }
    });
    
    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Función para agregar perfume
function addPerfume(name, brand, stock, normalPrice, offerPrice, content, imageUrl, description) {
    const newPerfume = {
        id: perfumes.length + 1,
        name,
        brand,
        stock,
        normalPrice,
        offerPrice,
        content,
        image: imageUrl,
        description
    };
    
    perfumes.push(newPerfume);
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    displayProducts();
    
    // Limpiar formulario y cerrar modal
    document.getElementById('perfumeForm').reset();
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('addPerfumeModal').style.display = 'none';
    
    alert(`Perfume "${name}" de la marca ${brand} ha sido agregado exitosamente.`);
}