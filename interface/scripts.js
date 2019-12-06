//const gateway = 'http://185.251.91.187:3030'
const gateway = 'http://localhost:8000'

const init = () => {
  const output = document.getElementById('output')
  output.innerHTML = '';

  const clear_forms = (forms) => {
    for (let i = 0; i < forms.length; i++) {
        forms[i].style.display = 'none';
    }
  }

  const api_form = document.getElementsByClassName('api_form');
  clear_forms(api_form);

  const navigation_btn = document.getElementsByClassName('navigation_btn');
  for (let i = 0; i < navigation_btn.length; i++) {
      navigation_btn[i].addEventListener("click", function () {
        let btn = event.target.id;
        clear_forms(api_form);
        let form = api_form[btn.substring(0, btn.length - 4)]
        form.getElementsByClassName('form_title')[0].innerHTML = event.target.value;
        let inputs = form.getElementsByClassName('input_text');
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].value = '';
        }
      	form.style.display = 'flex';
        output.innerHTML = '';
      }, false);
  }
  navigation_btn[0].click();


  document.getElementById('get_items').addEventListener('submit', async (event) => {
    event.preventDefault();
    output.innerHTML = '';
    const gatewayFetch = await fetch(gateway + '/api/warehouse/items', { method: 'GET' });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })

  document.getElementById('get_item_by_id').addEventListener('submit', async (event) => {
  	event.preventDefault();
    output.innerHTML = '';
  	const id = event.target['id'].value;
    const gatewayFetch = await fetch(gateway + '/api/warehouse/items/' + id, { method: 'GET' });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })

  document.getElementById('create_item').addEventListener('submit', async (event) => {
    event.preventDefault();
    output.innerHTML = '';
    const name = event.target['name'].value;
    const amount = event.target['amount'].value;
    const price = event.target['price'].value;
    const gatewayFetch = await fetch(gateway + '/api/warehouse/items', {
      method: 'POST',
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify({'name' : name, 'amount' : amount, 'price' : price })
    });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })

  document.getElementById('add_existing_items').addEventListener('submit', async (event) => {
    event.preventDefault();
    output.innerHTML = '';
    const id = event.target['id'].value;
    const amount = event.target['amount'].value;
    const gatewayFetch = await fetch(gateway + '/api/warehouse/items/'+id+'/addition/' + amount, { method: 'PUT' });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })

  document.getElementById('get_orders').addEventListener('submit', async (event) => {
    event.preventDefault();
    output.innerHTML = '';
    const gatewayFetch = await fetch(gateway + '/api/orders', { method: 'GET' });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })

  document.getElementById('get_order_by_id').addEventListener('submit', async (event) => {
    event.preventDefault();
    output.innerHTML = '';
    const id = event.target['id'].value;
    const gatewayFetch = await fetch(gateway + '/api/orders/' + id, { method: 'GET' });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })

  document.getElementById('create_order').addEventListener('submit', async (event) => {
    event.preventDefault();
    output.innerHTML = '';
    const username = event.target['username'].value;
    const gatewayFetch = await fetch(gateway + '/api/orders/' + username, { method: 'POST' });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })

  document.getElementById('add_item_to_order').addEventListener('submit', async (event) => {
    event.preventDefault();
    output.innerHTML = '';
    const order_id = event.target['order_id'].value;
    const item_id = event.target['item_id'].value;
    const amount = event.target['amount'].value;
    const username = event.target['username'].value;
    const gatewayFetch = await fetch(gateway + '/api/orders/' + order_id + '/item', {
      method: 'POST',
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify({'id' : item_id, 'amount' : amount, 'username' : username })
    });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })

  document.getElementById('perform_payment').addEventListener('submit', async (event) => {
    event.preventDefault();
    output.innerHTML = '';
    const id = event.target['id'].value;
    const username = event.target['username'].value;
    const cardAuthorizationInfo = (event.target['auth'].checked === true) ? 'AUTHORIZED' : 'UNAUTHORIZED';
    const gatewayFetch = await fetch(gateway + '/api/orders/' + id + '/payment', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify({ 'username' : username, 'cardAuthorizationInfo' : cardAuthorizationInfo })
    });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })

  document.getElementById('change_order_statust').addEventListener('submit', async (event) => {
    event.preventDefault();
    output.innerHTML = '';
    const id = event.target['id'].value;
    const status = event.target['status'].value;
    const gatewayFetch = await fetch(gateway + '/api/orders/' + id + '/status/' + status, { method: 'PUT' });
    const result = await gatewayFetch.json();
    output.innerHTML = JSON.stringify(result,undefined, 2);
  })
}
