import { Component, OnInit, TemplateRef } from '@angular/core';
import { formServices } from './form-modal/form.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IForm } from './form-modal/form-Interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

function bodySize(min: number, max: number): ValidatorFn {
  // we can add our custom validator function above the component class because the validator will only be used by this component.
  // to allow a formControl or a formgroup, we specify AbstractControl here
  // this is the return validator function
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    // we check if the AbstractControl has a value that is not null, is not a number, is less than 1, or greater than 5
    if (
      c.value !== null &&
      (isNaN(c.value) || c.value < min || c.value > max)
    ) {
      // if so, we return the key and value pair specifying the name of the validation rule, we'll call it range and true to indicate that the validation rule was broken. the validation rule name is then added to the errors collection for the passed passed in FormControl
      return { range: true };
    }
    // if the control is valid, we return null, meaning no error message
    return null;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  customerForm!: FormGroup;
  errorMessage = '';

  formUsers: IForm[] = [];
  edit = true;
  add = false;

  modalRef?: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private service: formServices,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      id: null,
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      bodySize: [null, bodySize(8, 18)],
      description: ['', [Validators.required, Validators.maxLength(256)]],
    });

    // Getting the formUsers
    this.getData();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  private getData() {
    this.service.getData().subscribe({
      next: (data) => {
        this.formUsers = data;
        console.log(this.formUsers);
      },
      error: (err) => (this.errorMessage = err),
    });
  }
  resetValues() {
    this.customerForm.reset();
  }

  update(formUserId: number) {
    if (formUserId) {
      const formUser = this.formUsers.find((x) => x.id === formUserId);
      console.log(formUser);

      if (!formUser) return;
      this.customerForm.setValue({
        id: formUser.id,
        firstName: formUser.firstName,
        lastName: formUser.lastName,
        bodySize: formUser.bodySize,
        description: formUser.description,
      });
    } else {
      alert('Error updating item');
    }
  }

  save(): void {
    if (this.customerForm.valid) {
      if (this.customerForm.dirty) {
        if (this.customerForm.value.id === null) {
          this.service
            .createItem(this.customerForm.value)
            .subscribe((response) => {
              console.log(response);
              this.getData();
              this.resetValues();
              this.modalRef?.hide();
            });
        } else {
          this.service
            .updateItem(this.customerForm.value)
            .subscribe((response) => {
              console.log(response);
              this.getData();
              this.resetValues();
              this.modalRef?.hide();
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.customerForm.reset();
    this.router.navigate(['/pages/jenzco-hotels']);
  }

  deleteItem(formUserId: number): void {
    this.service.deleteItemById(formUserId).subscribe((response) => {
      console.log(response);
      this.getData();
      this.resetValues();
    });
  }
  getDataById(formUserId: number) {
    if (formUserId) {
      const formUser = this.formUsers.find((x) => x.id === formUserId);
      console.log(formUser);

      this.service.getDataById(formUserId).subscribe((response) => {
        console.log(response);
        this.getData();
        this.resetValues();
      });
    }
    this.router.navigate([
      '/pages/jenzco-hotels',
      formUserId,
      'jenzco-form-list',
    ]);
  }
}
