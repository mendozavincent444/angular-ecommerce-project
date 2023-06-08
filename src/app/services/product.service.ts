import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { ProductResponse } from '../common/product-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  private baseUrl: string = "http://localhost:8080/api/v1/products";
  private categoryUrl: string = "http://localhost:8080/api/v1/product-categories";

  constructor(private httpClient: HttpClient) {

  }

  public getProduct(productId: number): Observable<Product> {
    const productUrl: string = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  public getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl: string = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.httpClient.get<Product[]>(searchUrl);
  }

  public getProductListPagination(categoryId: number, pageNo: number, pageSize: number): Observable<ProductResponse> {
    const searchUrl: string = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${pageNo}&size=${pageSize}`;
    return this.httpClient.get<ProductResponse>(searchUrl);
  }

  public getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.categoryUrl);
  }

  public searchProductsPagination(keyword: string, pageNo: number, pageSize: number): Observable<ProductResponse> {
    const searchUrl: string = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${pageNo}&size=${pageSize}`;
    return this.httpClient.get<ProductResponse>(searchUrl);
  }

  /*
  public searchProducts(name: string): Observable<Product[]> {
    const searchUrl: string = `${this.baseUrl}/search/findByNameContaining?name=${name}`;
    return this.httpClient.get<Product[]>(searchUrl);
  }
  */
  

}
