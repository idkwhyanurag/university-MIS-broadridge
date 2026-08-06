package com.mis.mis_backend.announcement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByTargetRoleInOrderByCreatedAtDesc(List<TargetRole> roles);
}
