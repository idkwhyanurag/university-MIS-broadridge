package com.mis.mis_backend.examination;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
public class ExaminationController {

    private final ExaminationService examinationService;

    public ExaminationController(ExaminationService examinationService) {
        this.examinationService = examinationService;
    }

    @GetMapping
    public ResponseEntity<List<Examination>> list() {
        return ResponseEntity.ok(examinationService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Examination> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(examinationService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Examination> create(@RequestBody Examination examination) {
        return ResponseEntity.ok(examinationService.create(examination));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Examination> update(@PathVariable Integer id, @RequestBody Examination examination) {
        return ResponseEntity.ok(examinationService.update(id, examination));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        examinationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
