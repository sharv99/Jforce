public with sharing class AppointmentFormController {
    @AuraEnabled
    public static void saveAppointmentDetails(Date appointmentDate, Time appointmentTime, Id contactId, String subject, String description) {
        Appointment_Details__c newAppointment = new Appointment_Details__c();
        newAppointment.Appointment_Date__c = appointmentDate;
        newAppointment.Appointment_Time__c = appointmentTime;
        newAppointment.Contact__c = contactId;
        newAppointment.Subject__c = subject;
        newAppointment.Description__c = description;
        
        insert newAppointment;
    }
}