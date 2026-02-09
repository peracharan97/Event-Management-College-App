package com.pvpsit.QREventManager.controller;

import com.pvpsit.QREventManager.entity.Student;
import com.pvpsit.QREventManager.service.StudentServiceImplementation;
import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class StudentController {
    private StudentServiceImplementation studentServiceImplementation;
    @PostMapping("/register")
    public String registerStudent(@RequestBody Student student){
        return studentServiceImplementation.studentRegister(student);
    }

}
