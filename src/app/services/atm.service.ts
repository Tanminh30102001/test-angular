import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast.service'; 
@Injectable({
  providedIn: 'root'
})
export class AtmService {
  private apiUrl = 'https://674eb6b3bb559617b26c56d5.mockapi.io/api/v1';
  constructor(private toastService: ToastService) {
    
   }
  async getAllATM() {
    try {
      const response = await axios.get(this.apiUrl+'/ATM');
      localStorage.setItem('atmData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching ATMs:', error);
      throw error;
    }
  }
  async getPaginatedData(pageIndex: number, pageSize: number): Promise<{data:any[],totalItems: number}> {
   
    const storedData = localStorage.getItem('atmData');
    if (!storedData) {
      await this.getAllATM();
      return await this.getPaginatedData(pageIndex, pageSize);
    }
    this.getAllATM();
    const data = JSON.parse(storedData); 
    const sortedData = data.sort((a: any, b: any) => b.id - a.id);
    const totalItems = sortedData.length;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return Promise.resolve({ data: sortedData.slice(startIndex, endIndex), totalItems });
  }
 async deleteATM(id:number): Promise<Observable<any>> {
  try {
    const response = await axios.delete(`${this.apiUrl}/ATM/${id}`);
    this.toastService.show('Delete Success', 'Close', 5000, 'success');
    return response.data;
  } catch (error: any) {
    this.toastService.show('Delete failed. Please Try Again', 'Close', 5000, 'error');
    throw new Error(`Failed to delete ATM: ${error.message}`); 
  }
  }
  async updateATM(id: number, data: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}/ATM/${id}`, data);
      this.toastService.show('Update ATM Success', 'Close', 5000, 'success');
      return response.data;
    } catch (error: any) {
      this.toastService.show('Update failed. Please Try Again', 'Close', 5000, 'error');
      throw new Error(`Failed to update ATM: ${error.message}`); 
    }
  }
  async addATM( data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/ATM`, data);
      this.toastService.show('Add new ATM Success', 'Close', 5000, 'success');

      return response.data;
    } catch (error: any) {
      this.toastService.show('Delete ATM failed. Please Try Again', 'Close', 5000, 'error');
      throw new Error(`Failed to add ATM: ${error.message}`); 
    }
  }
  
}
