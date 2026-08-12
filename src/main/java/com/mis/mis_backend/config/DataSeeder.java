package com.mis.mis_backend.config;

import com.mis.mis_backend.auth.Role;
import com.mis.mis_backend.auth.UserAccount;
import com.mis.mis_backend.auth.UserAccountRepository;
import com.mis.mis_backend.department.Department;
import com.mis.mis_backend.department.DepartmentRepository;
import com.mis.mis_backend.hostel.entity.HostelRoom;
import com.mis.mis_backend.hostel.repository.HostelRoomRepository;
import com.mis.mis_backend.library.entity.Book;
import com.mis.mis_backend.library.repository.BookRepository;
import com.mis.mis_backend.student.Student;
import com.mis.mis_backend.student.StudentRepository;
import com.mis.mis_backend.student.StudentStatus;
import com.mis.mis_backend.syllabus.Course;
import com.mis.mis_backend.syllabus.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final HostelRoomRepository roomRepository;
    private final BookRepository bookRepository;

    public DataSeeder(UserAccountRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      DepartmentRepository departmentRepository,
                      StudentRepository studentRepository,
                      CourseRepository courseRepository,
                      HostelRoomRepository roomRepository,
                      BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.departmentRepository = departmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.roomRepository = roomRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) {
        // Always ensure demo accounts exist with known passwords (local/demo convenience).
        upsertDemoUser("admin@mis.edu", "Admin User", Role.ADMIN, "Admin@123", null, null);
        upsertDemoUser("faculty@mis.edu", "Faculty User", Role.FACULTY, "Faculty@123", null, null);
        upsertDemoUser("student@mis.edu", "Student User", Role.STUDENT, "Student@123", null, null);

        if (departmentRepository.count() == 0) {
            Department cs = new Department();
            cs.setDepartmentName("Computer Science");
            cs.setDepartmentCode("CSE");
            departmentRepository.save(cs);
        }

        if (courseRepository.count() == 0) {
            courseRepository.save(new Course("CSE101", "Intro to Programming", 4, "Computer Science", 1));
            courseRepository.save(new Course("CSE201", "Data Structures", 4, "Computer Science", 3));
        }

        if (studentRepository.count() == 0) {
            Student student = new Student();
            student.setEnrollmentNumber("ENR001");
            student.setFirstName("Alex");
            student.setLastName("Student");
            student.setEmail("alex.student@mis.edu");
            student.setPhone("9999999999");
            student.setDateOfBirth(LocalDate.of(2004, 1, 15));
            student.setDepartment("Computer Science");
            student.setSemester(3);
            student.setCgpa(8.2);
            student.setStatus(StudentStatus.ACTIVE);
            studentRepository.save(student);

            userRepository.findByEmailIgnoreCase("student@mis.edu").ifPresent(u -> {
                u.setStudentId(student.getId());
                userRepository.save(u);
            });
        }

        if (roomRepository.count() == 0) {
            HostelRoom room = new HostelRoom();
            room.setRoomNumber("A-101");
            room.setBlockName("A");
            room.setCapacity(2);
            room.setOccupied(0);
            roomRepository.save(room);
        }

        if (bookRepository.count() == 0) {
            Book book = new Book();
            book.setTitle("Clean Code");
            book.setAuthor("Robert C. Martin");
            book.setIsbn("9780132350884");
            book.setQuantity(5);
            bookRepository.save(book);
        }
    }

    private void upsertDemoUser(String email, String name, Role role, String password, Long studentId, Integer facultyId) {
        UserAccount user = userRepository.findByEmailIgnoreCase(email).orElseGet(UserAccount::new);
        user.setEmail(email);
        user.setDisplayName(name);
        user.setRole(role);
        user.setPasswordHash(passwordEncoder.encode(password));
        if (studentId != null) {
            user.setStudentId(studentId);
        }
        if (facultyId != null) {
            user.setFacultyId(facultyId);
        }
        userRepository.save(user);
    }
}
