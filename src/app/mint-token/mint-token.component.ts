import { Observable } from 'rxjs';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormControl, NgForm } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { TokenSubmission } from 'src/cardano-tools-client';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-mint-token',
  templateUrl: './mint-token.component.html',
  styleUrls: ['./mint-token.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintTokenComponent implements OnInit {

  @Input() token!: TokenSubmission;
  @Input() index!: number;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  fruits: string[] = ['Image', 'Name', 'Type', 'Artist', 'Publisher'];
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  metadata: any = {};

  constructor() {
  }

  ngOnInit(): void {
  }

  metadataPresent(): boolean {
    return Object.keys(this.metadata).length > 0;
  }
  chipClick(metaField: string) {
    if (metaField in this.metadata) {
      delete this.metadata[metaField];
    } else {
      this.metadata[metaField] = "";
    }

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.metadata[value.trim()] = "";
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }



}
