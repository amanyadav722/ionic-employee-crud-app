import { Component, OnInit, ViewChild} from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { EditEmployeeModalComponent } from '../edit-employee-modal/edit-employee-modal.component';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  @ViewChild('employeeForm') employeeForm!: NgForm;
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService, private modalController: ModalController) { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  addEmployee(employeeData: Employee) {
    // If your backend generates the id, you might not need to include it here
    const newEmployee = {...employeeData, materialAssigned: []};
    this.employeeService.addEmployee(newEmployee as Employee).subscribe(() => {
      this.loadEmployees();
      this.employeeForm.reset();
    });
  }

  updateEmployee(employee: Employee) {
    this.employeeService.updateEmployee(employee).subscribe(() => {
      this.loadEmployees(); // Reload the list
    });
  }

  deleteEmployee(employeeId: number) {
    this.employeeService.deleteEmployee(employeeId).subscribe(() => {
      this.loadEmployees();
    });
  }

  async editEmployee(employee: Employee) {
    const modal = await this.modalController.create({
      component: EditEmployeeModalComponent,
      componentProps: { employee }
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data?.updatedEmployee) {
      this.updateEmployee(data.updatedEmployee);
    }
  }
  // async editEmployee(employee: Employee) {
  //   const modal = await this.modalController.create({
  //     component: EditEmployeeModalComponent,
  //     componentProps: {
  //       employee: employee
  //     }
  //   });
  
  //   await modal.present();
  
  //   const { data } = await modal.onWillDismiss();
  //   if (data) {
  //     // Handle the updated data, e.g., call a service method to update the data
  //   }
  // }
  // editEmployee(employee: Employee) {
  //   // TODO: Implement the logic to edit an employee
  //   console.log('Edit functionality not yet implemented');
  // }
}

