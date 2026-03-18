package com.smartpetcare.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Collections;
import java.util.UUID;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "SmartPetCare";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Value("${GOOGLE_CALENDAR_ID}")
    private String calendarId;

    private Calendar getCalendarService() throws Exception {

        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

        InputStream in = GoogleCalendarService.class.getResourceAsStream("/google-credentials.json");

        GoogleCredential credential = GoogleCredential.fromStream(in)
                .createScoped(Collections.singleton(CalendarScopes.CALENDAR));

        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public String createMeetLink(String petName, String vetName, String dateStr, String timeStr) {

        try {

            Calendar service = getCalendarService();

            Event event = new Event()
                    .setSummary("Vet Consultation: " + petName + " & Dr. " + vetName)
                    .setDescription("Online Video Consultation via SmartPetCare.");

            String isoDateTime = dateStr + "T" + timeStr + ":00.000+05:30";

            DateTime startDateTime = new DateTime(isoDateTime);
            EventDateTime start = new EventDateTime()
                    .setDateTime(startDateTime)
                    .setTimeZone("Asia/Kolkata");

            event.setStart(start);

            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTimeInMillis(startDateTime.getValue());
            cal.add(java.util.Calendar.MINUTE, 30);

            DateTime endDateTime = new DateTime(cal.getTimeInMillis());

            EventDateTime end = new EventDateTime()
                    .setDateTime(endDateTime)
                    .setTimeZone("Asia/Kolkata");

            event.setEnd(end);

            ConferenceSolutionKey conferenceSKey =
                    new ConferenceSolutionKey().setType("hangoutsMeet");

            CreateConferenceRequest createConferenceReq =
                    new CreateConferenceRequest()
                            .setRequestId(UUID.randomUUID().toString())
                            .setConferenceSolutionKey(conferenceSKey);

            ConferenceData conferenceData =
                    new ConferenceData().setCreateRequest(createConferenceReq);

            event.setConferenceData(conferenceData);

            Event createdEvent = service.events()
                    .insert(calendarId, event)
                    .setConferenceDataVersion(1)
                    .execute();

            return createdEvent.getHangoutLink();

        } catch (Exception e) {

            System.err.println("Error generating Meet link: " + e.getMessage());
            e.printStackTrace();

            return null;
        }
    }
}