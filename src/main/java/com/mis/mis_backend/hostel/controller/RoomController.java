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

import com.mis.mis_backend.hostel.dto.RoomRequest;
import com.mis.mis_backend.hostel.entity.HostelRoom;
import com.mis.mis_backend.hostel.service.HostelService;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final HostelService hostelService;

    public RoomController(HostelService hostelService) {
        this.hostelService = hostelService;
    }

    @GetMapping
    public ResponseEntity<List<HostelRoom>> getAll() {
        return ResponseEntity.ok(hostelService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostelRoom> getById(@PathVariable Long id) {
        return ResponseEntity.ok(hostelService.getRoomById(id));
    }

    @PostMapping
    public ResponseEntity<HostelRoom> create(@RequestBody RoomRequest request) {
        return ResponseEntity.ok(hostelService.createRoom(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostelRoom> update(@PathVariable Long id, @RequestBody RoomRequest request) {
        return ResponseEntity.ok(hostelService.updateRoom(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        hostelService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
