import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulaire.component.html',
  styleUrl: './formulaire.component.css'
})
export class FormulaireComponent {
  entityForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.entityForm = this.fb.group({

    });
  }

  onSubmit(): void {
    if (this.entityForm.valid) {
      this.http.post('http://localhost:8080/api/v1', this.entityForm.value)
        .subscribe(response => {
          console.log('Entity added successfully', response);
        }, error => {
          console.error('Error adding entity', error);
        });
    }
  }

}
