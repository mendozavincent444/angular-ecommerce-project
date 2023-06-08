import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { ProductResponse } from 'src/app/common/product-response';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  isSearchMode: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyword: string = "";


  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(() => this.listProducts());
  }

  public listProducts() {

    this.isSearchMode = this.route.snapshot.paramMap.has("keyword");

    if (this.isSearchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  public handleSearchProducts() {
    const keyword: string = this.route.snapshot.params["keyword"];

    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;

    this.productService.searchProductsPagination(keyword, this.pageNumber - 1, this.pageSize)
      .subscribe(this.processResult());
  }

  public handleListProducts() {

    const isCategoryDisplayMode = this.route.snapshot.paramMap.has("id");

    if (isCategoryDisplayMode) {
      this.currentCategoryId = this.route.snapshot.params["id"];
    } else {
      this.currentCategoryId = 1;
    }


    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService
      .getProductListPagination(this.currentCategoryId, this.pageNumber - 1, this.pageSize)
      .subscribe(this.processResult());
  }

  public updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  public processResult() {
    return (data: ProductResponse) => {
      this.products = data.content;
      this.pageNumber = data.pageNo + 1;
      this.pageSize = data.pageSize;
      this.totalElements = data.totalElements;
    };
  }

  public addToCart(product: Product) {

    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }


}
