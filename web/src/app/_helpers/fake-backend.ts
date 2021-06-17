import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../_models/user';
import { Product } from '../_models/product';

// array in local storage for registered users
let users: User[] = [{ id: 1, username: 'valentine', password: 'q1w2e3', token: 'fake-jwt-token' }];
let products: Product[] = [
    { id: 1, humanUrl: 'black-tot-rum', title: 'Black Tot Rum', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, humanUrl: 'black-tot-rum-2', title: 'Black Tot Rum 2', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', imageUrl: 'https://via.placeholder.com/150' },
    { id: 3, humanUrl: 'black-tot-rum-3', title: 'Black Tot Rum 3', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', imageUrl: 'https://via.placeholder.com/150' }]

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            if (url.endsWith('/auth/login') && method === 'POST') {
                return authenticate();
            }

            if (url.endsWith('/api/v1/products') && method === 'GET') {
                return getProducts();
            }

            var regexProductByIdUrl = new RegExp('(api\/v1\/products\/)([0-9]*)');
            if (regexProductByIdUrl.test(url) && method === 'GET') {
                return getProductById(url.match(regexProductByIdUrl)[2]);
            }

            if (regexProductByIdUrl.test(url) && method === 'PUT') {
                return saveProduct(body);
            }

            if (regexProductByIdUrl.test(url) && method === 'DELETE') {
                return deleteProduct(url.match(regexProductByIdUrl)[2]);
            }

            return next.handle(request);
        }

        // route functions

        function authenticate() {
            const { username, password } = body;

            let user = users.find((x: User) => x.username === username && x.password === password);
            if (!user) {
                 return error('Username or password is incorrect');
            }

            return ok({
                id: user.id,
                username: user.username,
                token: 'fake-jwt-token'
            })
        }

        function getProducts() {
            if (!isLoggedIn()) {
                return unauthorized();
            }

            return ok(products);
        }

        function getProductById(id: any) {
            if (!isLoggedIn()) {
                return unauthorized();
            }

            var product = products.find((x: Product) => x.id == id);
            if(!product){
                return error('Product not found.');
            }

            return ok(product);
        }

        function saveProduct(product : any) {
            if (!isLoggedIn()) {
                return unauthorized();
            }

            let index = products.indexOf(product);
            products[index] = product;

            return ok(product);
        }

        function deleteProduct(id : any) {
            if (!isLoggedIn()) {
                return unauthorized();
            }

            let index = products.findIndex((x: Product) => x.id == id);
            if (index > -1) {
                products.splice(index, 1);
             }

            return ok();
        }

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message: string) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};