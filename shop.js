// Shop functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cart state
    let cart = [];
    let cartCount = document.getElementById('cartCount');
    let cartItems = document.getElementById('cartItems');
    let cartTotal = document.getElementById('cartTotal');
    let emptyCartMessage = document.getElementById('emptyCartMessage');
    let cartSidebar = document.getElementById('cartSidebar');
    let cartToggle = document.getElementById('cartToggle');
    let closeCart = document.getElementById('closeCart');
    let continueShopping = document.getElementById('continueShopping');
    let checkoutBtn = document.getElementById('checkoutBtn');
    let checkoutModal = document.getElementById('checkoutModal');
    let closeCheckout = document.getElementById('closeCheckout');
    let backToCart = document.getElementById('backToCart');
    let checkoutForm = document.getElementById('checkoutForm');
    let checkoutItems = document.getElementById('checkoutItems');
    let checkoutTotal = document.getElementById('checkoutTotal');
    let confirmationModal = document.getElementById('confirmationModal');
    let continueShoppingBtn = document.getElementById('continueShoppingBtn');

    // Initialize cart from localStorage
    function initCart() {
        const savedCart = localStorage.getItem('diamondDetailzCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('diamondDetailzCart', JSON.stringify(cart));
    }

    // Update cart UI
    function updateCartUI() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image" style="background-image: url('${item.image || 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}')"></div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="decrease-quantity" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners for quantity buttons
            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    decreaseQuantity(index);
                });
            });
            
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    increaseQuantity(index);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeFromCart(index);
                });
            });
        }
        
        // Update cart total
        const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Add to cart
    function addToCart(product, price, quantity = 1) {
        // Check if product already in cart
        const existingItemIndex = cart.findIndex(item => item.name === product);
        
        if (existingItemIndex !== -1) {
            // Update quantity if already in cart
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.push({
                name: product,
                price: price,
                quantity: quantity
            });
        }
        
        saveCart();
        updateCartUI();
        
        // Show cart sidebar
        cartSidebar.classList.add('active');
        
        // Show notification
        showNotification(`${product} added to cart`);
    }

    // Remove from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
    }

    // Increase quantity
    function increaseQuantity(index) {
        cart[index].quantity += 1;
        saveCart();
        updateCartUI();
    }

    // Decrease quantity
    function decreaseQuantity(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            saveCart();
            updateCartUI();
        } else {
            removeFromCart(index);
        }
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1005;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Update checkout summary
    function updateCheckoutSummary() {
        checkoutItems.innerHTML = '';
        
        cart.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            checkoutItem.innerHTML = `
                <span class="checkout-item-name">${item.name} x${item.quantity}</span>
                <span class="checkout-item-price">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
            `;
            checkoutItems.appendChild(checkoutItem);
        });
        
        const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Event listeners
    cartToggle.addEventListener('click', function() {
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });

    continueShopping.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });

    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }
        
        cartSidebar.classList.remove('active');
        updateCheckoutSummary();
        checkoutModal.classList.add('active');
    });

    closeCheckout.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
    });

    backToCart.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
        cartSidebar.classList.add('active');
    });

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real implementation, you would process the payment here
        // For this demo, we'll just show the confirmation
        
        checkoutModal.classList.remove('active');
        confirmationModal.classList.add('active');
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
    });

    continueShoppingBtn.addEventListener('click', function() {
        confirmationModal.classList.remove('active');
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const price = this.getAttribute('data-price');
            const quantityInput = this.closest('.product-actions').querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value);
            
            addToCart(product, price, quantity);
            
            // Reset quantity
            quantityInput.value = 1;
        });
    });

    // Quantity selectors
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            input.value = parseInt(input.value) + 1;
        });
    });

    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
    });

    // Initialize
    initCart();
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});