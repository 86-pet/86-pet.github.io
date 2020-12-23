function cartDetail() {
  const component = `<tr>
                      <td>
                          <div class="table-p__box">
                              <div class="table-p__img-wrap">

                                  <img class="u-img-fluid" src="{{image}}" alt=""></div>
                              <div class="table-p__info">

                                  <span class="table-p__name">

                                      <a href="product-detail-variable.html">{{product_name}}</a></span>

                                  <span class="table-p__category">

                                      <a href="shop-side-version-2.html">{{categories_name}}</a></span>
                                  <ul class="table-p__variant-list">  
                                  </ul>
                              </div>
                          </div>
                      </td>
                      <td>

                          <span class="table-p__price">{{price}}</span></td>
                      <td>
                          <div class="table-p__input-counter-wrap">

                              <!--====== Input Counter ======-->
                              <div class="input-counter">

                                  <span class="input-counter__minus fas fa-minus"></span>

                                  <input onchange=changeQuantity(value,'{{products_model}}') class="input-counter__text input-counter--text-primary-style" type="text" value="{{quantity}}" data-min="1" data-max="1000">

                                  <span class="input-counter__plus fas fa-plus"></span></div>
                              <!--====== End - Input Counter ======-->
                          </div>
                      </td>
                      <td>
                          <div class="table-p__del-wrap">

                              <a class="far fa-trash-alt table-p__delete-link" onclick=removeItemsCart('{{products_model_1}}')></a></div>
                      </td>
                    </tr>`;

  const amountHtml = `<td>GRAND TOTAL</td><td >{{total_amount}}</td>`;
  let renderAmount = ``;
  let html = '';
  let cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart || !cart.length) {
    document.getElementById('cart-detail').innerHTML = '';
    document.getElementById('total-amount').innerHTML = '';
    return;
  }

  for (let item of cart) {
    html += component
      .replace('{{product_name}}', item.products_name)
      .replace('{{image}}', item.image)
      .replace('{{categories_name}}', item.categories_name)
      .replace('{{price}}', '$' + (item.price * item.quantity).toFixed(2))
      .replace('{{quantity}}', item.quantity)
      .replace('{{products_model}}', item.products_model)
      .replace('{{products_model_1}}', item.products_model)
  }

  let amount = cart.map(item => item.quantity * item.price).reduce((a, b) => a + b) + 5 + 10; //TAX + SHIPPING
  renderAmount = amountHtml.replace('{{total_amount}}', '$' + amount.toFixed(2));
  document.getElementById('cart-detail').innerHTML = html;
  document.getElementById('total-amount').innerHTML = renderAmount;
  return html;
}

function changeQuantity(value, id) {
  const cart = JSON.parse(localStorage.getItem('cart'));
  for (let item of cart) {
    if (item.products_model == id) {
      item.quantity = value;
    }
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  window.location.reload();
}

function removeItemsCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  const result = cart.filter(item => item.products_model != id);
  localStorage.setItem('cart', JSON.stringify(result));
  loadCart();
  cartDetail();
}

function removeAllItemCart() {
  localStorage.removeItem('cart');
  cartDetail();
  loadCart();
}

function loadCart() {
  let addCart = `<i class="fas fa-shopping-bag">
                  </i>
                  <span class="total-item-round">{{cart}}</span>`;
  let cart = JSON.parse(localStorage.getItem('cart')) || [0];
  if (cart && cart.length == 0) {
    cart.push(0);
  }
  const cartItem = cart.map(item => +item.quantity).reduce((a, b) => a + b);
  let htmlCart = addCart.replace('{{cart}}', cartItem || 0);
  document.getElementById('cart-item').innerHTML = htmlCart;
  // cardMiniProduct();
}

function processCheckout() {
  window.location.href = "checkout.html";
}



function cartCheckout() {
  const component = `<div class="o-card">
                      <div class="o-card__flex">
                          <div class="o-card__img-wrap">

                              <img class="u-img-fluid"
                                  src="{{image}}"></div>
                          <div class="o-card__info-wrap">

                              <span class="o-card__name">

                                  <a href="#">{{product_name}}</a></span>

                              <span class="o-card__quantity">Quantity x {{quantity}}</span>

                              <span class="o-card__price">{{price}}</span></div>
                      </div>
                    </div>`;

  const amountHtml = `<td>GRAND TOTAL</td><td >{{total_amount}}</td>`;
  let renderAmount = ``;
  let html = '';
  let cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart || !cart.length) {
    document.getElementById('cart-checkout').innerHTML = '';
    document.getElementById('total-amount').innerHTML = '';
    return;
  }

  for (let item of cart) {
    html += component
      .replace('{{product_name}}', item.products_name)
      .replace('{{image}}', item.image)
      .replace('{{categories_name}}', item.categories_name)
      .replace('{{price}}', '$' + (item.price * item.quantity).toFixed(2))
      .replace('{{quantity}}', item.quantity)
  }

  let amount = cart.map(item => item.quantity * item.price).reduce((a, b) => a + b) + 5 + 10; //TAX + SHIPPING
  renderAmount = amountHtml.replace('{{total_amount}}', '$' + amount.toFixed(2));
  document.getElementById('cart-checkout').innerHTML = html;
  document.getElementById('total-amount').innerHTML = renderAmount;

  return html;
}