package com.mis.mis_backend.fee.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mis.mis_backend.fee.dto.FeeRequest;
import com.mis.mis_backend.fee.entity.Fee;
import com.mis.mis_backend.fee.repository.FeeRepository;

@Service
public class FeeService {

    private final FeeRepository feeRepository;

    public FeeService(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    // Create Fee
    public Fee addFee(FeeRequest request) {

        System.out.println("StudentId: " + request.getStudentId());
        System.out.println("Semester: " + request.getSemester());
        System.out.println("Amount: " + request.getAmount());
        System.out.println("DueDate: " + request.getDueDate());
        System.out.println("PaidDate: " + request.getPaidDate());
        System.out.println("Status: " + request.getStatus());

        Fee fee = new Fee();

        fee.setStudentId(request.getStudentId());
        fee.setSemester(request.getSemester());
        fee.setAmount(request.getAmount());
        fee.setDueDate(request.getDueDate());
        fee.setPaidDate(request.getPaidDate());
        fee.setPaymentStatus(request.getStatus());

        return feeRepository.save(fee);
    }

    // Get All Fees
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    // Get Fee By ID
    public Optional<Fee> getFeeById(Long id) {
        return feeRepository.findById(id);
    }

    // Update Fee
    public Fee updateFee(Long id, FeeRequest request) {

        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        fee.setStudentId(request.getStudentId());
        fee.setSemester(request.getSemester());
        fee.setAmount(request.getAmount());
        fee.setDueDate(request.getDueDate());
        fee.setPaidDate(request.getPaidDate());
        fee.setPaymentStatus(request.getStatus());

        return feeRepository.save(fee);
    }

    // Delete Fee
    public void deleteFee(Long id) {
        feeRepository.deleteById(id);
    }
}