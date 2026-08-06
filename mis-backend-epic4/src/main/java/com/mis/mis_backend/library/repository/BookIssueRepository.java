package com.mis.mis_backend.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mis.mis_backend.library.entity.BookIssue;

public interface BookIssueRepository extends JpaRepository<BookIssue, Long> {
}