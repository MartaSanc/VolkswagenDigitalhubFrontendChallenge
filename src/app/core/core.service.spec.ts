import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoreService } from './core.service';

describe('CoreService', () => {
  let service: CoreService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    
    TestBed.configureTestingModule({
      providers: [
        CoreService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });
    
    service = TestBed.inject(CoreService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openSnackBar', () => {
    it('should call the open method of MatSnackBar with the provided message and default action', () => {
      const message = 'Test message';
      const action = 'hecho!';
      service.openSnackBar(message);
      expect(snackBar.open).toHaveBeenCalledWith(message, action, {
        duration: 2000,
        verticalPosition: 'top'
      });
    });

    it('should call the open method of MatSnackBar with the provided message and custom action', () => {
      const message = 'Test message';
      const action = 'Custom action';
      service.openSnackBar(message, action);
      expect(snackBar.open).toHaveBeenCalledWith(message, action, {
        duration: 2000,
        verticalPosition: 'top'
      });
    });
  });
});