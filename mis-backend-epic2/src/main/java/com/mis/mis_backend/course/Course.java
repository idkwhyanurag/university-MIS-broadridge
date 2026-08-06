package com.mis.mis_backend.course;
import jakarta.persistence.*;
@Entity @Table(name="courses")
public class Course{
@Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="course_id") private Integer courseId;
@Column(name="department_id",nullable=false) private Integer departmentId;
@Column(name="course_name",nullable=false) private String courseName;
@Column(nullable=false) private String degree;
@Column(nullable=false) private Integer duration;
public Course(){} public Integer getCourseId(){return courseId;}
public Integer getDepartmentId(){return departmentId;} public void setDepartmentId(Integer v){departmentId=v;}
public String getCourseName(){return courseName;} public void setCourseName(String v){courseName=v;}
public String getDegree(){return degree;} public void setDegree(String v){degree=v;}
public Integer getDuration(){return duration;} public void setDuration(Integer v){duration=v;}
}