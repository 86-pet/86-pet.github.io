const RATE = 3;
let current_page = 1;

const component =
  `<div class="col-lg-4 col-md-6 col-sm-6">
    <div class="product-m">
      <div class="product-m__thumb">

        <a class="aspect aspect--bg-grey aspect--square u-d-block" href="product-detail.html">

          <img class="aspect__img" src={{image}} alt=""></a>
        <div class="product-m__quick-look">

          <a class="fas fa-search" data-modal="modal" data-modal-id="#quick-look" data-tooltip="tooltip" data-placement="top" title="Quick Look"></a></div>
        <div class="product-m__add-cart">

          <a class="btn--e-brand" data-modal="modal" data-modal-id="#add-to-cart">Add to Cart</a>
        </div>
      </div>
      <div class="product-m__content">
        <div class="product-m__category">

          <a href="shop-side-version-2.html">{{categories_name}}</a></div>
        <div class="product-m__name">

          <a href="product-detail.html">{{products_name}}</a></div>
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

  let filter        = {};
  const file        = './data/example.json';

  const limit       = document.getElementById("select-limit-item").value || 20;
  const sortBy      = document.getElementById("select-sort-item").value;

  const priceMin    = document.getElementById("price-min").value;
  const priceMax    = document.getElementById("price-max").value;

  var btn_next      = document.getElementById("btn_next");
  var btn_prev      = document.getElementById("btn_prev");
  var listing_table = document.getElementById("listingTable");
  var page_span     = document.getElementById("page");

  let currentPage   = +page || 1;
  if (limit) { filter.limit = limit };
  if (sortBy) { filter.sortBy = sortBy };

  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {

    if (rawFile.status === 200) {

      const response = rawFile.response;

      let listItem = JSON.parse(response);
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
      .replace('{{countReviewer}}', Math.floor(listItem[i].final_price))
      .replace('{{products_name}}', listItem[i].products_name)
      .replace('{{final_price}}', "$" + listItem[i].final_price)
      .replace('{{categories_name}}', listItem[i].categories_name)
      .replace('{{description}}', description)
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
                              href="product-detail.html">

                              <img class="aspect__img" src="{{image}}"
                                  alt="">
                          </a>
                      </div>

                      <span class="product-o__category">

                          <a href="shop-side-version-2.html">{{categories_name}}</a></span>

                      <span class="product-o__name">

                          <a href="product-detail.html">{{products_name}}</a></span>
                      <div class="product-o__rating gl-rating-style">
                             {{star}}

                          <span class="product-o__review">(0)</span></div>

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
          .replace('{{pre_price}}', "$" + priceOld.fixed(2))

      }
      document.getElementById("show-random-item").innerHTML = html;
      return html;
    }
  }
  rawFile.send(null);
}

