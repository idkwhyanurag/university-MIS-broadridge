package com.mis.mis_backend.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mis.mis_backend.inventory.entity.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

}