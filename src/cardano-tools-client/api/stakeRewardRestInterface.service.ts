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

import { EpochStakePosition } from '../model/epochStakePosition';
import { PoolInfo } from '../model/poolInfo';
import { Transaction } from '../model/transaction';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class StakeRewardRestInterfaceService {

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
     * @param body 
     * @param key 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public buildTransaction(body: Array<EpochStakePosition>, key: string, observe?: 'body', reportProgress?: boolean): Observable<Transaction>;
    public buildTransaction(body: Array<EpochStakePosition>, key: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Transaction>>;
    public buildTransaction(body: Array<EpochStakePosition>, key: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Transaction>>;
    public buildTransaction(body: Array<EpochStakePosition>, key: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling buildTransaction.');
        }

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling buildTransaction.');
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

        return this.httpClient.request<Transaction>('post',`${this.basePath}/api/rewards/${encodeURIComponent(String(key))}/buildTransaction`,
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
     * @param key 
     * @param poolHash 
     * @param epoch 
     * @param tip 
     * @param minStake 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getEpochStakes(key: string, poolHash: string, epoch: number, tip: boolean, minStake: number, observe?: 'body', reportProgress?: boolean): Observable<Array<EpochStakePosition>>;
    public getEpochStakes(key: string, poolHash: string, epoch: number, tip: boolean, minStake: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<EpochStakePosition>>>;
    public getEpochStakes(key: string, poolHash: string, epoch: number, tip: boolean, minStake: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<EpochStakePosition>>>;
    public getEpochStakes(key: string, poolHash: string, epoch: number, tip: boolean, minStake: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getEpochStakes.');
        }

        if (poolHash === null || poolHash === undefined) {
            throw new Error('Required parameter poolHash was null or undefined when calling getEpochStakes.');
        }

        if (epoch === null || epoch === undefined) {
            throw new Error('Required parameter epoch was null or undefined when calling getEpochStakes.');
        }

        if (tip === null || tip === undefined) {
            throw new Error('Required parameter tip was null or undefined when calling getEpochStakes.');
        }

        if (minStake === null || minStake === undefined) {
            throw new Error('Required parameter minStake was null or undefined when calling getEpochStakes.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (tip !== undefined && tip !== null) {
            queryParameters = queryParameters.set('tip', <any>tip);
        }
        if (minStake !== undefined && minStake !== null) {
            queryParameters = queryParameters.set('minStake', <any>minStake);
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

        return this.httpClient.request<Array<EpochStakePosition>>('get',`${this.basePath}/api/rewards/${encodeURIComponent(String(key))}/${encodeURIComponent(String(poolHash))}/${encodeURIComponent(String(epoch))}`,
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
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPoolList(observe?: 'body', reportProgress?: boolean): Observable<Array<PoolInfo>>;
    public getPoolList(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<PoolInfo>>>;
    public getPoolList(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<PoolInfo>>>;
    public getPoolList(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<PoolInfo>>('get',`${this.basePath}/api/rewards/pools`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
