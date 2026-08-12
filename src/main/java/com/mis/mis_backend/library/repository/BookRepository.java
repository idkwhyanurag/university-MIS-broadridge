package com.mis.mis_backend.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mis.mis_backend.library.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
}