// Function to check if token is expired
function isTokenExpired(token) {
    if (!token) return true;
    
    try {
        // Get the payload part of the JWT
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        
        // Check if the token has expired
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedPayload.exp < currentTime;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
}

// Function to handle login
async function handleLogin(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            alert('Login successful!');
            window.location.href = '/dashboard';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
}

// Check token on page load
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleLogin(email, password);
        });
    } else {
        // For pages that require authentication
        const token = localStorage.getItem('token');
        
        // If token is expired, redirect to login
        if (isTokenExpired(token) && window.location.pathname !== '/login.html') {
            alert('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
    }
});
