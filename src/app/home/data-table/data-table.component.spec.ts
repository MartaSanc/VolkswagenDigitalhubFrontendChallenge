import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { ApiService } from 'src/app/services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CoreService } from 'src/app/core/core.service';
import { of, throwError } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { MOCK_LISTADO_PLANTA } from 'src/app/mocks/plants.mock';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let coreService: jasmine.SpyObj<CoreService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getPlants', 'deletePlant']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);
    const coreServiceSpy = jasmine.createSpyObj('CoreService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      declarations: [DataTableComponent],
      imports: [MatTableModule, MatPaginatorModule, MatSortModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: CoreService, useValue: coreServiceSpy },
      ],
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    coreService = TestBed.inject(CoreService) as jasmine.SpyObj<CoreService>;

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getPlantList', () => {
      spyOn(component, 'getPlantList');
      component.ngOnInit();
      expect(component.getPlantList).toHaveBeenCalled();
    });
  });

  describe('getPlantList', () => {
    it('should set the dataSource with the received data', () => {
      apiService.getPlants.and.returnValue(of(MOCK_LISTADO_PLANTA));
      component.getPlantList();
      expect(apiService.getPlants).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(MOCK_LISTADO_PLANTA);
    });

    it('should call sort and paginator methods of the dataSource', () => {
      apiService.getPlants.and.returnValue(of(MOCK_LISTADO_PLANTA));
    });

    it('should log an error if the request fails', () => {
      const error = 'Error occurred';
      apiService.getPlants.and.returnValue(throwError(error));
      spyOn(console, 'log');
      component.getPlantList();
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('applyFilter', () => {
    it('should set the filter value and call firstPage method of the dataSource.paginator', () => {
      const filterValue = 'filter';
      const event = { target: { value: filterValue } } as unknown as Event;
      component.dataSource.paginator = component.paginator;
      spyOn(component.dataSource.paginator, 'firstPage');
      component.applyFilter(event);
      expect(component.dataSource.filter).toBe(filterValue);
      expect(component.dataSource.paginator?.firstPage).toHaveBeenCalled();
    });
  });

  describe('openAddEditEmpForm', () => {
    it('should open the dialog and call getPlantList if the dialog is closed with a truthy value', () => {
      const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRef.afterClosed.and.returnValue(of(true));
      dialog.open.and.returnValue(dialogRef);
      spyOn(component, 'getPlantList');
      component.openAddEditEmpForm();
      expect(dialog.open).toHaveBeenCalled();
      expect(component.getPlantList).toHaveBeenCalled();
    });
  });

  describe('deletePlant', () => {
    it('should call deletePlant method of the ApiService and call openSnackBar and getPlantList methods', () => {
      const plantId = 1;
      apiService.deletePlant.and.returnValue(of({}));
      spyOn(component, 'getPlantList');
      component.deletePlant(plantId);
      expect(apiService.deletePlant).toHaveBeenCalledWith(plantId);
      expect(coreService.openSnackBar).toHaveBeenCalledWith('Planta borrada', 'done');
      expect(component.getPlantList).toHaveBeenCalled();
    });

    it('should log an error if the request fails', () => {
      const plantId = 1;
      const error = 'Error occurred';
      apiService.deletePlant.and.returnValue(throwError(error));
      spyOn(console, 'log');
      component.deletePlant(plantId);
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('openEditForm', () => {
    it('should open the dialog, call getPlantList if the dialog is closed with a truthy value, and pass the data to the dialog', () => {
      const plantData = { id: 1, name: 'Plant 1' };
      const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRef.afterClosed.and.returnValue(of(true));
      dialog.open.and.returnValue(dialogRef);
      spyOn(component, 'getPlantList');
      component.openEditForm(plantData);
      expect(dialog.open).toHaveBeenCalledWith(ModalComponent, {
        data: plantData,
      });
      expect(component.getPlantList).toHaveBeenCalled();
    });
  });
});
