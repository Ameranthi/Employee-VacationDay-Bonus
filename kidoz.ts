//original code provided by Kidoz during phase 2 of the application process

// are these private? //employee information is too accessible
export interface AddressBook {
    emp_id: string|null;//should never be null, is a pk and necessary to be unique
    first: string;
    last: string;
    email: string;
}
// are these private? //employee information is too accessible
export interface Payroll {
    emp_id: string; //why is it a string?
    vacationDays: number;
}

interface Employee {
    id: string; // why is it a string?
    name: string;
    startDate: Date;
    endDate: Date|null; 
    //potential needed:
    //InitialHireDate
    //yearsEmployed
    //BonusEligible
  }


export interface EmailApi {
    createBatch(): number
    queueEmail(batchId: number, email: string, subject: string, body: string): void
    flushBatch(batchId: number): Promise<void>
}

//doesn't allow for people who are 1 day from having another extra vacation dayto recieve the email/extra days.
//takes about 2 weeks to approve vacation (?) soit should check for within a certain allowance.
function yearsSince(startDate: Date, endDate: Date): number {
    const millisecondsPerYear = 365 * 24 * 60 * 60 * 1000;
    return ( endDate.getTime() - startDate.getTime() ) / millisecondsPerYear; //only good for people who no longer work here
}


/**
 * We haved decided to grant bonus vacation to every employee, 1 day per year of experience
 * we need to email them a notice.
 */

//declared but never used, does not meet intended function
async function grantVacation(
    emailApi: EmailApi,
    payroll: Payroll[],
    addresses: AddressBook[],
    employees: Employee[],
) { // sycnchronous code wrapped in a promise will reap no benefits
    let emailBatchId = emailApi.createBatch();

    //These are arrays are not ideal. They would make you go through the information multiple times. 
    //for in would make this slower 
    for (var index in payroll) {//forin -- this can cause it to be slower, notby much but for in will iterate over our objs enumerables
        let payrollInfo = payroll[index];

        //these two finds would slow down the loop significantly. Should be out entirely. 
        let addressInfo = addresses.find(x => x.emp_id == payrollInfo.emp_id);
        let empInfo = employees.find(x => x.id == payrollInfo.emp_id);

        //setting today each loop will also hinder performance
        let today = new Date()//should be inthe yearSincefuntion 
        
        //setting the end date as the start date. Logic error
        //doesn't need to be a constant
        const yearsEmployed = yearsSince(empInfo.endDate, today);//should not need to pass in today.

        //this would not be good for reusability. 
        let newVacationBalance = yearsEmployed + payrollInfo.vacationDays;

        emailApi.queueEmail(
            emailBatchId,
            addressInfo.email,
            "Good news!",
            `Dear ${empInfo.name}\n` +
            `based on your ${yearsEmployed} years of employment, you have been granted ${yearsEmployed} days of vacation, bringing your total to ${newVacationBalance}`
        );
    }
    await emailApi.flushBatch(emailBatchId);
}