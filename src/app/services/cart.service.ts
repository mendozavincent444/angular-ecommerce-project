import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {

  cartItems: CartItem[] = [];

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() { }

  ngOnInit(): void {
    let data = JSON.parse(this.storage.getItem("cartItems")!);


    if (data != null) {
      this.cartItems = data;
    }

    this.computeCartTotals();
  }

  persistCartItems() {
    this.storage.setItem("cartItems", JSON.stringify(this.cartItems));
  }


  addToCart(cartItem: CartItem) {
    let isAlreadyInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id == cartItem.id);

      isAlreadyInCart = !!existingCartItem;

    }

    if (isAlreadyInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    this.cartItems.forEach((tempCartItem) => {
      totalPriceValue += (tempCartItem.unitPrice * tempCartItem.quantity);
      totalQuantityValue += tempCartItem.quantity;
    });

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.persistCartItems();
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity == 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const cartItemIndex: number = this.cartItems.findIndex(tempCartItem => tempCartItem.id == cartItem.id);

    if (cartItemIndex > -1) {
      this.cartItems.splice(cartItemIndex, 1);
    }

    this.computeCartTotals();

  }



}
