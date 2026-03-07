package com.pvpsit.QREventManager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    private String fullName;
    private String collegeType;
    private String rollNo;
    private String department;
    private Integer semester;
    private String phoneNumber;
}
