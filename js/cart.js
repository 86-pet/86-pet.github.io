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

                              <a class="far fa-trash-alt table-p__delete-link" onclick=removeItems('{{products_model_1}}')></a></div>
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
  renderAmount = amountHtml.replace('{{total_amount}}', amount.toFixed(2));
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
  cartDetail();
  window.location.reload();
}

function removeItems(id) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  const result = cart.filter(item => item.products_model != id);
  localStorage.setItem('cart', JSON.stringify(result));
  cartDetail();
}

function removeAllItem() {
  localStorage.removeItem('cart');
  cartDetail();
}