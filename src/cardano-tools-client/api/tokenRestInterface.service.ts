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

import { TokenData } from '../model/tokenData';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class TokenRestInterfaceService {

    protected basePath = 'http://localhost:8081';
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

        return this.httpClient.request<Array<TokenData>>('get',`${this.basePath}/api/tokens/findTokens`,
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
     * @param fromMintid 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public latestTokens(fromMintid?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<TokenData>>;
    public latestTokens(fromMintid?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<TokenData>>>;
    public latestTokens(fromMintid?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<TokenData>>>;
    public latestTokens(fromMintid?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (fromMintid !== undefined && fromMintid !== null) {
            queryParameters = queryParameters.set('fromMintid', <any>fromMintid);
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

        return this.httpClient.request<Array<TokenData>>('get',`${this.basePath}/api/tokens/latestTokens`,
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
     * @param address 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public policyTokens(address: string, observe?: 'body', reportProgress?: boolean): Observable<Array<TokenData>>;
    public policyTokens(address: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<TokenData>>>;
    public policyTokens(address: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<TokenData>>>;
    public policyTokens(address: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (address === null || address === undefined) {
            throw new Error('Required parameter address was null or undefined when calling policyTokens.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (address !== undefined && address !== null) {
            queryParameters = queryParameters.set('address', <any>address);
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

        return this.httpClient.request<Array<TokenData>>('get',`${this.basePath}/api/tokens/policyTokens`,
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
     * @param address 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public walletTokens(address: string, observe?: 'body', reportProgress?: boolean): Observable<Array<TokenData>>;
    public walletTokens(address: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<TokenData>>>;
    public walletTokens(address: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<TokenData>>>;
    public walletTokens(address: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (address === null || address === undefined) {
            throw new Error('Required parameter address was null or undefined when calling walletTokens.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (address !== undefined && address !== null) {
            queryParameters = queryParameters.set('address', <any>address);
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

        return this.httpClient.request<Array<TokenData>>('get',`${this.basePath}/api/tokens/walletTokens`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}