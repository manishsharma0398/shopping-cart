class ShoppingCart {
  constructor() {
    this.cancelBtn = document.querySelector(".cancel-btn");
    this.noItem = document.querySelector(".no-item");
    this.clearBtn = document.querySelector(".clear-cart");
    this.total = document.querySelector(".total-price");
    this.overlay = document.querySelector(".cart-container-overlay");
    this.totalPrice = document.querySelector(".total-checkout-price");
    this.cartContainer = document.querySelector(".cart-container");
    this.cartId = document.querySelector("#cart");
    this.product = Array.from(document.getElementsByClassName("product"));
    this.cartDom = document.querySelector(".cart-products");
    this.addToCartBtn = Array.from(
      document.getElementsByClassName("not-added")
    );
    this.perProductPrice = Array.from(
      document.getElementsByClassName("per-product-price")
    );
    this.itemsInCart = Array.from(
      document.getElementsByClassName("cart-number")
    );

    this.removeBtn = "cart-product-remove";

    this.increaseBtn = "increase";
    this.decreaseBtn = "decrease";
    this.number = "number";
  }

  clearLocalStorage() {
    localStorage.removeItem("shoppingCart");
    this.cartDom.innerHTML = "";

    this.addTotalInCart();
    this.updateProductsInCart();
    this.updateWhetherProductInCartOrNot();

    this.clearBtn.style.display = "none";

    this.checkForClearButton();
  }

  addTotalInCart() {
    let carts = this.getFromLocalStorage();
    let price = 0;
    carts.forEach(cart => {
      price += +cart.price * +cart.quantity;
    });
    this.totalPrice.textContent = this.addComma(price);
  }

  toggleOverlay() {
    this.overlay.classList.toggle("overlay");
  }

  openCart() {
    this.cartContainer.style.right = "0";
    this.toggleOverlay();
  }

  closeCart() {
    this.cartContainer.style.right = "-250px";
    this.toggleOverlay();
  }

  addComma(numbers) {
    let CSV = Number(numbers).toLocaleString("en");
    return CSV;
  }

  removeComma(numbers) {
    let notCSV = numbers.toString().replace(",", "");
    return notCSV;
  }

  addCartDOM(cartItem) {
    this.cartDom.innerHTML += ` <div class="cart-product">
    <div class="cart-product-img">
      <img id="${cartItem.id}" src="assets/img/${cartItem.image}" alt="${
      cartItem.name
    }" />
    </div>
    <div class="cart-product-details">
      <div class="product-details">
        <p class="cart-product-name">${cartItem.name}</p>
        <p class="cart-product-price">
        <span> ₹ </span>
        <span> 
         ${this.addComma(cartItem.price)}
         </span></p>
        <p class="cart-product-remove">remove</p>
      </div>
      <div class="product-quantity">
        <span class="increase"> &and; </span>
        <span class="number">${cartItem.quantity}</span>
        <span class="decrease"> &or; </span>
      </div>
    </div>
  </div>`;
  }

  addProductToCart(newProduct) {
    let cart = this.getFromLocalStorage();
    cart.unshift(newProduct);
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  getFromLocalStorage() {
    let shoppingCart;
    if (
      localStorage.getItem("shoppingCart") == undefined ||
      localStorage.getItem("shoppingCart") == null
    ) {
      shoppingCart = [];
    } else {
      shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
    }
    return shoppingCart;
  }

  LoadFromLocalStorage() {
    let carts = this.getFromLocalStorage();
    carts.forEach(cart => {
      this.addCartDOM(cart);
    });
  }

  removeFromDOM(target) {
    target.parentElement.parentElement.parentElement.remove();
    this.updateProductsInCart();
    this.addTotalInCart();

    this.updateWhetherProductInCartOrNot();
  }

  removeFromLocalStorage(id) {
    let carts = this.getFromLocalStorage();
    let productIndex = this.checkWhetherProductInCartOrNot(id);
    carts.splice(productIndex, 1);
    localStorage.setItem("shoppingCart", JSON.stringify(carts));
  }

  updateWhetherProductInCartOrNot() {
    this.product.forEach(cart => {
      let cartIndex = this.checkWhetherProductInCartOrNot(
        cart.children[0].children[0].id
      );

      if (cartIndex >= 0) {
        cart.children[0].children[1].classList.remove("hide");
        cart.children[0].children[2].classList.add("hide");
      } else {
        cart.children[0].children[1].classList.add("hide");
        cart.children[0].children[2].classList.remove("hide");
      }
    });
  }

  checkWhetherProductInCartOrNot(id) {
    let carts = this.getFromLocalStorage();
    let cartIndex = carts.findIndex(cart => {
      if (cart.id == id) {
        return true;
      }
    });
    return cartIndex;
  }

  addProductsInCart() {
    let carts = this.getFromLocalStorage();
    let quantity = 0;
    carts.forEach(cart => {
      quantity += +cart.quantity;
    });
    return quantity;
  }

  updateProductsInCart() {
    let total = this.addProductsInCart();
    this.itemsInCart.forEach(price => {
      price.innerText = total;
    });
  }

  checkForClearButton() {
    if (this.getFromLocalStorage().length > 0) {
      this.clearBtn.style.display = "block";
      this.noItem.style.display = "none";
      this.total.style.display = "block";
    } else {
      this.clearBtn.style.display = "none";
      this.noItem.style.display = "block";
      this.total.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let shoppingCart = new ShoppingCart();
  shoppingCart.LoadFromLocalStorage();
  shoppingCart.addTotalInCart();
  shoppingCart.addProductsInCart();

  document.querySelector(".cart-products").addEventListener("click", e => {
    if (e.target.className == shoppingCart.removeBtn) {
      shoppingCart.removeFromLocalStorage(
        e.target.parentElement.parentElement.previousElementSibling.children[0]
          .id
      );
      shoppingCart.removeFromDOM(e.target);
      shoppingCart.checkForClearButton();
    }

    if (e.target.className == shoppingCart.increaseBtn) {
      let id =
        e.target.parentElement.parentElement.previousElementSibling.children[0]
          .id;

      let carts = shoppingCart.getFromLocalStorage();
      let productIndex = shoppingCart.checkWhetherProductInCartOrNot(id);
      carts[productIndex].quantity = carts[productIndex].quantity + 1;

      e.target.nextElementSibling.textContent = carts[productIndex].quantity;

      localStorage.setItem("shoppingCart", JSON.stringify(carts));

      shoppingCart.addProductsInCart();
      shoppingCart.addTotalInCart();
      shoppingCart.updateProductsInCart();
      shoppingCart.checkForClearButton();
    }

    if (e.target.className == shoppingCart.decreaseBtn) {
      let id =
        e.target.parentElement.parentElement.previousElementSibling.children[0]
          .id;

      let carts = shoppingCart.getFromLocalStorage();
      let productIndex = shoppingCart.checkWhetherProductInCartOrNot(id);
      carts[productIndex].quantity = carts[productIndex].quantity - 1;

      e.target.previousElementSibling.textContent =
        carts[productIndex].quantity;

      if (carts[productIndex].quantity == 0) {
        let carts = shoppingCart.getFromLocalStorage();
        let cartIndex = carts.findIndex(cart => {
          if (cart.id == id) {
            return true;
          }
        });

        if (cartIndex >= 0) {
          carts.splice(cartIndex, 1);
          localStorage.setItem("shoppingCart", JSON.stringify(carts));
          shoppingCart.removeFromDOM(e.target);
        }
      } else {
        localStorage.setItem("shoppingCart", JSON.stringify(carts));
      }

      shoppingCart.checkForClearButton();
      shoppingCart.addProductsInCart();
      shoppingCart.addTotalInCart();
      shoppingCart.updateProductsInCart();
      shoppingCart.checkForClearButton();
    }
  });

  shoppingCart.updateWhetherProductInCartOrNot();

  shoppingCart.cancelBtn.addEventListener("click", () => {
    shoppingCart.closeCart();
  });

  shoppingCart.cartId.addEventListener("click", () => {
    shoppingCart.openCart();
  });

  shoppingCart.addToCartBtn.forEach(addBtn => {
    addBtn.addEventListener("click", e => {
      let image = e.target.previousElementSibling.previousElementSibling.src
        .split("/")
        .pop();
      let id = e.target.previousElementSibling.previousElementSibling.id;
      let name =
        e.target.previousElementSibling.previousElementSibling.parentElement
          .nextElementSibling.textContent;
      let price = shoppingCart.removeComma(
        e.target.previousElementSibling.previousElementSibling.parentElement
          .nextElementSibling.nextElementSibling.children[1].textContent
      );

      let product = {
        image,
        id,
        name,
        price,
        quantity: 1
      };
      shoppingCart.addProductToCart(product);
      e.target.classList.add("hide");
      e.target.previousElementSibling.classList.remove("hide");
      shoppingCart.addCartDOM(product);
      shoppingCart.addTotalInCart();
      shoppingCart.updateProductsInCart();
      shoppingCart.openCart();

      shoppingCart.checkForClearButton();
    });
  });

  shoppingCart.perProductPrice.forEach(price => {
    let a = shoppingCart.addComma(price.innerText);
    price.innerText = a;
  });

  shoppingCart.updateProductsInCart();

  shoppingCart.clearBtn.addEventListener("click", () => {
    shoppingCart.clearLocalStorage();
  });

  shoppingCart.checkForClearButton();
});
