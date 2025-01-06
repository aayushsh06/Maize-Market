package maizemarket.com.maizemarket;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.function.Function;
import maizemarket.com.maizemarket.constant.Constant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;




@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepo repo;

    public Product getProduct(int prodId){
        return repo.findById(prodId).orElse(null);
    }

    public Product addProduct(Product product){
        repo.save(product);
        return product;
    }
    public Page<Product> getAllProducts(int page, int size) {
       return repo.findAll(PageRequest.of(page,size,Sort.by("name")));
    }

    public void deleteProduct(int id){
        repo.deleteById(id);
    }

    public int uploadPhoto(int id, MultipartFile file){
        log.info("Saving Picture");
        Product product = getProduct(id);
        String photoUrl = photoFunction(id, file);
        product.setPhotoUrl(photoUrl);
        repo.save(product);
        return id;
    }

    private final Function<String, String> fileExtension = filename -> 
    Optional.of(filename)
        .filter(name -> name.contains("."))
        .map(name -> "." + name.substring(name.lastIndexOf(".") + 1))
        .orElse(".png");
    
    private String photoFunction(int prodId, MultipartFile image){
        try {
            Path fileStorageLocation = Paths.get(Constant.PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }

            String fileName = "productImage" + prodId + fileExtension.apply(image.getOriginalFilename());

            Files.copy(image.getInputStream(), fileStorageLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/products/image/" + fileName)
                    .toUriString();
        } catch (IOException e) {
            throw new RuntimeException("Unable to save image");
        }
    }

    public Product updateProduct(int id, Product product) throws Exception{
        if(!repo.existsById(id)) {
            throw new Exception("Product not found with id " + id);
        }
        product.setId(id);
        return repo.save(product);
    }

    
}
