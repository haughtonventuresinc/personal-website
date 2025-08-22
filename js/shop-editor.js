// Shop Editor JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const productList = document.getElementById('product-list');
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');
    const modalTitle = document.getElementById('modal-title');
    const cancelProductBtn = document.getElementById('cancel-product');
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    
    // Form elements
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productDescriptionInput = document.getElementById('product-description');
    const productCategoryInput = document.getElementById('product-category');
    const productStockInput = document.getElementById('product-stock');
    const imageTypeRadios = document.querySelectorAll('input[name="image-type"]');
    const imageUrlInput = document.getElementById('image-url-input');
    const svgIconInput = document.getElementById('svg-icon-input');
    const productImageInput = document.getElementById('product-image');
    const productSvgInput = document.getElementById('product-svg');
    const sizeCheckboxes = document.querySelectorAll('input[name="size"]');
    
    let products = [];
    let currentProductId = null;
    
    // Load products from JSON file
    const loadProducts = async () => {
        try {
            const response = await fetch('/shop-data.json');
            products = await response.json();
            renderProductList();
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Failed to load products. Please try again later.');
        }
    };
    
    // Render product list in table
    const renderProductList = () => {
        productList.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.className = 'border-t border-gray-700';
            
            // Create image cell with preview
            const imageCell = document.createElement('td');
            imageCell.className = 'py-3 px-4';
            
            if (product.image) {
                const img = document.createElement('img');
                img.src = product.image;
                img.alt = product.name;
                img.className = 'h-10 w-10 object-contain';
                imageCell.appendChild(img);
            } else if (product.svgIcon) {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'h-10 w-10 flex items-center justify-center';
                iconContainer.innerHTML = product.svgIcon;
                imageCell.appendChild(iconContainer);
            } else {
                imageCell.textContent = 'No image';
            }
            
            // Format price with $ and 2 decimal places
            const formattedPrice = `$${parseFloat(product.price).toFixed(2)}`;
            
            row.innerHTML = `
                <td class="py-3 px-4">${product.id}</td>
                ${imageCell.outerHTML}
                <td class="py-3 px-4">${product.name}</td>
                <td class="py-3 px-4">${formattedPrice}</td>
                <td class="py-3 px-4">${product.category}</td>
                <td class="py-3 px-4">
                    <div class="flex space-x-2">
                        <button class="edit-btn bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm" data-id="${product.id}">Edit</button>
                        <button class="delete-btn bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm" data-id="${product.id}">Delete</button>
                    </div>
                </td>
            `;
            
            productList.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editProduct(btn.getAttribute('data-id')));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => showDeleteConfirmation(btn.getAttribute('data-id')));
        });
    };
    
    // Show product modal for adding new product
    const showAddProductModal = () => {
        modalTitle.textContent = 'Add New Product';
        productForm.reset();
        productIdInput.value = generateProductId();
        imageTypeRadios[0].checked = true;
        toggleImageInputs();
        productModal.classList.remove('hidden');
    };
    
    // Show product modal for editing existing product
    const editProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        modalTitle.textContent = 'Edit Product';
        productIdInput.value = product.id;
        productNameInput.value = product.name;
        productPriceInput.value = product.price;
        productDescriptionInput.value = product.description || '';
        productCategoryInput.value = product.category;
        productStockInput.value = product.inStock.toString();
        
        // Set image type and value
        if (product.svgIcon) {
            imageTypeRadios[1].checked = true;
            productSvgInput.value = product.svgIcon;
        } else {
            imageTypeRadios[0].checked = true;
            productImageInput.value = product.image || '';
        }
        
        toggleImageInputs();
        
        // Set size checkboxes
        sizeCheckboxes.forEach(checkbox => {
            checkbox.checked = product.sizes && product.sizes.includes(checkbox.value);
        });
        
        currentProductId = product.id;
        productModal.classList.remove('hidden');
    };
    
    // Show delete confirmation modal
    const showDeleteConfirmation = (productId) => {
        currentProductId = productId;
        deleteModal.classList.remove('hidden');
    };
    
    // Delete product
    const deleteProduct = () => {
        products = products.filter(product => product.id !== currentProductId);
        saveProducts();
        deleteModal.classList.add('hidden');
        currentProductId = null;
    };
    
    // Toggle between image URL and SVG icon inputs
    const toggleImageInputs = () => {
        const imageType = document.querySelector('input[name="image-type"]:checked').value;
        
        if (imageType === 'image') {
            imageUrlInput.classList.remove('hidden');
            svgIconInput.classList.add('hidden');
        } else {
            imageUrlInput.classList.add('hidden');
            svgIconInput.classList.remove('hidden');
        }
    };
    
    // Generate a unique product ID
    const generateProductId = () => {
        const existingIds = products.map(p => parseInt(p.id));
        const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
        return (maxId + 1).toString();
    };
    
    // Save products to server
    const saveProducts = async () => {
        try {
            // Get authentication token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to save products.');
                window.location.href = '/login.html';
                return;
            }
            
            const response = await fetch('/update-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(products)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save products');
            }
            
            renderProductList();
            alert('Products saved successfully!');
        } catch (error) {
            console.error('Error saving products:', error);
            alert(`Failed to save products: ${error.message}`);
        }
    };
    
    // Event Listeners
    
    // Add product button
    addProductBtn.addEventListener('click', showAddProductModal);
    
    // Cancel product form
    cancelProductBtn.addEventListener('click', () => {
        productModal.classList.add('hidden');
        currentProductId = null;
    });
    
    // Image type toggle
    imageTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleImageInputs);
    });
    
    // Cancel delete
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
        currentProductId = null;
    });
    
    // Confirm delete
    confirmDeleteBtn.addEventListener('click', deleteProduct);
    
    // Product form submission
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get selected sizes
        const selectedSizes = Array.from(sizeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        // Create product object
        const product = {
            id: productIdInput.value,
            name: productNameInput.value,
            price: parseFloat(productPriceInput.value),
            description: productDescriptionInput.value,
            category: productCategoryInput.value,
            inStock: productStockInput.value === 'true',
            sizes: selectedSizes
        };
        
        // Add image or SVG based on selection
        const imageType = document.querySelector('input[name="image-type"]:checked').value;
        if (imageType === 'image') {
            product.image = productImageInput.value;
        } else {
            product.svgIcon = productSvgInput.value;
        }
        
        // Update or add product
        const existingIndex = products.findIndex(p => p.id === product.id);
        if (existingIndex !== -1) {
            products[existingIndex] = product;
        } else {
            products.push(product);
        }
        
        saveProducts();
        productModal.classList.add('hidden');
        currentProductId = null;
    });
    
    // Initialize
    loadProducts();
});
