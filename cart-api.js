// Global Cart API - attaches functions to window
(function(){
  function getCart(){
    try{ return JSON.parse(localStorage.getItem('cart')||'[]'); }catch(e){ return []; }
  }

  function setCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateCartCount(){
    const cart = getCart();
    const el = document.getElementById('cartCount');
    if(el) el.innerText = `(${cart.length})`;
  }

  function addToCart(id, title, price){
    // allow passing an object as first arg
    let item = null;
    if(typeof id === 'object') item = id;
    else item = { id: id, name: title || id, price: typeof price === 'number' ? price : 0 };

    const cart = getCart();
    const exists = cart.some(i => (typeof i === 'object') ? i.id === item.id : i === item.id);
    if(!exists) cart.push(item);
    setCart(cart);
    updateCartCount();
    if(window.Toast && Toast.success) Toast.success('Toegevoegd', (item.name || item.id) + ' is toegevoegd');
  }

  function removeFromCart(id){
    const cart = getCart();
    const filtered = cart.filter(item => {
      if(typeof item === 'object') return item.id !== id;
      return item !== id;
    });
    setCart(filtered);
    updateCartCount();
    if(window.Toast && Toast.success) Toast.success('Verwijderd', 'Item verwijderd uit winkelwagen');
    return filtered;
  }

  function clearCart(){ setCart([]); updateCartCount(); }

  // expose
  window.getCart = getCart;
  window.setCart = setCart;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.clearCart = clearCart;
  window.updateCartCount = updateCartCount;

  // init on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', updateCartCount);
  } else updateCartCount();

})();
