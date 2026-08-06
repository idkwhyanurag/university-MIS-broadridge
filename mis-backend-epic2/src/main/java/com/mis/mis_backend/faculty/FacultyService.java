package com.mis.mis_backend.faculty;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class FacultyService{
 private final FacultyRepository facultyRepository;
 public FacultyService(FacultyRepository facultyRepository){this.facultyRepository=facultyRepository;}
 public List<Faculty> getAllFaculty(){return facultyRepository.findAll();}
 public Faculty createFaculty(Faculty faculty){return facultyRepository.save(faculty);}
}