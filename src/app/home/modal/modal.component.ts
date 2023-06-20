
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/core.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  empForm:FormGroup;

  constructor(

    private _fb: FormBuilder, 
    private _empService: ApiService, 
    private _dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService

    ) { 
    this.empForm = this._fb.group({
      name: '',
      lightLevel: '',
      waterRequirment: '',
      humidityLevel: '',
      habitat: '',
      stock: 0
  });
}

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }

  onFormSubmit(){
    if(this.empForm.valid){
      if(this.data){

        console.log(this.empForm.value);
        this._empService.updatePlant(this.data.id, this.empForm.value).subscribe({
        next:(val:any) => {
          this._coreService.openSnackBar('Editado correctamente');
          this._dialogRef.close(true);
        },
        error: (err:any) => {
          console.log(err);
        },
        }); 

      }else{

        console.log(this.empForm.value);
        this._empService.addPlant(this.empForm.value).subscribe({
          next:(val:any) => {
            this._coreService.openSnackBar('Guardado correctamente');
            this._dialogRef.close(true);
          },
          error: (err:any) => {
            console.log(err);
          },
        });
        
      }
    }
  }

}
