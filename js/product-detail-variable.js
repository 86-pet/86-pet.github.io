function loadComponent(property) {
  const productName = ` <span class="pd-detail__name">{{product_name}}</span></div>`;
  const price = `<span class="pd-detail__price">{{price}}</span>`;
  const image = `<img class="u-img-fluid" src="{{image}}" alt="">`;
  const image1 = `<div class="pd-o-img-wrap" data-src="{{image}}">

                  <img class="u-img-fluid" src="{{image_flush}}"
                      data-zoom-image="{{image_zoom}}" alt="">`;
  const description = `<p>{{description}}</p>`;

  if (window.location.search == "") return window.location.href = "404.html";

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const file = './data/example.json';
  let rawFile = new XMLHttpRequest();

  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.status === 200) {
      const response = rawFile.response;
      let listItem = JSON.parse(response);

      const result = listItem.find(item => item.products_model == id);

      if (!result) return window.location.href = "404.html";

      const html = productName.replace('{{product_name}}', result.products_name);
      const htmlPrice = price.replace('{{price}}', '$' + result.final_price);
      const htmlImage = image.replace('{{image}}', result.image_url);

      const htmlImage1 = image1
        .replace('{{image}}', result.image_url)
        .replace('{{image_flush}}', result.image_url)
        .replace('{{image_zoom}}', result.image_url);
      const htmlDescription = description.replace('{{description}}', result.description);

      document.getElementById('product_name').innerHTML = html;
      document.getElementById('price_item').innerHTML = htmlPrice;
      document.getElementById('image').innerHTML = htmlImage;
      document.getElementById('pd-o-initiate').innerHTML = htmlImage1;
      document.getElementById('description').innerHTML = htmlDescription;
    }
  }
  rawFile.send(null);
}

function addTocart(idx) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = idx || urlParams.get('id');
  let valueInput = idx ? 1 : document.getElementById("add-cart-item").value;
  const currentCart = `<span class="total-item-round">{{current_cart}}</span></a>`;
  const file = './data/example.json';
  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.status === 200) {

      const response = rawFile.response;
      let listItem = JSON.parse(response);

      const result = listItem.find(item => item.products_model == id);
      const convert = mappingData({ ...result, quantity: valueInput });
      let temp1 = localStorage.getItem('cart');
      if (temp1) {
        let temp = JSON.parse(temp1);
        let checkExits = temp.find(item => item.products_model == id);
        if (checkExits) {
          const filerTemp = temp.filter(item => item.products_model !== id);
          checkExits.quantity = Number(checkExits.quantity) + Number(valueInput);
          let data = [...filerTemp, checkExits];
          localStorage.setItem('cart', JSON.stringify(data));
        }
        else {
          localStorage.setItem('cart', JSON.stringify([...temp, convert]));
        }
      }
      else {
        localStorage.setItem('cart', JSON.stringify([convert]))
      }
      loadCart();
    }
  }
  rawFile.send(null);
}


function mappingData(data) {
  return {
    products_model: data.products_model,
    products_name: data.products_name,
    price: data.final_price,
    quantity: data.quantity,
    image: data.image_url,
    categories_name: data.categories_name
  }
}

function cardMiniProduct() {
  let html = '';
  let cartMiniProduct = `<div class="card-mini-product">
                        <div class="mini-product">
                            <div class="mini-product__image-wrapper">

                                <a class="mini-product__link"
                                    href="product-detail-variable.html?id={{id}}">

                                    <img class="u-img-fluid"
                                        src="{{image}}"
                                        alt=""></a></div>
                            <div class="mini-product__info-wrapper">

                                <span class="mini-product__category">

                                    <a
                                        href="shop-side-version-2.html">{{categories_name}}</a></span>

                                <span class="mini-product__name">

                                    <a href="product-detail-variable.html">Yellow Wireless
                                        Headphone</a></span>

                                <span class="mini-product__quantity">{{quantity}} x</span>

                                <span class="mini-product__price">{{price}}</span></div>
                        </div>

                        <a class="mini-product__delete-link far fa-trash-alt" onclick=removeItems('{{products_model_1}}')></a>
                      </div>`;

  let totalPrice = ` <span class="subtotal-text">SUBTOTAL</span>

                      <span class="subtotal-value">{{total_price}}</span></div>`;
  let htmlPrice = '';
  const cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart || !cart.length) {
    document.getElementById('card-mini-product-id').innerHTML = html;
    document.getElementById('cart-total-price-id').innerHTML = htmlPrice;
    return;
  }

  const total_price = cart.map(item => +item.price * +item.quantity).reduce((a, b) => a + b);

  htmlPrice = totalPrice.replace('{{total_price}}', '$' + total_price.toFixed(2));

  for (let item of cart) {
    html += cartMiniProduct.replace('{{id}}', item.products_model)
      .replace('{{image}}', item.image)
      .replace('{{categories_name}}', item.categories_name)
      .replace('{{price}}', '$' + item.price)
      .replace('{{quantity}}', item.quantity)
      .replace('{{products_model_1}}', item.products_model)
  };

  document.getElementById('card-mini-product-id').innerHTML = html;
  document.getElementById('cart-total-price-id').innerHTML = htmlPrice;
}

function removeItems(id) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  const result = cart.filter(item => item.products_model != id);
  localStorage.setItem('cart', JSON.stringify(result));
  loadCart();
  cardMiniProduct();
  //window.location.reload();
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
  cardMiniProduct();
}
