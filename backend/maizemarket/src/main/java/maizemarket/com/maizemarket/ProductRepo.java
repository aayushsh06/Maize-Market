package maizemarket.com.maizemarket;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product,Integer>{
    Page<Product> findBySellerEmail(String sellerEmail, Pageable pageable);
}