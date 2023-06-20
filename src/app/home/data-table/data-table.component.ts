import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Plant } from 'src/app/interfaces/backResponses';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource, } from '@angular/material/table';
import { CoreService } from 'src/app/core/core.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'lightLevel', 'waterRequirment', 'humidityLevel', 'habitat', 'stock', 'action'];
  dataSource!: MatTableDataSource<Plant>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    public apiService: ApiService,
    private _dialog: MatDialog,
    private _empService: ApiService,
    private _coreService: CoreService
    
  ) {}

  ngOnInit(): void {
    this.getPlantList();
  }

  getPlantList(){
    this._empService.getPlants().subscribe({
      next:(res) => { 
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator= this.paginator;
      },
      error:console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddEditEmpForm(){
    const dialogRef = this._dialog.open(ModalComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getPlantList();
        }
      }
    });
  }

  deletePlant(id: number){
    this._empService.deletePlant(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Planta borrada', 'done');
        this.getPlantList();
      },
      error:console.log,
    });
  }

  openEditForm(data:any){
    const dialogRef = this._dialog.open(ModalComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getPlantList();
        }
      }
    });
  }

}
