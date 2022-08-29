import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pdf-download',
  templateUrl: './pdf-download.component.html',
  styleUrls: ['./pdf-download.component.scss']
})
export class PdfDownloadComponent implements OnInit {
@Input()companyLogoObj;
@Input()companyInfo;
@Input()selectedPaySlip;
@Input()datePickerFormat;
@Input() currentMonth;
@Input() nepaliMonth;
@Input()datePickerConfig;
@Input()currencyDetail;
@Input()selectedFundArray;
@Input()summaryMoney;
@Input()imageUrl;
@Input() show:boolean = false;
// show:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  @ViewChild('pdf',{
    static:true
  })pdf;
  downloadPdf(){
    this.show = true;
    this.pdf.saveAs('payroll.pdf');
    // this.selectedPaySlip=null;
  }

}
