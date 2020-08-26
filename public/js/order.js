document.querySelector('#lite-shop-order').onsubmit = function (event) {
  event.preventDefault();
  let username = document.querySelector('#username').value.trim();
  let phone = document.querySelector('#phone').value.trim();
  let email = document.querySelector('#email').value.trim();
  let address = document.querySelector('#address').value.trim();

  if (!document.querySelector('#rule').checked) {
    //с правилами не согласен
  }

  if (username == '' || phone == '' || email == '' || address == '') {
    //не заполнены поля
  }

  fetch('/finish-order', {
    method: 'POST',
    body: JSON.stringify({
      'username': username,
      // 'phone': phone,
      // 'address': address,
      // 'email': email,
      'key': JSON.parse(localStorage.getItem('cart')) || 'empty'
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (body) {
      if (body == 1) {
        console.log('order is done');
      }
      else {
        console.log('empty cart');
      }
    });
}