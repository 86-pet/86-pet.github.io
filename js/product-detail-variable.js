function loadComponent(property) {
  const productName = ` <span class="pd-detail__name">{{product_name}}</span></div>`;
  const price = `<span class="pd-detail__price">{{price}}</span>`;
  const image = `<img class="u-img-fluid" src="{{image}}" alt="">`;
  const image1 = `<div class="pd-o-img-wrap" data-src="{{image}}">

                  <img class="u-img-fluid" src="{{image_flush}}"
                      data-zoom-image="{{image_zoom}}" alt="">`;
  const description = `<p>{{description}}</p>`
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const file = './data/example.json';
  let rawFile = new XMLHttpRequest();

  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    console.log(rawFile.status);
    if (rawFile.status === 200) {
      const response = rawFile.response;
      let listItem = JSON.parse(response);
      // switch (property) {
      //   case 'product_name':
      const result = listItem.find(item => item.products_model == id);
      const html = productName.replace('{{product_name}}', result.products_name);
      const htmlPrice = price.replace('{{price}}', '$' + result.final_price);
      const htmlImage = image.replace('{{image}}', result.image_url);
      const htmlImage1 = image1.replace('{{image}}', result.image_url).replace('{{image_flush}}', result.image_url).replace('{{image_zoom}}', result.image_url);
      const htmlDescription = description.replace('{{description}}', result.description);

      document.getElementById('product_name').innerHTML = html;
      document.getElementById('price_item').innerHTML = htmlPrice;
      document.getElementById('image').innerHTML = htmlImage;
      document.getElementById('pd-o-initiate').innerHTML = htmlImage1;
      document.getElementById('description').innerHTML = htmlDescription;
      //break;
      // default:
      //   break;
      // }
    }
  }
  rawFile.send(null);
}

