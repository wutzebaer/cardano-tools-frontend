/**
 * OpenAPI definition
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { MintOrder } from '../model/mintOrder';
import { MintOrderSubmission } from '../model/mintOrderSubmission';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class RestInterfaceService {

    protected basePath = 'http://localhost:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * 
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createAccount(observe?: 'body', reportProgress?: boolean): Observable<string>;
    public createAccount(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public createAccount(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public createAccount(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('post',`${this.basePath}/api/createAccount`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param key 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getAddress(key: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public getAddress(key: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public getAddress(key: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public getAddress(key: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getAddress.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/api/getAddress/${encodeURIComponent(String(key))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param key 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getBalance(key: string, observe?: 'body', reportProgress?: boolean): Observable<number>;
    public getBalance(key: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<number>>;
    public getBalance(key: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<number>>;
    public getBalance(key: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getBalance.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<number>('get',`${this.basePath}/api/getBalance/${encodeURIComponent(String(key))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param key 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getMintCoinOrder(key: string, observe?: 'body', reportProgress?: boolean): Observable<MintOrder>;
    public getMintCoinOrder(key: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<MintOrder>>;
    public getMintCoinOrder(key: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<MintOrder>>;
    public getMintCoinOrder(key: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getMintCoinOrder.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<MintOrder>('get',`${this.basePath}/api/mintCoinOrder/${encodeURIComponent(String(key))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param key 
     * @param file 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public handleFileUploadForm(key: string, file?: Blob, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public handleFileUploadForm(key: string, file?: Blob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public handleFileUploadForm(key: string, file?: Blob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public handleFileUploadForm(key: string, file?: Blob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling handleFileUpload.');
        }


        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): void; };
        let useForm = false;
        let convertFormParamsToString = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        }

        if (file !== undefined) {
            formParams = formParams.append('file', <any>file) as any || formParams;
        }

        return this.httpClient.request<string>('post',`${this.basePath}/api/addFile/${encodeURIComponent(String(key))}`,
            {
                body: convertFormParamsToString ? formParams.toString() : formParams,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public mintFee(body: MintOrderSubmission, observe?: 'body', reportProgress?: boolean): Observable<number>;
    public mintFee(body: MintOrderSubmission, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<number>>;
    public mintFee(body: MintOrderSubmission, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<number>>;
    public mintFee(body: MintOrderSubmission, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling mintFee.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<number>('post',`${this.basePath}/api/mintFee`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param key 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public postMintCoinOrder(body: MintOrderSubmission, key: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public postMintCoinOrder(body: MintOrderSubmission, key: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public postMintCoinOrder(body: MintOrderSubmission, key: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public postMintCoinOrder(body: MintOrderSubmission, key: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling postMintCoinOrder.');
        }

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling postMintCoinOrder.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('post',`${this.basePath}/api/mintCoinOrder/${encodeURIComponent(String(key))}`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public tip(observe?: 'body', reportProgress?: boolean): Observable<number>;
    public tip(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<number>>;
    public tip(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<number>>;
    public tip(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<number>('get',`${this.basePath}/api/tip`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}