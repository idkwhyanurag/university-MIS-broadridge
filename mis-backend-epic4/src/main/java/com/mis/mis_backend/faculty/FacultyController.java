package com.mis.mis_backend.faculty;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/faculty")
public class FacultyController{
 private final FacultyService facultyService;
 public FacultyController(FacultyService facultyService){this.facultyService=facultyService;}
 @GetMapping
 public List<Faculty> getAllFaculty(){return facultyService.getAllFaculty();}
 @PostMapping
 public Faculty createFaculty(@RequestBody Faculty faculty){return facultyService.createFaculty(faculty);}
}