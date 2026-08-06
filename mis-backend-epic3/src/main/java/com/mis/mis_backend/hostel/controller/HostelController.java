package com.mis.mis_backend.hostel.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mis.mis_backend.hostel.dto.HostelRequest;
import com.mis.mis_backend.hostel.entity.HostelAllocation;
import com.mis.mis_backend.hostel.service.HostelService;

@RestController
@RequestMapping("api/hostels")
public class HostelController {

    private final HostelService hostelService;

    public HostelController(HostelService hostelService) {
        this.hostelService = hostelService;
    }

    @PostMapping
    public ResponseEntity<HostelAllocation> allocateRoom(@RequestBody HostelRequest request) {
        return ResponseEntity.ok(hostelService.allocateRoom(request));
    }

    @GetMapping
    public ResponseEntity<List<HostelAllocation>> getAllAllocations() {
        return ResponseEntity.ok(hostelService.getAllAllocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostelAllocation> getAllocationById(@PathVariable Long id) {
        return hostelService.getAllocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostelAllocation> updateAllocation(
            @PathVariable Long id,
            @RequestBody HostelRequest request) {

        return ResponseEntity.ok(hostelService.updateAllocation(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAllocation(@PathVariable Long id) {

        hostelService.deleteAllocation(id);

        return ResponseEntity.ok("Hostel allocation deleted successfully.");
    }
}