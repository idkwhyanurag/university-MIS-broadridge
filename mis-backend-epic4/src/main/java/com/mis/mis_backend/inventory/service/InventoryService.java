package com.mis.mis_backend.inventory.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mis.mis_backend.inventory.dto.InventoryRequest;
import com.mis.mis_backend.inventory.entity.Inventory;
import com.mis.mis_backend.inventory.repository.InventoryRepository;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public Inventory addItem(InventoryRequest request) {

        Inventory item = new Inventory();

        item.setItemName(request.getItemName());
        item.setQuantity(request.getQuantity());
        item.setSupplier(request.getSupplier());
        item.setPurchaseDate(request.getPurchaseDate());

        return inventoryRepository.save(item);
    }

    public List<Inventory> getAllItems() {
        return inventoryRepository.findAll();
    }

    public Optional<Inventory> getItemById(Long id) {
        return inventoryRepository.findById(id);
    }

    public Inventory updateItem(Long id, InventoryRequest request) {

        Inventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setItemName(request.getItemName());
        item.setQuantity(request.getQuantity());
        item.setSupplier(request.getSupplier());
        item.setPurchaseDate(request.getPurchaseDate());

        return inventoryRepository.save(item);
    }

    public void deleteItem(Long id) {
        inventoryRepository.deleteById(id);
    }
}