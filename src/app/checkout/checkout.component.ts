import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel } from '@angular/forms';

import { Order } from '../models/order.interface';
import { ShoppingCart } from '../models/shopping-cart.model';
import { CartService } from '../core/cart.service';
import { Observable } from 'rxjs/Observable';
import { SearchService } from '../core/search.service';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  showCalendar = false;
  myDate = Date.now();

  form: FormGroup;
  orderForm: Order;
  cart: Observable<ShoppingCart>;
  order: ShoppingCart;

  restaurantInfo;
  mask = [/[0-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskNumber = [/[0-9]/, /\d/, /\d/];
  maskDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  image;
  address;
  token: string;
  isAuth: boolean;
  isOpen = false;
  isDateOpen = false;
  cardNum: string;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private searchService: SearchService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isAuth = this.auth.isAuthenticated();
    this.token = this.auth.getToken();
    this.address = this.searchService.getAddress();
    this.image = this.searchService.getImage(this.address.geometry);
    this.cart = this.cartService.get();
    this.cart.subscribe(data => {
      this.order = data;
      this.restaurantInfo = data.restaurant;
    });
    this.form = this.fb.group({
      delivery: this.fb.group({
        lat: this.address.geometry.lat,
        lng: this.address.geometry.lng,
        date_time: '',
        address: [this.address.formatted_address, {disabled: true}],
        address_detail: ['', Validators.required],
        comment: ''
      }),
      payment: this.fb.group({
        method: 'card',
        num: ['', [
            Validators.required,
            Validators.minLength(19),
            Validators.maxLength(19)
            ]
          ]
      })
    });

    this.form.valueChanges
      .filter(data => this.form.valid)
      .subscribe(data => {
        this.orderForm = Object.assign({}, data);
        console.log(this.orderForm);
      });
  }

  get num() { return this.form.get('payment.num'); }

  getCardNum() {
    this.isOpen = false;
    this.cardNum = this.num.value;
  }

  generateOrder(order) {
    const items = order.items.map(item => {
      return Object.assign({}, { item: item.product.uuid }, {comment: item.comment}, {cnt: item.quantity});
    });
    return Object.assign({}, {restaurant: order.restaurant.uuid}, {comment: ''}, {items: items});
  }

  goCheckout() {
    const order = this.generateOrder(this.order);
    this.orderForm = Object.assign({}, this.orderForm, { order: order});
    if (this.auth.isAuthenticated() && this.form.valid) {
      this.searchService.sendOrder(this.orderForm, this.token)
        .subscribe(
          (data) => {
            this.cartService.emptyCart();
            this.router.navigate(['orders']);
            console.log('order has been made', data);
          }
        , (error) => console.log('error!!')
      );
    } else {
      alert('error');
    }
  }
}
