package fi.xamk.tilavaraus.domain;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends PagingAndSortingRepository<Reservation, Long>, QuerydslPredicateExecutor<Reservation> {
	List<Reservation> findByRoom(Room room);

	List<Reservation> findByUser(User user, Pageable pageable);

	@Query("select r from Reservation r where (r.startTime < ?2 and r.endTime > ?1) and (r.room = ?4) and (r.date = ?3)")
	List<Reservation> findOverlapping(LocalTime start, LocalTime end, LocalDate date, Room room);
}
