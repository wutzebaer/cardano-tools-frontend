import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-chiplist',
  templateUrl: './chiplist.component.html',
  styleUrls: ['./chiplist.component.scss']
})
export class ChiplistComponent implements OnInit {

  @Input() label!: string;
  @Input() placeholder!: string;

  @Input() items!: string[];
  @Output() itemsChange = new EventEmitter<string[]>();

  @Input() selected!: string[];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() { }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.items.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.itemsChange.emit(this.items);
  }

  remove(fruit: string): void {
    const index = this.items.indexOf(fruit);

    if (index >= 0) {
      this.items.splice(index, 1);
    }

    this.itemsChange.emit(this.items);
  }

}
