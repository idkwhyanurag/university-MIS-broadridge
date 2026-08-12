package com.mis.mis_backend.grade;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping
    public ResponseEntity<List<Grade>> list() {
        return ResponseEntity.ok(gradeService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grade> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(gradeService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Grade> create(@RequestBody Grade grade) {
        return ResponseEntity.ok(gradeService.create(grade));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Grade> update(@PathVariable Integer id, @RequestBody Grade grade) {
        return ResponseEntity.ok(gradeService.update(id, grade));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        gradeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
