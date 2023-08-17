public with sharing class AppointmentSlotsController {
    @AuraEnabled(cacheable=true)
    public static List<Date> getAvailableAppointmentDates() {
        List<Date> availableDates = new List<Date>();

        List<Appointment_Slots__c> activeSlots = [
            SELECT Appointment_Date__c
            FROM Appointment_Slots__c
            WHERE isActive__c = true
            ORDER BY Appointment_Date__c
        ];

        for (Appointment_Slots__c slot : activeSlots) {
            availableDates.add(slot.Appointment_Date__c);
        }

        return availableDates;
    }
}