package maizemarket.com.maizemarket;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import maizemarket.com.maizemarket.constant.Constant;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/products")
public class ProductController {
    
    private ProductService service;
    
    public ProductController(ProductService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts(@RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "10") int size){
        try{
            Page<Product> p = service.getAllProducts(page,size);
            return new ResponseEntity<>(p,HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getProductsBySeller(@RequestParam(value = "page", defaultValue = "0") int page,
                                                @RequestParam(value = "size", defaultValue = "10") int size,
                                                @RequestParam("sellerEmail") String sellerEmail) {
        try {
            Page<Product> products = service.getAllProductsFromSeller(page, size, sellerEmail);
            return new ResponseEntity<>(products, HttpStatus.OK); 
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

    @GetMapping("/{prodId}")
    public ResponseEntity<?> getProduct(@PathVariable int prodId) {
        try{
            Product p = service.getProduct(prodId);
            return new ResponseEntity<>(p,HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product){
        try{
            Product p = service.addProduct(product);
            return new ResponseEntity<>(p,HttpStatus.CREATED);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable int id, @RequestBody Product product) {
        try{
            Product p = service.updateProduct(id, product);
            return new ResponseEntity<>(p,HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/image")
    public ResponseEntity<?> uploadPhoto(@RequestParam("prodId") int prodId, @RequestParam("file")MultipartFile file){
        try{
            return ResponseEntity.ok().body(service.uploadPhoto(prodId, file)); 
        }
        catch(Exception e){
            return new ResponseEntity<>("Unable to Upload Photo",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 

    @GetMapping(path = "/image/{filename}", produces ={MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public byte[] getPhoto(@PathVariable String filename) throws IOException {
        return Files.readAllBytes(Paths.get(Constant.PHOTO_DIRECTORY + filename));
    }

    @DeleteMapping("/{prodId}")
    public ResponseEntity<?> deleteProduct(@PathVariable int prodId){
        try{
            service.deleteProduct(prodId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    

}
