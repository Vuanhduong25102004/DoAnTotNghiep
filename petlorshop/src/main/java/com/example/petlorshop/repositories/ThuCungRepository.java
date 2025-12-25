    package com.example.petlorshop.repositories;

    import com.example.petlorshop.models.ThuCung;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;

    import java.util.List;

    @Repository
    public interface ThuCungRepository extends JpaRepository<ThuCung, Integer> {
        @Query("SELECT t FROM ThuCung t WHERE LOWER(t.tenThuCung) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.chungLoai) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.giongLoai) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<ThuCung> searchByKeyword(@Param("keyword") String keyword);

        List<ThuCung> findByNguoiDung_Email(String email);
    }
