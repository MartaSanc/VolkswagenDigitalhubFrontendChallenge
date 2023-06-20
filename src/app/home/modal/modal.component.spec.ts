
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';
import { CoreService } from 'src/app/core/core.service';
import { ApiService } from 'src/app/services/api/api.service';
import { of, throwError } from 'rxjs';
import { MOCK_LISTADO_PLANTA } from 'src/app/mocks/plants.mock';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ModalComponent>>;
  let apiService: jasmine.SpyObj<ApiService>;
  let coreService: jasmine.SpyObj<CoreService>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['addPlant', 'updatePlant']);
    const coreServiceSpy = jasmine.createSpyObj('CoreService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: CoreService, useValue: coreServiceSpy },
        { provide: FormBuilder, useValue: formBuilder },
      ],
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ModalComponent>>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    coreService = TestBed.inject(CoreService) as jasmine.SpyObj<CoreService>;

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should patch the form with the received data', () => {
      const formData = { name: 'Ficus Moclame' };
      component.data = formData;
      component.ngOnInit();
      expect(component.empForm.value).toEqual(formData);
    });
  });

  describe('onFormSubmit', () => {
    beforeEach(() => {
      component.empForm = formBuilder.group(MOCK_LISTADO_PLANTA);
    });

    it('should call updatePlant method of the ApiService and close the dialog if data is present', () => {
      const responseData = { id: 2 };
      apiService.updatePlant.and.returnValue(of(responseData));
      component.data = { id: 2  };
      component.onFormSubmit();
      expect(apiService.updatePlant).toHaveBeenCalledWith(1, component.empForm.value);
      expect(coreService.openSnackBar).toHaveBeenCalledWith('Editado correctamente');
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should call addPlant method of the ApiService and close the dialog if data is not present', () => {
      const responseData = { id: 2 };
      apiService.addPlant.and.returnValue(of(responseData));
      component.onFormSubmit();
      expect(apiService.addPlant).toHaveBeenCalledWith(component.empForm.value);
      expect(coreService.openSnackBar).toHaveBeenCalledWith('Guardado correctamente');
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should not make API calls or close the dialog if the form is invalid', () => {
      component.empForm.controls['name'].setValue('');
      component.onFormSubmit();
      expect(apiService.updatePlant).not.toHaveBeenCalled();
      expect(apiService.addPlant).not.toHaveBeenCalled();
      expect(coreService.openSnackBar).not.toHaveBeenCalled();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should log an error if an error occurs during the API call', () => {
      const error = 'Error occurred';
      apiService.addPlant.and.returnValue(throwError(error));
      spyOn(console, 'log');
      component.onFormSubmit();
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });
});
