// Datos de perfumes
let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
let editingId = null;

// Elementos del DOM
const loginSection = document.getElementById('login-section');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logout-btn');
const perfumeForm = document.getElementById('perfumeForm');
const cancelEditBtn = document.getElementById('cancel-edit');
const selectImageBtn = document.getElementById('select-image-btn');
const takePhotoBtn = document.getElementById('take-photo-btn');
const cameraSection = document.getElementById('camera-section');
const cameraView = document.getElementById('camera-view');
const captureBtn = document.getElementById('capture-btn');
const closeCameraBtn = document.getElementById('close-camera-btn');
const cameraCanvas = document.getElementById('camera-canvas');
const imageInput = document.getElementById('image');
let stream = null;

// Abrir selector de archivos al hacer clic en "Seleccionar"
selectImageBtn.addEventListener('click', function() {
    imageInput.click();
});

// Abrir la cámara al hacer clic en "Tomar Foto"
takePhotoBtn.addEventListener('click', function() {
    // Intentar acceder a la cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }) // Usar cámara trasera
            .then(function(mediaStream) {
                stream = mediaStream;
                cameraView.srcObject = stream;
                cameraSection.style.display = 'block';
            })
            .catch(function(error) {
                console.error("Error al acceder a la cámara: ", error);
                alert('No se pudo acceder a la cámara. Asegúrate de permitir el acceso.');
            });
    } else {
        alert('Tu navegador no soporta la funcionalidad de cámara o no tiene acceso a ella.');
    }
});

// Capturar foto
captureBtn.addEventListener('click', function() {
    if (stream) {
        const ctx = cameraCanvas.getContext('2d');
        
        // Ajustar el canvas al tamaño del video
        cameraCanvas.width = cameraView.videoWidth;
        cameraCanvas.height = cameraView.videoHeight;
        
        // Dibujar la imagen actual del video en el canvas
        ctx.drawImage(cameraView, 0, 0, cameraCanvas.width, cameraCanvas.height);
        
        // Detener la transmisión de la cámara
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        
        // Ocultar la sección de la cámara
        cameraSection.style.display = 'none';
        
        // Convertir la imagen del canvas a un blob y luego a un archivo
        cameraCanvas.toBlob(function(blob) {
            // Crear un objeto File a partir del blob
            const file = new File([blob], 'captured-photo.png', { type: 'image/png' });
            
            // Crear un DataTransfer para simular un input de archivo
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            
            // Asignar los archivos al input de imagen
            imageInput.files = dataTransfer.files;
            
            // Disparar el evento change para que se muestre la previsualización
            const event = new Event('change', { bubbles: true });
            imageInput.dispatchEvent(event);
        }, 'image/png');
    }
});

// Cerrar la cámara
closeCameraBtn.addEventListener('click', function() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    cameraSection.style.display = 'none';
});

// Mostrar la sección de administración si ya está logueado
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
    }
    
    // Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('isAdminLoggedIn', 'true');
            showAdminPanel();
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', function() {
        localStorage.setItem('isAdminLoggedIn', 'false');
        window.location.reload();
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
    
    // Enviar formulario de perfume
    perfumeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        savePerfume();
    });
    
    // Cancelar edición
    cancelEditBtn.addEventListener('click', function() {
        resetForm();
    });
    
    // Mostrar productos en el panel de administración
    displayAdminProducts();
    // Buscador en panel de administración
    const adminSearchInput = document.getElementById('admin-search-input');
    if (adminSearchInput) {
        adminSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            const filteredPerfumes = searchProducts(searchTerm);
            displayAdminProducts(filteredPerfumes);
        });
    }
    
});

function showAdminPanel() {
    loginSection.style.display = 'none';
    adminPanel.style.display = 'block';
}

function displayAdminProducts(products = null) {
    const perfumesToShow = products || perfumes;
    const container = document.getElementById('admin-products-container');
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

    perfumesToShow.forEach(perfume => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Crear enlace de WhatsApp
        const whatsappMessage = `Hola, estoy interesad@ en comprar este perfume: ${perfume.name}`;
        const whatsappLink = `https://wa.me/593967095859?text=${encodeURIComponent(whatsappMessage)}`;
        
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
                    <div>
                        <button class="btn-admin edit-btn" data-id="${perfume.id}">Editar</button>
                        <button class="btn-admin delete-btn" data-id="${perfume.id}" style="background-color: #f44336;">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(productCard);
    });
    
    // Asignar eventos a los botones de editar y eliminar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            editPerfume(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deletePerfume(id);
        });
    });
}

function editPerfume(id) {
    const perfume = perfumes.find(p => p.id === id);
    if (!perfume) return;
    
    editingId = id;
    
    // Llenar el formulario con los datos del perfume
    document.getElementById('perfumeId').value = perfume.id;
    document.getElementById('perfumeName').value = perfume.name;
    document.getElementById('brand').value = perfume.brand;
    document.getElementById('stock').value = perfume.stock;
    document.getElementById('normalPrice').value = perfume.normalPrice;
    document.getElementById('offerPrice').value = perfume.offerPrice || '';
    document.getElementById('content').value = perfume.content;
    document.getElementById('description').value = perfume.description;
    
    // Mostrar la imagen actual
    const preview = document.getElementById('image-preview');
    preview.innerHTML = `<img src="${perfume.image}" alt="Previsualización" style="max-width: 200px; margin-top: 10px;">`;
    
    // Mostrar botón de cancelar
    cancelEditBtn.style.display = 'inline-block';
    
    // Desplazarse al formulario de edición
    const editSection = document.getElementById('add-edit-section');
    if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function deletePerfume(id) {
    if (confirm('¿Estás seguro de eliminar este perfume?')) {
        perfumes = perfumes.filter(p => p.id !== id);
        localStorage.setItem('perfumes', JSON.stringify(perfumes));
        displayAdminProducts();
    }
}

function savePerfume() {
    const id = editingId || perfumes.length + 1;
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
            savePerfumeData(id, name, brand, stock, normalPrice, offerPrice, content, imageUrl, description);
        };
    } else {
        // Si no se selecciona nueva imagen, usar la existente o una por defecto
        if (editingId) {
            const existing = perfumes.find(p => p.id === editingId);
            imageUrl = existing ? existing.image : 'https://via.placeholder.com/300x200?text=Perfume';
        } else {
            imageUrl = 'https://via.placeholder.com/300x200?text=Perfume';
        }
        savePerfumeData(id, name, brand, stock, normalPrice, offerPrice, content, imageUrl, description);
    }
}

function savePerfumeData(id, name, brand, stock, normalPrice, offerPrice, content, imageUrl, description) {
    const perfume = {
        id,
        name,
        brand,
        stock,
        normalPrice,
        offerPrice,
        content,
        image: imageUrl,
        description
    };
    
    if (editingId) {
        // Actualizar
        const index = perfumes.findIndex(p => p.id === editingId);
        if (index !== -1) {
            perfumes[index] = perfume;
        }
    } else {
        // Agregar nuevo
        perfumes.push(perfume);
    }
    
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    displayAdminProducts();
    resetForm();
    alert(`Perfume "${name}" guardado exitosamente.`);
}

function resetForm() {
    editingId = null;
    perfumeForm.reset();
    document.getElementById('image-preview').innerHTML = '';
    cancelEditBtn.style.display = 'none';
    document.getElementById('perfumeId').value = '';
}

// Función para buscar productos
function searchProducts(term) {
    if (!term) return perfumes;
    
    return perfumes.filter(perfume => 
        perfume.name.toLowerCase().includes(term.toLowerCase()) ||
        perfume.brand.toLowerCase().includes(term.toLowerCase()) ||
        perfume.description.toLowerCase().includes(term.toLowerCase())
    );
}