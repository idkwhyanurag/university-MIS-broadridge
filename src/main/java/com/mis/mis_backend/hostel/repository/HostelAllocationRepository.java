package com.mis.mis_backend.hostel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mis.mis_backend.hostel.entity.HostelAllocation;

public interface HostelAllocationRepository extends JpaRepository<HostelAllocation, Long> {

}