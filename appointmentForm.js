import { LightningElement, wire } from 'lwc';
import getAvailableAppointmentDates from '@salesforce/apex/AppointmentSlotsController.getAvailableAppointmentDates';
import saveAppointmentDetails from '@salesforce/apex/AppointmentFormController.saveAppointmentDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class AppointmentForm extends NavigationMixin(LightningElement) {
    availableDates;
    selectedDate;
    selectedTime;

    @wire(getAvailableAppointmentDates)
    wiredAvailableDates({ error, data }) {
        if (data) {
            this.availableDates = data.map(dateStr => new Date(dateStr));
        } else if (error) {
            console.error('Error fetching available appointment dates:', error);
        }
    }

    handleDateChange(event) {
        this.selectedDate = event.detail.value;
    }

    handleTimeChange(event) {
        this.selectedTime = event.detail.value;
    }

    handleSubmit(event) {
        event.preventDefault();
     //    console.log('---------------------Selected Date:', this.selectedDate);
  //  console.log('----------------------Selected Time:', this.selectedTime);
   // console.log('------------------------Available Dates:', this.availableDates);
        if (!this.isValidAppointmentTime()) {
            this.showToast('Error', 'Selected appointment time is not within available time slots.', 'error');
            return;
        }

        const fields = event.detail.fields;

        this.template.querySelector('lightning-record-edit-form').submit(fields);

        this.showToast('Success', 'Appointment saved successfully', 'success');

        saveAppointmentDetails({
            appointmentDate: fields.Appointment_Date__c,
            appointmentTime: fields.Appointment_Time__c,
            contactId: fields.Contact__c,
            subject: fields.Subject__c,
            description: fields.Description__c
        })
            .then(result => {
                this.showToast('Success', 'Appointment details saved successfully', 'success');
                
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: result,
                        actionName: 'view'
                    }
                });
            })
           
    }

    isValidAppointmentTime() {
        if (!this.selectedDate || !this.selectedTime) {
            return false;
        }

        const selectedDateTime = new Date(this.selectedDate + ' ' + this.selectedTime);
        
        return this.availableDates.some(validTime => selectedDateTime >= validTime);
    }

    

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}