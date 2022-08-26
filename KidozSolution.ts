//my code doesn't address security risks
 interface AddressBook {
    emp_id: number;
    first: string;
    last: string;
    email: string;
}

 interface Payroll {
    emp_id: number;
    vacationDays: number;
}

interface Employee {
    id: number; 
    name: string;
    startDate: Date;
    bonusElidgble: boolean;
  }


 interface EmailApi {
    createBatch(): number
    queueEmail(batchId: number, email: string, subject: string, body: string): void
    flushBatch(batchId: number): void

}

//take the idea of the finds outofthe loop...
//make maps instead
const addressByEmpId = Object.fromEntries(
    emp_Addresses.map (
         ({ emp_id, ...rest }) => [emp_id, { emp_id, ... rest }])
    );
const employeesById = Object.fromEntries(
    comp_Employees.map (
        ({ id, ...rest }) => [id, { id, ... rest }])
    );

//create some infile employee data:
//comp_Employees : Employee[] =[allthe data]  

//create some infile address data:
//emp_Addresses : AddressBook[] =[allthe data]  

//this file will now run due to lack of data

function yearsSince(startDate: Date): number {
    const millisecondsPerYear = 365 * 24 * 60 * 60 * 1000;
    const today = new Date();
    return Math.round( today.getTime() - startDate.getTime() ) / millisecondsPerYear; 
    //couldbe math.trunc too if you do not want it rounded...
}


function calculateVacation(payrollInfo: Payroll, empInfo: Employee) {
    //check if statement
    //if undefined set to 0, else run method years since
    var yearsEmployed = empInfo === undefined ? 0 : yearsSince(empInfo.startDate);
    if (empInfo.bonusElidgble){
    const newVacationBalance = yearsEmployed + payrollInfo.vacationDays;
    return [empInfo.name, yearsEmployed, newVacationBalance];
}
    yearsEmployed = 0; 
   
}


//next we want to grant the vacay thro the email...
 type Index<T> = Record<string, T>;
 function grantVacationEmail( //not async
    emailApi: EmailApi,
    payrollInfo: Payroll,
    addresses: Index<AddressBook>,//lets use our interfaces!
    employees: Index<Employee>,

 ){
    let emailBatchId = emailApi.createBatch();
    const addressInfo = addresses[payrollInfo.emp_id];
    //CHECK if there is something there
    if (addressInfo !== undefined) {
        const [empInfoName, yearsEmployed, newVacationBalance] = calculateVacation( payrollInfo, employees[payrollInfo.emp_id] );
        emailApi.queueEmail (
          emailBatchId,
          addressInfo.email,
          "Good news!",
          `Dear ${empInfoName},\n`  +
          `based on your ${yearsEmployed} years of employment, you have been granted ${yearsEmployed} days of vacation, bringing your total to ${newVacationBalance}`);
    }
     emailApi.flushBatch(emailBatchId);
 }

 function grantVacation (
    emailApi: EmailApi,
    payroll: Payroll[],
    addresses: Index<AddressBook>,
    employees: Index<Employee>) {

    payroll.forEach (payrollInfo => {
        grantVacationEmail(emailApi, payrollInfo, addresses, employees);
    });
}


