import { Component, inject, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AtmService } from '../services/atm.service';
import { MatPaginator } from '@angular/material/paginator';
import { DialogCommonComponent } from '../dialog-common/dialog-common.component';

@Component({
  selector: 'app-main',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginator,
    CommonModule,
    DialogCommonComponent,
    MatDialogModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent implements OnInit, OnChanges {
  readonly dialog = inject(MatDialog);
  @Input() searchQuery: string = '';
  totalItems:number=0;
  pageSize: number = 10;
  pageIndex: number = 0;
  atmData = [];
  atms: any[] = []; 
  filteredData: any[] = [];
  displayedColumns: string[] = [
    'ATMName',
    'Manufacturer',
    'type',
    'SerialNumber',
    'image',
    'actions',
  ];
  dataSource: any[] = [];
  selectedAtm: any = null;
  isDeleteModalOpen: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private atmService: AtmService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(): void {
    this.filterData(this.searchQuery);
  }
 async loadData(): Promise<void> {
  try {
    const result = await this.atmService.getPaginatedData(this.pageIndex, this.pageSize);
    if (result && Array.isArray(result.data)) {
      this.filteredData = result.data; 
      this.totalItems=result.totalItems
      console.log(this.filteredData); 
    } else {
      console.error("Dữ liệu trả về không hợp lệ");
    }
  } catch (error) {
    console.error( error);
  }
  }

  filterData(searchQuery: string): void {
    if (searchQuery) {
      this.filteredData = this.filteredData.filter(atm =>
        atm.ATMName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        atm.Manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        atm.SerialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        atm.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      this.filteredData = [...this.filteredData]; 
    }
    if(searchQuery==''){
      this.loadData()
    }
    this.totalItems = this.filteredData.length;
  }


  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex; 
    this.pageSize = event.pageSize;  
    this.loadData(); 
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DialogCommonComponent, {
      width: '400px',
      position: { top: '20px' },
      data: {
        title: 'Add New ATM',
        type: 'add',
        onSubmit: (formData: any) => this.handleAddSubmit(formData),
      },
    });
  }

  async handleAddSubmit(formData: any): Promise<void> {
    try {
      const newAtm = await this.atmService.addATM(formData);
      this.dataSource = [...this.dataSource, newAtm];
      this.filteredData = [...this.dataSource]; // Cập nhật dữ liệu đã lọc
      localStorage.setItem('atmData', JSON.stringify(this.dataSource));
    } catch (error) {
      console.error('Error adding ATM:', error);
    }
  }

  openEditDialog(atm: any): void {
    const dialogRef = this.dialog.open(DialogCommonComponent, {
      width: '400px',
      position: { top: '20px' },
      data: {
        title: 'Edit ATM',
        type: 'edit',
        initialData: atm,
        onSubmit: (formData: any) => this.handleEditSubmit(atm, formData),
      },
    });
  }

  async handleEditSubmit(atm: any, formData: any): Promise<void> {
    try {
      await this.atmService.updateATM(atm.id, formData);
      const index = this.dataSource.findIndex(item => item.id === atm.id);
      if (index !== -1) {
        this.dataSource[index] = { ...atm, ...formData };
        this.filteredData = [...this.dataSource]; // Cập nhật dữ liệu đã lọc
        localStorage.setItem('atmData', JSON.stringify(this.dataSource));
      }
    } catch (error) {
      console.error('Error editing ATM:', error);
    }
  }

  openDeleteDialog(atm: any): void {
    this.dialog.open(DialogCommonComponent, {
      width: '400px',
      data: {
        title: 'Delete ATM',
        type: 'delete',
        initialData: atm,
        onSubmit: () => this.handleDelete(atm),
      },
    });
  }

  async handleDelete(atm: any): Promise<void> {
    try {
      await this.atmService.deleteATM(atm.id);
      this.dataSource = this.dataSource.filter(item => item.id !== atm.id);
      this.filteredData = [...this.dataSource]; 
      localStorage.setItem('atmData', JSON.stringify(this.dataSource));
    } catch (error) {
      console.error('Error deleting ATM:', error);
    }
  }
  exportData(): void {
    const data = this.filteredData;
    const csvContent = this.convertToCSV(data);
    this.downloadCSV(csvContent);
  }

  convertToCSV(data: any[]): string {
    const header = ['ATM Name', 'Manufacturer', 'Type', 'Serial Number', 'Image URL'];
    const rows = data.map(item => [
      item.ATMName, 
      item.Manufacturer, 
      item.type, 
      item.SerialNumber, 
      item.image
    ]);

    const csv = [header, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }

  downloadCSV(csvContent: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'atm_data.csv';
    link.click();
  }
}
