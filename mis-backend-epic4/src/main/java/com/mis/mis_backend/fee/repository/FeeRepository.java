package com.mis.mis_backend.fee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mis.mis_backend.fee.entity.Fee;

public interface FeeRepository extends JpaRepository<Fee, Long> {

}