import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorageService } from "./../../../shared/services/local-storage/local-storage.service";
import { MessageService } from "./../services/message.service";
import { Component, OnInit, TemplateRef, Input } from "@angular/core";

import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { environment } from "@env/environment";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"]
})
export class MessageComponent implements OnInit {
  defaultImagePath = environment.defaultImagePath;
  imageUrl = environment.baseImageUrl;
  messageForm: FormGroup;
  gridData = [
    { from: "Admin Bent Ray", to: "Rabin bahadur Naga" },
    { from: "Admin Bent Ray", to: "Santosh Prasad Naga" },
    { from: "Admin Bent Ray", to: "Suraj Kumar Regmi" },
    { from: "Admin Bent Ray", to: "Rabin bahadur Naga" },
    { from: "Admin Bent Ray", to: "suyog prasad chetteri" }
  ];
  loading: boolean;
  modalRef: BsModalRef;
  contactList: any;
  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  messageTitle: any;

  allMessage: any;
  constructor(
    private modalService: BsModalService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getMessageContactList(this.staff_id);
    this.buildMessageForm();
  }
  liveMessage() {
    this.allMessage = this.messageService.getMessage(this.paramsObject);
  }
  buildMessageForm() {
    this.messageForm = this.fb.group({
      message: ["", Validators.required]
    });
  }

  getMessageContactList(id) {
    this.messageService.getMessageContactList(id).subscribe(
      response => {
        if (response) {
          this.contactList = response;
          return;
        }
      },
      error => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  paramsObject = {
    sender_id: this.staff_id,
    receiver_id: "",
    message: ""
  };

  getMessage(paramsObject) {
    this.loading = true;
    this.messageService.getMessage(paramsObject).subscribe(
      response => {
        if (response) {
          this.allMessage = response;

          return;
        }
      },
      error => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
  sendMessage(paramsObject) {
    this.messageService.sendMessage(paramsObject).subscribe(
      response => {
        if (response.status) {
          this.toastrMessageService.showSuccess("Message Sent");
        }
      },
      error => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  onSendMessage() {
    if (this.messageForm.invalid) return;
    this.paramsObject.message = this.messageForm.value.message;

    this.sendMessage(this.paramsObject);
    this.getMessage(this.paramsObject);

    this.messageForm.reset();
  }

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  // message access modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openChatModal(template: TemplateRef<any>, contact) {
    this.messageTitle =
      contact.first_name + " " + contact.middle_name + " " + contact.last_name;
    this.paramsObject.receiver_id = contact.user_id;
    this.getMessage(this.paramsObject);

    this.modalRef = this.modalService.show(template, this.config);
  }
  // message access
  onSave() {
    console.log("access message is created.");
  }
}
