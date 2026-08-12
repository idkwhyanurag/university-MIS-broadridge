package com.mis.mis_backend.announcement;

import com.mis.mis_backend.announcement.dto.AnnouncementRequest;
import com.mis.mis_backend.announcement.dto.AnnouncementResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public AnnouncementResponse create(AnnouncementRequest request) {
        Announcement announcement = new Announcement(
                request.getPostedBy(),
                request.getTitle(),
                request.getBody(),
                request.getTargetRole()
        );
        return new AnnouncementResponse(announcementRepository.save(announcement));
    }

    // requesterRole should come from the JWT once Person 1's auth module is wired in.
    // STUDENT sees STUDENT + ALL, FACULTY sees FACULTY + ALL, admins can pass "ALL" to see everything.
    public List<AnnouncementResponse> getForRole(TargetRole requesterRole) {
        List<TargetRole> visibleRoles = requesterRole == TargetRole.ALL
                ? List.of(TargetRole.STUDENT, TargetRole.FACULTY, TargetRole.ALL)
                : List.of(requesterRole, TargetRole.ALL);

        return announcementRepository.findByTargetRoleInOrderByCreatedAtDesc(visibleRoles)
                .stream()
                .map(AnnouncementResponse::new)
                .toList();
    }

    public void delete(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new IllegalArgumentException("Announcement not found: " + id);
        }
        announcementRepository.deleteById(id);
    }
}
