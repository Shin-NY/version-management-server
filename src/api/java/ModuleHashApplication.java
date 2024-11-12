package admin.src.api.java;

import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
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

    public void saveModuleInfoToFile(String filePath) {
        try {
            Path path = Paths.get(filePath);

            // 모듈 정보 수집
            String moduleName = path.getFileName().toString();
            String moduleVersion = "1.0.0"; // 버전은 추후 관리 방법에 따라 수정 가능
            String moduleHash = generateFileHash(filePath);
            String moduleUpdateDate = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
            long moduleSize = Files.size(path);

            // JSON 객체 생성
            ObjectNode moduleInfo = objectMapper.createObjectNode();
            moduleInfo.put("name", moduleName);
            moduleInfo.put("version", moduleVersion);
            moduleInfo.put("hash", moduleHash);
            moduleInfo.put("updateDate", moduleUpdateDate);
            moduleInfo.put("size", moduleSize);

            // 기존 파일에서 JSON 배열 읽기 또는 새로 생성
            ArrayNode records;
            String filename = moduleUpdateDate + ".json";
            File file = new File(filename);
            if (file.exists()) {
                records = (ArrayNode) objectMapper.readTree(file);
            } else {
                records = objectMapper.createArrayNode();
            }

            // 새 모듈 정보 추가
            records.add(moduleInfo);

            // 파일에 저장
            saveToFile(records, filename);
        } catch (IOException | NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    public void saveToFile(ArrayNode jsonArray, String filename) {
        try (FileWriter file = new FileWriter(filename)) {
            file.write(jsonArray.toPrettyString());
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

    @GetMapping("/save-module-info")
    public String saveModuleInfo(@RequestParam String filePath) {
        try {
            moduleHashGenerator.saveModuleInfoToFile(filePath);
            return "Module information saved successfully.";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
