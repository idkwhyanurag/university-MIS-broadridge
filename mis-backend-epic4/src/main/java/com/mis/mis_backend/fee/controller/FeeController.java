package com.mis.mis_backend.fee.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mis.mis_backend.fee.dto.FeeRequest;
import com.mis.mis_backend.fee.entity.Fee;
import com.mis.mis_backend.fee.service.FeeService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/fees")
public class FeeController {
    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @PostMapping
    public ResponseEntity<Fee> addFee(@RequestBody FeeRequest request) {
        return ResponseEntity.ok(feeService.addFee(request));
    }

    @GetMapping
    public ResponseEntity<List<Fee>> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFeeById(@PathVariable Long id) {
        return feeService.getFeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(
            @PathVariable Long id,
            @RequestBody FeeRequest request) {

        return ResponseEntity.ok(feeService.updateFee(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFee(@PathVariable Long id) {

        feeService.deleteFee(id);

        return ResponseEntity.ok("Fee deleted successfully.");
    }
}