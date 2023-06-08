import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ToShopFormService } from 'src/app/services/luv2-to-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutForm!: FormGroup;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private luv2ShopFormService: Luv2ToShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.checkoutForm = new FormGroup({
      customer: new FormGroup({
        firstName: new FormControl("", [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl("", [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl("", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      shippingAddress: new FormGroup({
        street: new FormControl("", [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl("", [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl("", Validators.required),
        country: new FormControl("", Validators.required),
        zipCode: new FormControl("", [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
      }),
      billingAddress: new FormGroup({
        street: new FormControl("", [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl("", [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl("", Validators.required),
        country: new FormControl("", Validators.required),
        zipCode: new FormControl("", [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
      }),
      creditCard: new FormGroup({
        cardType: new FormControl("", Validators.required),
        nameOnCard: new FormControl("", [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl("", [Validators.required, Validators.pattern("[0-9]{16}")]),
        securityCode: new FormControl("", [Validators.required, Validators.pattern("[0-9]{16}")]),
        expirationMonth: new FormControl(""),
        expirationYear: new FormControl(""),
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });

    this.luv2ShopFormService.getCreditCardYears().subscribe((data) => {
      this.creditCardYears = data;
    })

    this.luv2ShopFormService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    this.reviewCartDetails();


  }

  get firstName() {
    return this.checkoutForm.get("customer.firstName");
  }

  get lastName() {
    return this.checkoutForm.get("customer.lastName");
  }

  get email() {
    return this.checkoutForm.get("customer.email");
  }

  get shippingAddressCountry() {
    return this.checkoutForm.get("shippingAddress.country");
  }

  get shippingAddressStreet() {
    return this.checkoutForm.get("shippingAddress.street");
  }

  get shippingAddressCity() {
    return this.checkoutForm.get("shippingAddress.city");
  }

  get shippingAddressState() {
    return this.checkoutForm.get("shippingAddress.state");
  }

  get shippingAddressZipCode() {
    return this.checkoutForm.get("shippingAddress.zipCode");
  }

  get billingAddressCountry() {
    return this.checkoutForm.get("billingAddress.country");
  }

  get billingAddressStreet() {
    return this.checkoutForm.get("billingAddress.street");
  }

  get billingAddressCity() {
    return this.checkoutForm.get("billingAddress.city");
  }

  get billingAddressState() {
    return this.checkoutForm.get("billingAddress.state");
  }

  get billingAddressZipCode() {
    return this.checkoutForm.get("billingAddress.zipCode");
  }

  get creditCardType() {
    return this.checkoutForm.get("creditCard.cardType");
  }

  get creditCardNameOnCard() {
    return this.checkoutForm.get("creditCard.nameOnCard");
  }

  get creditCardNumber() {
    return this.checkoutForm.get("creditCard.cardNumber");
  }

  get creditCardSecurityCode() {
    return this.checkoutForm.get("creditCard.securityCode");
  }


  onSubmit() {


    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    let order = new Order();

    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;

    let orderItems: OrderItem[] = cartItems.map((cartItem) => new OrderItem(cartItem));

    let purchase = new Purchase();

    purchase.customer = this.checkoutForm.controls["customer"].value;

    purchase.shippingAddress = this.checkoutForm.controls["shippingAddress"].value;
    const shippingState: State =  JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: State =  JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutForm.controls["billingAddress"].value;
    const billingState: State =  JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: State =  JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err => {
        alert(`There was an error: ${err.message}`)
      }
    });
  }
  
  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutForm.get("billingAddress")?.setValue(this.checkoutForm.get("shippingAddress")?.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutForm.get("billingAddress")?.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutForm.get("creditCard");

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutForm.get(formGroupName);

    const countryCode = formGroup?.value.country["code"];

    this.luv2ShopFormService.getStates(countryCode).subscribe((data) => {


      if (formGroupName == "shippingAddress") {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      formGroup?.get("state")?.setValue(data[0]);
    });



  }


  reviewCartDetails() {
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    })
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutForm.reset();

    this.router.navigateByUrl("/products");
  }

}
