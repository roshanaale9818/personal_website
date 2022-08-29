import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-view-assignment",
  templateUrl: "./view-assignment.component.html",
  styleUrls: ["./view-assignment.component.scss"],
})
export class ViewAssignmentComponent implements OnInit {
  candidatePoolLoading: boolean;
  noResult: boolean;
  fieldSearchTerm: any;
  selectedSearchTerm: any;
  listLoading: boolean;
  constructor() {}

  ngOnInit() {}
}
