package com.pvpsit.QREventManager.dto;

import com.pvpsit.QREventManager.entity.Event;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegistrationDto {

        private Long eventId;
        private String studentName;
        private String studentEmail;
        private String rollNo;


}
