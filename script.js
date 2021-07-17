const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', searchNewProduct);
function searchNewProduct() {
  const loading =  document.querySelector('.loading');
  loading.style.display ='initial'
  const searchInput = document.querySelector('#search');
  const searchInputValue = searchInput.value;
  console.log(searchInputValue);
  getProductsList(searchInputValue);
  
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function totalPrice() {
  const listItens = document.querySelectorAll('li');
  const prices = [];
  listItens.forEach((itens) => {
    prices.push(Number(itens.innerText.split('$')[1]));
  });
  const total = prices.reduce((acc, curr) => acc + curr, 0);
  const totalValue = document.querySelector('.total-price');
  totalValue.innerText = `Preço total R$ ${total.toFixed(2)}`;
}
function cartItemClickListener(event) {
  const alvo = event.target;
  const listCart = document.querySelector('ol');
  listCart.removeChild(alvo);
  totalPrice();
  localStorage.setItem('product', listCart.innerHTML);
}

function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function addToCart(product) {
  product.addEventListener('click', async () => {
    const id = product.children[0].innerText;
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const element = await response.json();
    const listCart = document.querySelector('ol');
    listCart.appendChild(createCartItemElement(element));
    totalPrice();
    changeItensNumber();
    localStorage.setItem('product', listCart.innerHTML);
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  return e;
}

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
  price: salePrice,
}) {
  const section = document.createElement('section');
  const sectionPriceButton = document.createElement('section');
  sectionPriceButton.classList.add('div-priceButton')
  section.classList.add('item');

  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  sectionPriceButton.appendChild(createCustomElement('span', 'item__price', `Valor R$ ${salePrice.toFixed(2)}`));
  sectionPriceButton.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.appendChild(sectionPriceButton);

  addToCart(section);
  return section;
}

async function getProductsList(word) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${word}`);
  const loading =  document.querySelector('.loading');
  const object = await response.json();
  const {
    results,
  } = object;

  
  const allItens = document.querySelectorAll('.item');
  if(allItens.length > 0) {
    const sectionItens = allItens[0].parentNode;
    allItens.forEach((item) => {
      sectionItens.removeChild(item);
    })
  }

  if(loading) {
    loading.style.display = 'none';
  }
  const section = document.querySelector('.items');

  results.forEach((item) => {
    section.appendChild(createProductItemElement(item));
  });
}

function deliteList() {
  const buttonDelite = document.querySelector('.empty-cart');
  const listCart = document.querySelector('.cart__items');
  const totalValue = document.querySelector('.total-price');
  buttonDelite.addEventListener('click', () => {
    listCart.innerHTML = '';
    totalValue.innerHTML = 'Preço total R$ 0.00';
  localStorage.setItem('product', listCart.innerHTML);
  changeItensNumber();
  
  });
}

function loadLocalStorage() {
  const listCart = document.querySelector('.cart__items');
  listCart.addEventListener('click', (event) => {
    event.target.remove();
    localStorage.setItem('product', listCart.innerHTML);
  });
  listCart.innerHTML = localStorage.getItem('product');
  changeItensNumber();
  totalPrice();
}

function changeItensNumber() {
  const tagPItens = document.querySelector('#word-itens');
  const numberProducts = document.querySelectorAll('.cart__item').length;
  tagPItens.innerHTML = `${numberProducts} iten(s)`;
}

window.onload = function onload() {
  getProductsList('computador');
  loadLocalStorage();
  changeItensNumber();
  deliteList();
};