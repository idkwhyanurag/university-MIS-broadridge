package com.mis.mis_backend.hostel.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mis.mis_backend.hostel.dto.HostelRequest;
import com.mis.mis_backend.hostel.entity.HostelAllocation;
import com.mis.mis_backend.hostel.entity.HostelRoom;
import com.mis.mis_backend.hostel.repository.HostelAllocationRepository;
import com.mis.mis_backend.hostel.repository.HostelRoomRepository;

@Service
public class HostelService {

    private final HostelAllocationRepository allocationRepository;
    private final HostelRoomRepository roomRepository;

    public HostelService(HostelAllocationRepository allocationRepository,
                         HostelRoomRepository roomRepository) {
        this.allocationRepository = allocationRepository;
        this.roomRepository = roomRepository;
    }

    public HostelAllocation allocateRoom(HostelRequest request) {

        HostelRoom room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        HostelAllocation allocation = new HostelAllocation();
        allocation.setStudentId(request.getStudentId());
        allocation.setRoom(room);
        allocation.setAllocationDate(request.getAllocationDate());

        return allocationRepository.save(allocation);
    }

    public List<HostelAllocation> getAllAllocations() {
        return allocationRepository.findAll();
    }

    public Optional<HostelAllocation> getAllocationById(Long id) {
        return allocationRepository.findById(id);
    }

    public HostelAllocation updateAllocation(Long id, HostelRequest request) {

        HostelAllocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Allocation not found"));

        HostelRoom room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        allocation.setStudentId(request.getStudentId());
        allocation.setRoom(room);
        allocation.setAllocationDate(request.getAllocationDate());

        return allocationRepository.save(allocation);
    }

    public void deleteAllocation(Long id) {
        allocationRepository.deleteById(id);
    }
}