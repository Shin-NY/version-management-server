package admin.src.api.java;

import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class ModuleHashApplication {
    public static void main(String[] args) {
        SpringApplication.run(ModuleHashApplication.class, args);
    }
}

@Service
class ModuleHashGenerator {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateFileHash(String filePath) throws IOException, NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (InputStream fis = Files.newInputStream(Paths.get(filePath))) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }
        }
        byte[] hashBytes = digest.digest();
        StringBuilder hashString = new StringBuilder();
        for (byte b : hashBytes) {
            hashString.append(String.format("%02x", b));
        }
        return hashString.toString();
    }

    public void saveToFile(ObjectNode jsonObject, String filename) {
        try (FileWriter file = new FileWriter(filename)) {
            file.write(jsonObject.toPrettyString());
            file.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

@RestController
class ModuleHashController {
    private final ModuleHashGenerator moduleHashGenerator;

    public ModuleHashController(ModuleHashGenerator moduleHashGenerator) {
        this.moduleHashGenerator = moduleHashGenerator;
    }

    @GetMapping("/generate-hash")
    public String generateHash(@RequestParam String filePath) {
        try {
            return moduleHashGenerator.generateFileHash(filePath);
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
