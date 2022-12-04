const userData = JSON.parse(localStorage.getItem('currentUser'));
const categorySection = document.querySelector('.category-section');
const categoriesBlock = document.querySelector('.categories-block');
const productsBlock = document.querySelector('.product-block');
const userName = document.querySelector('.user-name');
const userImg = document.querySelector('.img-icon');
const searchBtn = document.querySelector('.search-button');
const searchValue = document.querySelector('.search');
const productsSection = document.querySelector('.products-section')
const productDetail = document.querySelector('.individual-product')
const activeSlide = document.querySelector('.carousel-item')
const productDetailSection = document.querySelector('.productDetailSection')
const updatePopUp = document.querySelector('.modal-window')
const closePopUp = document.querySelector('.close-btn')
const backGround = document.querySelector('.main-container')
const form = document.forms.updateData
const brandElement = form.elements.brand
const categoryElement = form.elements.category
const discountPercentageElement = form.elements.discountPercentage
const priceElement = form.elements.price
const ratingElement = form.elements.rating
const stockElement = form.elements.stock
const titleElement = form.elements.title
const descriptionElement = form.elements.description
const thumbnailElement = form.elements.thumbnail
const imagesElement = form.elements.images
const baseURL = 'https://dummyjson.com/';
const categoriesEndPointURL = 'products/categories';
const productEndPOintURL = 'products?limit=20';
let skipProducts = 0;


userName.innerHTML = userData.firstName + ' ' + userData.lastName
userImg.src = userData.image

// generic function to fetch data
function fetchRequest(endPoint, method = 'GET') {
    const response = fetch(`${baseURL}${endPoint}`, {
        method: method,
        headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
        },
    })
        .then(errorHandling)
        .then(resposne => {
            return resposne
        });
    return response
};
// error handling for fetch requests
function errorHandling(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

// function to get products data
async function getProductsData(endPoint, data) {

    if (!data) {
        data = await fetchRequest(endPoint)
    }
    productsBlock.innerHTML = ''
    data.products.map(product => {
        let html = `<div class="card product border-0 rounded-3 my-3 mx-3" style="width: 265px" id="product${product.id}">
    <button class="btn img-btn" onclick="getProductDetail(${product.id})"><img
      src= ${product.thumbnail}
      class="product-img rounded-top-3"
      alt="not founds"
    /></button>

    <div class="card-body py-0">
      <h5 class="card-title mt-3 text-center ">${product.title.toUpperCase()}</h5>
      <p class="card-text  my-2">
       ${product.description.slice(0, 65)}...
      </p>
      <p class="golden mb-1"
        >${ratingOfProduct(`${product.rating}`)} ${product.rating} stars</p
      >
      <p class="info-para text-end mb-0">Stock (${product.stock})</p>

      <p class="mt-0 mb-1">
        <b>$${product.price}</b>
        <span class="text-decoration-line-through ms-2 info-para">$${Number(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</span>
      </p>
    </div>
    <div class="further-info d-flex justify-content-between py-2">
      
        <h5 class="category-name">Category: <span class="product-category">${product.category}</span></h5>
      
      <button type="button" class="goto" onclick="getProductDetail(${product.id})" >
        <i class="fa-solid fa-arrow-up-right-from-square goto"></i>
      </button>
    </div>
    <div class="product-operation dropdown-toggle ms-2" data-bs-toggle="dropdown">
        <i class="fa-solid fa-ellipsis ms-2 mb-2"></i>
    </div>
        <ul class="dropdown-menu">
          <li onclick="updateProduct( event, '${product.id}')"><a class="dropdown-item">Update</a></li>
          <li onclick="deleteProduct(event, 'product${product.id}')"><a class="dropdown-item">Delete</a></li>
        </ul>
  </div>`
        productsBlock.insertAdjacentHTML("beforeend", html)
    })
    return data
}
getProductsData(productEndPOintURL)

// function to calculate stars for ratting
function ratingOfProduct(rating) {
    let stars = Math.trunc(rating)
    let template = ''
    for (let i = 0; i < stars; i++) {
        let html = `<i class="fa-solid fa-star"></i>`
        template = html + template
    }
    if (rating - stars > 0.5) {
        template = template + `<i class="fa-solid fa-star-half-stroke"></i>`
    } else {
        template = template + `<i class="fa-regular fa-star"></i>`
    }
    return template
}

// function to display categories
async function getCategories() {
    const category = await fetchRequest(categoriesEndPointURL)
    category.map(category => {
        let html = `<div class="dropdown">
        <button class="btn d-block cat-btn py-0" onclick="getProductsByCategory('${category}')"><li class=" text-center py-2  product-list-item dropdown-toggle" data-bs-toggle="dropdown" > 
        ${category[0].toUpperCase()}${category.slice(1, category.length)}
        
        <ul class="dropdown-menu ${category} py-0 listByProduct">

        </ul>
    </li></button>
    </div>`
        categoriesBlock.insertAdjacentHTML('beforeend', html)

    })
}
getCategories()

//  function to display products by category 
async function getProductsByCategory(category) {
    const productByCategoryURL = `products/category/${category}`
    const data = await fetchRequest(productByCategoryURL)
    let template = ''
    data.products.map(((product) => {
        let html = `<li class=" product-list-item product-detail " onclick="getProductDetail(${product.id})"> <a class="py-2 dropdown-item" href="#">${product.title.slice(0, 25)} </a></li>`
        template = html + template
    }))
    document.querySelector(`.${category}`).innerHTML = template
}

// function call to get products on search
searchBtn.addEventListener('click', searchProducts)
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        searchProducts()
    }
})
function searchProducts() {
    const searchEndPointURL = `products/search?q=${searchValue.value}`
    if (searchValue.value.length > 0) {
        categorySection.classList.add('hidden')
        getProductsData(searchEndPointURL)
    } else {
        categorySection.classList.remove('hidden')
        getProductsData(productEndPOintURL)
    }
}

// function to display product detail page 
async function getProductDetail(id) {
    const productDetailURL = `products/${id}`
    const detail = await fetchRequest(productDetailURL)
    productDetailSection.classList.remove('hidden')
    productsSection.classList.add('hidden')
    categorySection.classList.add('hidden')
    productDetail.innerHTML = ''
    let html = ` <div class="d-flex  product-detail-card col-md-9 col-sm-8 col-8 px-0 ">
                    <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                        ${imgsOfProduct(detail.images)}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div class="px-3 pt-3 ">
                        <h3 class="text-center detail-product-title">${detail.title}</h3>
                        <p class="detail-product-description">${detail.description}</p>
                        <p class="golden mb-1">${ratingOfProduct(`${detail.rating}`)} ${detail.rating} stars</p>
                        <p class="info-para me-2 text-end mb-0">Stock (${detail.stock})</p>
                        <div class="d-flex justify-content-between">
                        <p class="mt-0 mb-1">
                            <b>$${detail.price}</b>
                            <span class="text-decoration-line-through ms-2 info-para">$${Number(detail.price / (1 - detail.discountPercentage / 100)).toFixed(2)}</span>
                        </p>
                        <div class="d-flex mt-2 me-2">
                            <i class="fa-solid fa-plus pt-1 me-2"></i>
                            <p>Qauntity </p>
                            <i class="fa-solid fa-minus pt-1 ms-2"></i>
                        </div>
                    </div>
   
                    <div class="further-info d-flex justify-content-between py-4 px-0">
                        <h5 class="category-name">Category: <span class="product-category">${detail.category}</span></h5>
                        <div class="d-flex product-detail-btn">
                        <button class="btn btn-success px-2 py-2 mb-2 text-white me-3"><i class="fa-solid fa-cart-plus me-2"></i> Add to cart</button>
                        <button class="btn btn-light px-3 py-2 mb-2 text-dark" onclick="goToMainPage()">Back to Main</button>
                    </div>
                </div>
            </div>
        </div>`
    productDetail.insertAdjacentHTML('beforeend', html)
    document.documentElement.scrollTop = 200
    return detail
}

// function to display carousel for product details
function imgsOfProduct(imgs) {
    let template = ''
    imgs.map((img, i) => {
        let html = `<div class="carousel-item ${i == 0 ? 'active' : ''}">
        <img src=${img} class="d-block slide-img" alt="not found">
    </div>`
        template = html + template
    })
    return template
}

// function will set the main page
function goToMainPage() {
    productDetailSection.classList.add('hidden')
    productsSection.classList.remove('hidden')
    categorySection.classList.remove('hidden')
}

// function to delete the product plus api for DELETE method
function deleteProduct(e, id) {
    fetchRequest(`products/${id.slice(7, id.length)}`)
    document.querySelector(`#${id}`).remove()
}
// function to close pop up window and remove blur from background
const closeModal = function () {
    updatePopUp.classList.add("hidden")
    backGround.classList.remove("blur")
}
// function to close pop up window and remove blur from background on escape key press
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !updatePopUp.classList.contains('hidden')) {
        closeModal()
    }
})
closePopUp.addEventListener('click', closeModal)

// function to display pop up window with product data to be updated
async function updateProduct(e, id) {
    const productUpdateURL = `products/${id}`
    const data = await fetchRequest(productUpdateURL)
    localStorage.setItem('UpdatedProductID', id)
    updatePopUp.classList.remove("hidden")
    backGround.classList.add("blur")

    brandElement.value = data.brand
    categoryElement.value = data.category
    discountPercentageElement.value = data.discountPercentage
    priceElement.value = data.price
    stockElement.value = data.stock
    ratingElement.value = data.rating
    titleElement.value = data.title
    descriptionElement.value = data.description
    thumbnailElement.fileName = data.thumbnail
    console.log(discountPercentageElement.value)
}

// function to  display updated data  
async function saveData(e) {
    e.preventDefault()
    let updatedProductData = savePopUpData()
    closeModal()
    if (updatedProductData.title.length > 0) {
        let data = await fetchRequest('products?limit=100')
        let id = localStorage.getItem('UpdatedProductID')
        let index = data.products.findIndex(prod => {
            return prod.id == id
        })
        await fetch(`https://dummyjson.com/products/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${userData.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProductData)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
            });
        data.products.splice(index, 1, updatedProductData)
        getProductsData(productEndPOintURL, data)
    }
}

// to save Image data locally 
thumbnailElement.addEventListener('change', function () {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
        let img = reader.result
        localStorage.setItem(`thumbnail`, JSON.stringify(img))
    })
    reader.readAsDataURL(this.files[0])
    console.log(this.files)
})

// function to store pop updata as an object
function savePopUpData() {
    const updatedProductData = {
        brand: brandElement.value,
        category: categoryElement.value,
        description: descriptionElement.value,
        discountPercentage: discountPercentageElement.value,
        price: priceElement.value,
        rating: ratingElement.value,
        stock: stockElement.value,
        title: titleElement.value,
        thumbnail: JSON.parse(localStorage.getItem('thumbnail')),
        images: 'Not Found',
    }
    return updatedProductData
}

// fucntion to add new product
function addNewProduct(e) {
    e.preventDefault()
    updatePopUp.classList.remove("hidden")
    backGround.classList.add("blur")
    savePopUpData()
}
async function saveNewProduct() {
    let newProductData = savePopUpData()
    let data = await fetchRequest('products?limit=20')
    const newProduct = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductData)
    })
        .then(res => res.json())
        .then(data);
    if (newProductData.title.length > 0 && newProductData.price.length > 0) {
        data.products.unshift(newProductData)
        getProductsData(productEndPOintURL, data)
        updatePopUp.classList.add("hidden")
        backGround.classList.remove("blur")
    }

}


//  function for pagination
function pagination(e) {
    let skip = 0;
    let i = e.target.innerText
    const allPages = document.querySelectorAll('.page')
    for (let j = 0; j < allPages.length; j++) {
        if (allPages[j].classList.contains('active')) {
            allPages[j].classList.remove('active')
        }
    }
    skip = (20 + skip) * (i - 1)
    let paginationURL = `products?limit=20&skip=${skip}`
    getProductsData(`${paginationURL}`)
    document.querySelector(`.page${i}`).classList.add('active')
    document.documentElement.scrollTop = 800;
}

// function for next page of product using next button 
function paginationNext(e) {
    let i = 0
    let skip = 0
    const allPages = document.querySelectorAll('.page')
    for (let j = 0; j < allPages.length; j++) {
        if (allPages[j].classList.contains('active')) {
            allPages[j].classList.remove('active')
            i = j + 1
            if (i == 5) {
                i = 0
                allPages[0].classList.add('active')
            }
        }
    }
    skip = (20 + skip) * (i)
    console.log(skip)
    let paginationURL = `products?limit=20&skip=${skip}`
    getProductsData(`${paginationURL}`)
    document.querySelector(`.page${i + 1}`).classList.add('active')
    document.documentElement.scrollTop = 800;
}

// function to logout the user
function handleLogout(e) {
    localStorage.clear()
    window.location.replace('../../index.html');

}

