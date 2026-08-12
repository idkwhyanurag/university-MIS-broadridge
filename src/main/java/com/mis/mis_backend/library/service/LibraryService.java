package com.mis.mis_backend.library.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mis.mis_backend.library.dto.BookIssueRequest;
import com.mis.mis_backend.library.dto.BookRequest;
import com.mis.mis_backend.library.entity.Book;
import com.mis.mis_backend.library.entity.BookIssue;
import com.mis.mis_backend.library.repository.BookIssueRepository;
import com.mis.mis_backend.library.repository.BookRepository;

@Service
public class LibraryService {

    private final BookRepository bookRepository;
    private final BookIssueRepository issueRepository;

    public LibraryService(BookRepository bookRepository,
                          BookIssueRepository issueRepository) {
        this.bookRepository = bookRepository;
        this.issueRepository = issueRepository;
    }

    // Book CRUD

    public Book addBook(BookRequest request) {

        Book book = new Book();

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setQuantity(request.getQuantity());

        return bookRepository.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book updateBook(Long id, BookRequest request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setQuantity(request.getQuantity());

        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    // Issue Book

    public BookIssue issueBook(BookIssueRequest request) {

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        BookIssue issue = new BookIssue();

        issue.setStudentId(request.getStudentId());
        issue.setBook(book);
        issue.setIssueDate(request.getIssueDate());
        issue.setReturnDate(request.getReturnDate());
        issue.setStatus(request.getStatus());

        return issueRepository.save(issue);
    }

    // Return Book

    public BookIssue returnBook(Long issueId) {

        BookIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setStatus("RETURNED");

        return issueRepository.save(issue);
    }
}