const RATE = 3;
let current_page = 1;

const component =
  `<div class="col-lg-4 col-md-6 col-sm-6">
    <div class="product-m">
      <div class="product-m__thumb">

        <a class="aspect aspect--bg-grey aspect--square u-d-block" href="product-detail-variable.html?id={{id_1}}">
          <img class="aspect__img" src={{image}} alt=""></a>
        <div class="product-m__add-cart">

          <a class="btn--e-brand" onclick=addTocart('{{id_product}}')>Add to Cart</a>
        </div>
      </div>
      <div class="product-m__content">
        <div class="product-m__category">

          <a href="shop-side-version-2.html">{{categories_name}}</a></div>
        <div class="product-m__name">

          <a href="product-detail-variable.html?id={{id}}">{{products_name}}</a></div>
        <div class="product-m__rating gl-rating-style">{{star}}

          <span class="product-m__review">({{countReviewer}})</span></div>
        <div class="product-m__price">{{final_price}}</div>
        <div class="product-m__hover">
          <div class="product-m__preview-description">

            <span>{{description}}</span></div>
          <div class="product-m__wishlist">

            <a class="far fa-heart" href="#" data-tooltip="tooltip" data-placement="top" title="Add to Wishlist"></a></div>
        </div>
      </div>
    </div>
  </div>`;

const pagination =
  `<li {{isActive}}>
    <a href="javascript:{{changePage}}">{{page}}</a></li>`;


function getListItem(page) {

  let filter = {};
  const file = './data/example.json';

  const limit = document.getElementById("select-limit-item").value || 20;
  const sortBy = document.getElementById("select-sort-item").value;

  const priceMin = document.getElementById("price-min").value;
  const priceMax = document.getElementById("price-max").value;

  var btn_next = document.getElementById("btn_next");
  var btn_prev = document.getElementById("btn_prev");
  var listing_table = document.getElementById("listingTable");
  var page_span = document.getElementById("page");

  let currentPage = +page || 1;
  if (limit) { filter.limit = limit };
  if (sortBy) { filter.sortBy = sortBy };

  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {

    if (rawFile.status === 200) {

      const response = rawFile.response;
      let listItem = JSON.parse(response);

      const urlParams = new URLSearchParams(window.location.search);

      const searchContent = urlParams.get('search');
      const priceFilter = urlParams.get('price');

      let categoriesFilter = decodeURI(window.location.search);

      if (categoriesFilter.includes('?categories=')) {
        categoriesFilter = categoriesFilter.replace('?categories=', '');
        listItem = filterCategoriesByURL(listItem, categoriesFilter);
      }

      if (searchContent) {
        listItem = filterSearch(listItem, searchContent);
      }

      if (priceFilter) {
        listItem = filterPriceByURL(listItem, priceFilter);
      }


      //      if (listItem.length == 0) {
      //      window.location.href = '404.html';
      //  }
      listItem = sortItem(listItem, filter.sortBy);

      let numPages = Math.floor(listItem.length / limit);

      if (currentPage < 1) currentPage = 1;
      if (currentPage > numPages) currentPage = numPages;

      listing_table.innerHTML = "";
      page_span.innerHTML = currentPage;

      btn_prev.style.visibility = currentPage == 1 ? "hidden" : "visible";

      btn_next.style.visibility = currentPage == numPages ? "hidden" : "visible";

      listItem = listItem.slice(limit * currentPage, (limit * currentPage) + +limit);

      const html = renderByQuery(listItem);
      document.getElementById("get-list-item").innerHTML = html;
    }
  }
  rawFile.send(null);
}

function sortItem(list, filter) {
  switch (filter) {
    case 'lowPrice':
      return list.sort((a, b) => a.final_price - b.final_price);
    case 'highPrice':
      return list.sort((a, b) => b.final_price - a.final_price);
    case 'rating':
    default:
      return list.filter(item => item.rate > RATE);
  }
}

function renderByQuery(listItem) {
  let html = '';
  const star = '<i class="fas fa-star"></i>';
  const start0 = '<i class="far fa-star"></i>';

  for (let i = 0; i < listItem.length; i++) {
    let resStart = '';
    for (let index = 0; index < 5; index++) {
      resStart += index < listItem[i].rate ? star : start0;
    }

    let description = listItem[i].description.substr(0, 150) + '...';
    html += component
      .replace('{{image}}', listItem[i].image_url)
      .replace('{{star}}', resStart)
      .replace('{{countReviewer}}', listItem[i].reviewer)
      .replace('{{products_name}}', listItem[i].products_name)
      .replace('{{final_price}}', "$" + listItem[i].final_price)
      .replace('{{categories_name}}', listItem[i].categories_name)
      .replace('{{description}}', description)
      .replace('{{id}}', listItem[i].products_model)
      .replace('{{id_1}}', listItem[i].products_model)
      .replace('{{id_product}}', listItem[i].products_model)
  }
  return html;
}

function prevPage() {
  if (current_page > 1) {
    current_page--;
    getListItem(current_page);
  }
}

function nextPage() {
  current_page++;
  getListItem(current_page);
}


function randomShowItems() {
  let component = `<div class="u-s-m-b-30">
                    <div class="product-o product-o--hover-on">
                      <div class="product-o__wrap">

                          <a class="aspect aspect--bg-grey aspect--square u-d-block"
                              href="product-detail-variable.html?id={{id}}">

                              <img class="aspect__img" src="{{image}}"
                                  alt="">
                          </a>
                      </div>

                      <span class="product-o__category">

                          <a href="shop-side-version-2.html">{{categories_name}}</a></span>

                      <span class="product-o__name">

                          <a href="product-detail-variable.html?id={{id_1}}">{{products_name}}</a></span>
                      <div class="product-o__rating gl-rating-style">
                             {{star}}

                          <span class="product-o__review">({{reviewer}})</span></div>

                      <span class="product-o__price">{{final_price}}

                          <span class="product-o__discount">{{pre_price}}</span></span>
                    </div>
                  </div>`;

  const file = './data/example.json';
  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {

    if (rawFile.status === 200) {
      let newItems = [];
      let html = '';
      const star = '<i class="fas fa-star"></i>';
      const start0 = '<i class="far fa-star"></i>';
      const response = rawFile.response;

      let listItem = JSON.parse(response);
      for (let i = 0; i < 10; i++) {
        let idx = Math.floor(Math.random() * listItem.length);
        newItems.push(listItem[idx]);
        listItem.splice(idx, 1);
      }
      for (let i = 0; i < newItems.length; i++) {
        let resStart = '';
        for (let index = 0; index < 5; index++) {
          resStart += index < listItem[i].rate ? star : start0;
        }
        let priceOld = '' + (newItems[i].final_price + Math.floor(Math.random() * newItems.length * 2));
        let productName = listItem[i].products_name.substr(0, 50) + '...';
        html += component
          .replace('{{image}}', newItems[i].image_url)
          .replace('{{star}}', resStart)
          .replace('{{products_name}}', productName)
          .replace('{{final_price}}', "$" + newItems[i].final_price)
          .replace('{{categories_name}}', listItem[i].categories_name)
          .replace('{{pre_price}}', "$" + newItems[i].pre_price)
          .replace('{{reviewer}}', newItems[i].reviewer)
          .replace('{{id}}', newItems[i].products_model)
          .replace('{{id_1}}', newItems[i].products_model)
      }
      document.getElementById("show-random-item").innerHTML = html;
      return html;
    }
  }
  rawFile.send(null);
}


function search() {
  //const params = document.getElementById("main-search").value;
  let search = localStorage.getItem('search');
  window.location.href = `shop-side-version-2.html?search=${search}`;
}


function filterSearch(data, search) {
  return data.filter(item =>
    item.products_model.toLowerCase().includes(search.toLowerCase().trim())
    || item.products_name.toLowerCase().includes(search.toLowerCase().trim())
    || item.categories_name.toLowerCase().includes(search.toLowerCase().trim())
  )
}

function filterCategoriesByURL(data, search) {
  return data.filter(item => item.categories_name.toLowerCase().includes(search.toLowerCase().trim())
  )
}

function saveInput() {
  const params = document.getElementById("main-search").value;
  localStorage.setItem('search', params);
}

function filterCategories() {
  let component = `<li class="has-list">
                      <a href="{{link}}">{{categories_name}}</a>
                    </li>`;

  const file = './data/example.json';
  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {

    if (rawFile.status === 200) {
      const response = rawFile.response;

      let listItem = JSON.parse(response);
      let categories = new Set(listItem.map(item => item.categories_name));
      let categoriesValue = Array.from(categories.values());
      let html = '';
      for (let i = 0; i < 5; ++i) {
        html += component.replace('{{link}}', `shop-side-version-2.html?categories=${categoriesValue[i]}`)
          .replace('{{categories_name}}', categoriesValue[i])
      }
      document.getElementById("filter-categories").innerHTML = html;
    }
  }
  rawFile.send(null);
}

function filterPrice() {
  let priceMin = document.getElementById('price-min').value || 1;
  let priceMax = document.getElementById('price-max').value || 9999;
  return window.location.href = `shop-side-version-2.html?price=${priceMin}|${priceMax}`;
}

function filterPriceByURL(data, search) {
  let price = search.split('|');
  return data.filter(item =>
    +item.final_price >= +price[0] && +item.final_price <= +price[1])
}