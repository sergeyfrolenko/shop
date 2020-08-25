let cart = {};
const current = localStorage.getItem('cart');
if (current != null) {
  cart = JSON.parse(localStorage.getItem('cart'));
  ajaxGetGoodsInfo();
} else {
  cart = {};
}
document.querySelectorAll('.add-to-cart').forEach(function (element) {
  element.onclick = addToCart;
});

function addToCart() {
  let goodsId = this.dataset.goods_id; // dataset is object with atribute from html with data-* begin // data-goods_id
  if (cart[goodsId]) {
    cart[goodsId]++;
  }
  else {
    cart[goodsId] = 1;
  }
  ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo() {
  updateLocalStorageCart();
  fetch('/get-goods-info', {
    method: 'POST',
    body: JSON.stringify(cart),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (body) {
      showCart(JSON.parse(body));
    })
}
function showCart(data) {
  let out = '<table><tbody>';
  let total = 0;
  console.log(data);
  for (let key in cart) {
    out += `<tr><td colspan="4"><a href="/goods?id=${key}">${data[key]['name']}</a></tr>`;
    out += `<tr><td><i class="fa fa-minus-square cart-minus" data-goods_id="${key}"></i></td>`;
    out += `<td>${cart[key]}</td>`;
    out += `<td><i class="fa fa-plus-square cart-plus" data-goods_id="${key}"></i></td>`;
    out += `<td>${data[key]['cost'] * cart[key]} $ </td>`
    out += '</tr>';
    total += cart[key] * data[key]['cost'];
  }
  out += `<tr><td colspan="3">Total: </td><td>${total} $</td></tr>`;
  out += '</tbody></table>';
  document.querySelector('#cart-nav').innerHTML = out;
  document.querySelectorAll('.cart-minus').forEach(function (element) {
    element.onclick = cartMinus;
  });
  document.querySelectorAll('.cart-plus').forEach(function (element) {
    element.onclick = cartPlus;
  });
}
function cartPlus() {
  let goodsId = this.dataset.goods_id;
  cart[goodsId]++;
  ajaxGetGoodsInfo();
}

function cartMinus() {
  let goodsId = this.dataset.goods_id;
  if (cart[goodsId] - 1 > 0) {
    cart[goodsId]--;
  }
  else {
    delete (cart[goodsId]);
  }
  ajaxGetGoodsInfo();
}

function updateLocalStorageCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}