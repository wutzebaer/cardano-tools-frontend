import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mint-form-advanced',
  templateUrl: './mint-form-advanced.component.html',
  styleUrls: ['./mint-form-advanced.component.scss']
})
export class MintFormAdvancedComponent implements OnInit {

  metaDataJson: string;

  constructor(private dialogRef: MatDialogRef<MintFormAdvancedComponent>, @Inject(MAT_DIALOG_DATA) public data: { metaDataJson: string }) {
    this.metaDataJson = data.metaDataJson
  }

  ngOnInit(): void {
  }

  apply() {
    try {
      this.checkStringLengthRecursive(JSON.parse(this.metaDataJson));
      this.dialogRef.close(this.metaDataJson)
    } catch (error) {
      alert(error)
    }
  }

  format() {
    try {
      const parsed = JSON.parse(this.metaDataJson);
      this.checkStringLengthRecursive(parsed);
      this.metaDataJson = JSON.stringify(parsed, null, 3)
    } catch (error) {
      alert(error)
    }
  }


  checkStringLengthRecursive(object: any) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        if (typeof element === 'string') {
          if (Buffer.from(element).length > 64) {
            throw new Error("String longer than 64: " + element);
          }
        } else if (typeof element === 'object') {
          this.checkStringLengthRecursive(element);
        }
      }
    }
  }

}
