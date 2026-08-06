package com.mis.mis_backend.library.controller;

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

import com.mis.mis_backend.library.dto.BookIssueRequest;
import com.mis.mis_backend.library.dto.BookRequest;
import com.mis.mis_backend.library.entity.Book;
import com.mis.mis_backend.library.entity.BookIssue;
import com.mis.mis_backend.library.service.LibraryService;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @PostMapping("/books")
    public ResponseEntity<Book> addBook(@RequestBody BookRequest request) {
        return ResponseEntity.ok(libraryService.addBook(request));
    }

    @GetMapping("/books")
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(libraryService.getAllBooks());
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @RequestBody BookRequest request) {

        return ResponseEntity.ok(libraryService.updateBook(id, request));
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable Long id) {

        libraryService.deleteBook(id);

        return ResponseEntity.ok("Book deleted successfully.");
    }

    @PostMapping("/issue")
    public ResponseEntity<BookIssue> issueBook(
            @RequestBody BookIssueRequest request) {

        return ResponseEntity.ok(libraryService.issueBook(request));
    }

    @PutMapping("/return/{issueId}")
    public ResponseEntity<BookIssue> returnBook(
            @PathVariable Long issueId) {

        return ResponseEntity.ok(libraryService.returnBook(issueId));
    }
}