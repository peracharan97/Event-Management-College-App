package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.entity.Student;
import com.pvpsit.QREventManager.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
@AllArgsConstructor
@Service
public class StudentServiceImplementation implements StudentService {
    private StudentRepository studentRepository;
    @Override
    public String studentRegister(Student student) {
        try{
            studentRepository.save(student);
            return "Created";

        } catch (Exception e) {
            return "Error"+e;
        }

    }
}
