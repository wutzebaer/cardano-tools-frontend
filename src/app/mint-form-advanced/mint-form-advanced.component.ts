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
      JSON.parse(this.metaDataJson)
      this.dialogRef.close(this.metaDataJson)
    } catch (error) {
      alert(error)
    }
  }

  format() {
    try {
      this.metaDataJson = JSON.stringify(JSON.parse(this.metaDataJson), null, 3)
    } catch (error) {
      alert(error)
    }
  }

}
