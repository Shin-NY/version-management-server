package admin.src.hash;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class ModuleHashGenerator {

    // 특정 경로에서 파일들을 읽어서 각 파일의 해시 값을 부여하는 함수
    public Map<String, String> generateHashesForModules(String folderPath) {
        Map<String, String> fileHashes = new HashMap<>();
        File folder = new File(folderPath);
        if (folder.exists() && folder.isDirectory()) {
            File[] files = folder.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) {
                        try {
                            String hash = calculateFileHash(file);
                            fileHashes.put(file.getName(), hash);
                        } catch (IOException | NoSuchAlgorithmException e) {
                            System.err.println("Failed to calculate hash for file: " + file.getName());
                            e.printStackTrace();
                        }
                    }
                }
            }
        } else {
            System.err.println("Invalid folder path: " + folderPath);
        }
        return fileHashes;
    }

    // 파일 해시 값을 계산하는 함수 (SHA-256 해시)
    private String calculateFileHash(File file) throws IOException, NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (FileInputStream fis = new FileInputStream(file)) {
            byte[] byteArray = new byte[1024];
            int bytesCount;
            while ((bytesCount = fis.read(byteArray)) != -1) {
                digest.update(byteArray, 0, bytesCount);
            }
        }
        byte[] bytes = digest.digest();
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    // 해시 값을 JSON 파일로 저장하는 함수
    public void saveHashesToJsonFile(Map<String, String> fileHashes, String outputPath) {
        JSONArray fileList = new JSONArray();

        for (Map.Entry<String, String> entry : fileHashes.entrySet()) {
            JSONObject fileDetails = new JSONObject();
            fileDetails.put("fileName", entry.getKey());
            fileDetails.put("hash", entry.getValue());
            fileList.add(fileDetails);
        }

        try (FileWriter file = new FileWriter(outputPath)) {
            file.write(fileList.toJSONString());
            file.flush();
            System.out.println("Hash information saved to " + outputPath);
        } catch (IOException e) {
            System.err.println("Failed to save hash information to JSON file.");
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        ModuleHashGenerator hashGenerator = new ModuleHashGenerator();
        String folderPath = "src/data"; // 모듈 파일이 위치한 폴더 경로
        String outputPath = "src/data/module_hashes.json"; // 해시 값을 저장할 JSON 파일 경로

        Map<String, String> hashes = hashGenerator.generateHashesForModules(folderPath);

        // 각 모듈의 해시 값을 출력
        for (Map.Entry<String, String> entry : hashes.entrySet()) {
            System.out.println("File: " + entry.getKey() + " | Hash: " + entry.getValue());
        }

        // 해시 값을 JSON 파일로 저장
        hashGenerator.saveHashesToJsonFile(hashes, outputPath);
    }
}
