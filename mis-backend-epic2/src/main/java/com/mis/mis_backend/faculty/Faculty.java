package com.mis.mis_backend.faculty;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="faculty")
public class Faculty {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 @Column(name="faculty_id")
 private Integer facultyId;
 @Column(name="department_id",nullable=false)
 private Integer departmentId;
 @Column(name="first_name",nullable=false)
 private String firstName;
 @Column(name="last_name",nullable=false)
 private String lastName;
 @Column(nullable=false,unique=true)
 private String email;
 private String phone;
 @Column(nullable=false)
 private String designation;
 @Column(name="joining_date")
 private LocalDate joiningDate;

 public Faculty(){}
 public Integer getFacultyId(){return facultyId;}
 public Integer getDepartmentId(){return departmentId;}
 public void setDepartmentId(Integer departmentId){this.departmentId=departmentId;}
 public String getFirstName(){return firstName;}
 public void setFirstName(String firstName){this.firstName=firstName;}
 public String getLastName(){return lastName;}
 public void setLastName(String lastName){this.lastName=lastName;}
 public String getEmail(){return email;}
 public void setEmail(String email){this.email=email;}
 public String getPhone(){return phone;}
 public void setPhone(String phone){this.phone=phone;}
 public String getDesignation(){return designation;}
 public void setDesignation(String designation){this.designation=designation;}
 public LocalDate getJoiningDate(){return joiningDate;}
 public void setJoiningDate(LocalDate joiningDate){this.joiningDate=joiningDate;}
}