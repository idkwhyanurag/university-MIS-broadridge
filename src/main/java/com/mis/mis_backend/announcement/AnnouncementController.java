package com.mis.mis_backend.announcement;

import com.mis.mis_backend.announcement.dto.AnnouncementRequest;
import com.mis.mis_backend.announcement.dto.AnnouncementResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    // TODO(team): once auth is wired in, restrict this to FACULTY/ADMIN roles
    // by reading the role claim from the JWT instead of trusting the request body.
    @PostMapping
    public ResponseEntity<AnnouncementResponse> create(@Valid @RequestBody AnnouncementRequest request) {
        return ResponseEntity.ok(announcementService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementResponse>> getForRole(@RequestParam TargetRole role) {
        return ResponseEntity.ok(announcementService.getForRole(role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
