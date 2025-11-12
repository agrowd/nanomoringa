const https = require('https');

console.log('🧹 Cleaning up expired carts...');

// URL de la API (ajustar según el entorno)
const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dripcore.vercel.app';

const cleanupExpiredCarts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/cart-sync`, {
      method: 'DELETE'
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Cleanup completed:', data.message);
    } else {
      console.error('❌ Cleanup failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
};

cleanupExpiredCarts();
