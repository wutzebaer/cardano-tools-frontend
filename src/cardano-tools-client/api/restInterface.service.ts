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

import { Account } from '../model/account';
import { MintOrderSubmission } from '../model/mintOrderSubmission';
import { MintTransaction } from '../model/mintTransaction';
import { RegistrationMetadata } from '../model/registrationMetadata';
import { TokenData } from '../model/tokenData';

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
     * @param body 
     * @param key 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public buildMintTransaction(body: MintOrderSubmission, key: string, observe?: 'body', reportProgress?: boolean): Observable<MintTransaction>;
    public buildMintTransaction(body: MintOrderSubmission, key: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<MintTransaction>>;
    public buildMintTransaction(body: MintOrderSubmission, key: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<MintTransaction>>;
    public buildMintTransaction(body: MintOrderSubmission, key: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling buildMintTransaction.');
        }

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling buildMintTransaction.');
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

        return this.httpClient.request<MintTransaction>('post',`${this.basePath}/api/buildMintTransaction/${encodeURIComponent(String(key))}`,
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
    public createAccount(observe?: 'body', reportProgress?: boolean): Observable<Account>;
    public createAccount(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Account>>;
    public createAccount(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Account>>;
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

        return this.httpClient.request<Account>('post',`${this.basePath}/api/Account`,
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
     * @param string 
     * @param fromTid 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findTokens(string: string, fromTid?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<TokenData>>;
    public findTokens(string: string, fromTid?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<TokenData>>>;
    public findTokens(string: string, fromTid?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<TokenData>>>;
    public findTokens(string: string, fromTid?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (string === null || string === undefined) {
            throw new Error('Required parameter string was null or undefined when calling findTokens.');
        }


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (string !== undefined && string !== null) {
            queryParameters = queryParameters.set('string', <any>string);
        }
        if (fromTid !== undefined && fromTid !== null) {
            queryParameters = queryParameters.set('fromTid', <any>fromTid);
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

        return this.httpClient.request<Array<TokenData>>('get',`${this.basePath}/api/findTokens`,
            {
                params: queryParameters,
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
     * @param registrationMetadataString 
     * @param file 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public generateTokenRegistrationForm(registrationMetadataString?: string, file?: Blob, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public generateTokenRegistrationForm(registrationMetadataString?: string, file?: Blob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public generateTokenRegistrationForm(registrationMetadataString?: string, file?: Blob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public generateTokenRegistrationForm(registrationMetadataString?: string, file?: Blob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



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

        if (registrationMetadataString !== undefined) {
            formParams = formParams.append('registrationMetadataString', <any>registrationMetadataString) as any || formParams;
        }
        if (file !== undefined) {
            formParams = formParams.append('file', <any>file) as any || formParams;
        }

        return this.httpClient.request<string>('post',`${this.basePath}/api/generateTokenRegistration`,
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
     * @param key 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getAccount(key: string, observe?: 'body', reportProgress?: boolean): Observable<Account>;
    public getAccount(key: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Account>>;
    public getAccount(key: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Account>>;
    public getAccount(key: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getAccount.');
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

        return this.httpClient.request<Account>('get',`${this.basePath}/api/account/${encodeURIComponent(String(key))}`,
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
    public getRegistrationMetadata(key: string, observe?: 'body', reportProgress?: boolean): Observable<RegistrationMetadata>;
    public getRegistrationMetadata(key: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<RegistrationMetadata>>;
    public getRegistrationMetadata(key: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<RegistrationMetadata>>;
    public getRegistrationMetadata(key: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getRegistrationMetadata.');
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

        return this.httpClient.request<RegistrationMetadata>('get',`${this.basePath}/api/getRegistrationMetadata/${encodeURIComponent(String(key))}`,
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
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getTip(observe?: 'body', reportProgress?: boolean): Observable<number>;
    public getTip(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<number>>;
    public getTip(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<number>>;
    public getTip(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

    /**
     * 
     * 
     * @param fromTid 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public latestTokens(fromTid?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<TokenData>>;
    public latestTokens(fromTid?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<TokenData>>>;
    public latestTokens(fromTid?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<TokenData>>>;
    public latestTokens(fromTid?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (fromTid !== undefined && fromTid !== null) {
            queryParameters = queryParameters.set('fromTid', <any>fromTid);
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

        return this.httpClient.request<Array<TokenData>>('get',`${this.basePath}/api/latestTokens`,
            {
                params: queryParameters,
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
     * @param file 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public postFileForm(file?: Blob, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public postFileForm(file?: Blob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public postFileForm(file?: Blob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public postFileForm(file?: Blob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<string>('post',`${this.basePath}/api/file`,
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
     * @param key 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public submitMintTransaction(body: MintTransaction, key: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public submitMintTransaction(body: MintTransaction, key: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public submitMintTransaction(body: MintTransaction, key: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public submitMintTransaction(body: MintTransaction, key: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling submitMintTransaction.');
        }

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling submitMintTransaction.');
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

        return this.httpClient.request<any>('post',`${this.basePath}/api/submitMintTransaction/${encodeURIComponent(String(key))}`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
