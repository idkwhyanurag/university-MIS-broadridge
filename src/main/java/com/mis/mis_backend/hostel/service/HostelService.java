package com.mis.mis_backend.hostel.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.mis.mis_backend.hostel.dto.HostelRequest;
import com.mis.mis_backend.hostel.dto.RoomRequest;
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

    public HostelRoom createRoom(RoomRequest request) {
        HostelRoom room = new HostelRoom();
        room.setRoomNumber(request.getRoomNumber());
        room.setBlockName(request.getBlockName());
        room.setCapacity(request.getCapacity() != null ? request.getCapacity() : 1);
        room.setOccupied(request.getOccupied() != null ? request.getOccupied() : 0);
        return roomRepository.save(room);
    }

    public List<HostelRoom> getAllRooms() {
        return roomRepository.findAll();
    }

    public HostelRoom getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
    }

    public HostelRoom updateRoom(Long id, RoomRequest request) {
        HostelRoom room = getRoomById(id);
        room.setRoomNumber(request.getRoomNumber());
        room.setBlockName(request.getBlockName());
        if (request.getCapacity() != null) {
            room.setCapacity(request.getCapacity());
        }
        if (request.getOccupied() != null) {
            room.setOccupied(request.getOccupied());
        }
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }
        roomRepository.deleteById(id);
    }

    public HostelAllocation allocateRoom(HostelRequest request) {
        HostelRoom room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        if (room.getOccupied() >= room.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Room is at full capacity");
        }

        HostelAllocation allocation = new HostelAllocation();
        allocation.setStudentId(request.getStudentId());
        allocation.setRoom(room);
        allocation.setAllocationDate(request.getAllocationDate());

        HostelAllocation saved = allocationRepository.save(allocation);
        room.setOccupied(room.getOccupied() + 1);
        roomRepository.save(room);
        return saved;
    }

    public List<HostelAllocation> getAllAllocations() {
        return allocationRepository.findAll();
    }

    public Optional<HostelAllocation> getAllocationById(Long id) {
        return allocationRepository.findById(id);
    }

    public HostelAllocation updateAllocation(Long id, HostelRequest request) {
        HostelAllocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Allocation not found"));

        HostelRoom oldRoom = allocation.getRoom();
        HostelRoom newRoom = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        if (!oldRoom.getId().equals(newRoom.getId())) {
            if (newRoom.getOccupied() >= newRoom.getCapacity()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Room is at full capacity");
            }
            oldRoom.setOccupied(Math.max(0, oldRoom.getOccupied() - 1));
            newRoom.setOccupied(newRoom.getOccupied() + 1);
            roomRepository.save(oldRoom);
            roomRepository.save(newRoom);
        }

        allocation.setStudentId(request.getStudentId());
        allocation.setRoom(newRoom);
        allocation.setAllocationDate(request.getAllocationDate());
        return allocationRepository.save(allocation);
    }

    public void deleteAllocation(Long id) {
        HostelAllocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Allocation not found"));
        HostelRoom room = allocation.getRoom();
        allocationRepository.deleteById(id);
        if (room != null) {
            room.setOccupied(Math.max(0, room.getOccupied() - 1));
            roomRepository.save(room);
        }
    }
}
