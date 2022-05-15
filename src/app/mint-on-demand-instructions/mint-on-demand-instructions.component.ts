import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DropRestInterfaceService, PublicDropInfo } from 'src/cardano-tools-client';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mint-on-demand-instructions',
  templateUrl: './mint-on-demand-instructions.component.html',
  styleUrls: ['./mint-on-demand-instructions.component.scss']
})
export class MintOnDemandInstructionsComponent implements OnInit {

  publicDropInfo?: PublicDropInfo;
  amount: number = 1;
  availableAmounts: number[] = []

  constructor(
    private route: ActivatedRoute,
    private dropRestInterfaceService: DropRestInterfaceService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.dropRestInterfaceService.getDrop(params.prettyUrl).subscribe(publicDropInfo => {
        this.publicDropInfo = publicDropInfo
        this.availableAmounts = [];
        for (let index = 1; index <= publicDropInfo.max; index++) {
          this.availableAmounts.push(index);
        }
      });
    });
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    let snackBarRef = this.snackBar.open('Copied to clipboard: ' + value, undefined, { duration: 2000 });
  }

}
