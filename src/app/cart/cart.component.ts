import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { CartService } from '../core/cart.service';

import { Product } from '../models/product.interface';
import { CartItem } from '../models/cart-item.model';
import { ShoppingCart } from '../models/shopping-cart.model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ProductsService } from '../core/products.service';

interface ICartItemWithProduct extends CartItem {
  product: Product;
  totalCost: number;
}

@Component({
  selector: 'app-cart',
  styleUrls: ['./cart.component.scss'],
  template: `
  <app-editor
    *ngIf="onClick"
    [editItem]="cartItem"
    (close)="onClick = false">
  </app-editor>
  <div class="cart">
    <button class="button uber button-fluid">장바구니 확인</button>
      <div>
        <div class="cart-group"
          *ngFor="let item of cartItems">
            <div (click)="onEdit(item)">
              {{ item.product.name }}
            </div>
            <span>{{ item.quantity }}</span>
            <span>{{ item.totalCost }}</span>
            <span
              type="button"
              (click)="onRemove(item.product_id)">
            제거
            </span>
        </div>
        <div class="price-group">
          <span>{{ itemCount }}</span>
        </div>
      </div>
  </div>
  `
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Observable<ShoppingCart>;
  cartItems: ICartItemWithProduct[];
  itemCount: number;
  products: Product[];
  cartSubscription: Subscription;
  cartItem: ICartItemWithProduct;
  onClick: boolean;

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cart = this.cartService.get();
    this.cartSubscription = this.cart.subscribe(cart => {
      this.itemCount = cart.items.map(i => i.quantity).reduce((prev, current) => prev + current, 0);
      this.productsService.getProducts().subscribe((products) => {
        this.products = products;
        this.cartItems = cart.items.map((item) => {
          const product = this.products.find(p => p.id === item.product_id);
          return {
            ...item,
            product,
            totalCost: product.price * item.quantity
          };
        });
      });
    });
  }

  onSubmit() {
  }

  onRemove(id) {
    this.cartService.removeItem(id);
  }

  onEdit(item) {
    this.cartItem = item;
    this.onClick = true;
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
