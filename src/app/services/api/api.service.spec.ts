import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { Plant } from 'src/app/interfaces/backResponses';
import { of } from 'rxjs';
import { MOCK_LISTADO_PLANTA } from 'src/app/mocks/plants.mock';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPlants', () => {
    it('should make a GET request to the plants endpoint and return the response', () => {
      const expectedResponse: Plant[] = MOCK_LISTADO_PLANTA;
      service.getPlants().subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
      const req = httpTestingController.expectOne('http://localhost:3000/plants');
      expect(req.request.method).toBe('GET');
      req.flush(expectedResponse);
    });
  });

  describe('addPlant', () => {
    it('should make a POST request to the plants endpoint with the provided data and return the response', () => {
      const plantData = { name: 'Plant 1' };
      const expectedResponse = { id: 1, name: 'Plant 1' };
      service.addPlant(plantData).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
      const req = httpTestingController.expectOne('http://localhost:3000/plants');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(plantData);
      req.flush(expectedResponse);
    });
  });

  describe('deletePlant', () => {
    it('should make a DELETE request to the specific plant endpoint and return the response', () => {
      const plantId = 1;
      const expectedResponse = { message: 'Plant deleted' };
      service.deletePlant(plantId).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
      const req = httpTestingController.expectOne(`http://localhost:3000/plants/${plantId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(expectedResponse);
    });
  });

  describe('updatePlant', () => {
    it('should make a PUT request to the specific plant endpoint with the provided data and return the response', () => {
      const plantId = 1;
      const plantData = { name: 'Plant 1' };
      const expectedResponse = { id: 1, name: 'Updated Plant 1' };
      service.updatePlant(plantId, plantData).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
      const req = httpTestingController.expectOne(`http://localhost:3000/plants/${plantId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(plantData);
      req.flush(expectedResponse);
    });
  });
});
