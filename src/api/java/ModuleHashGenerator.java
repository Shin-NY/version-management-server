package admin.src.api.java;

import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class ModuleHashGenerator {
    public static void main(String[] args) {
        String programName = "Calculator";
        String version = "2.1.0";
        String baseDir = "~/version-management-server/uploaded_agent/";

        JSONObject programInfo = new JSONObject();
        programInfo.put("programName", programName);
        programInfo.put("version", version);
        programInfo.put("modules", new JSONArray());
        programInfo.put("updateHistory", new JSONArray());

        List<String> files = Arrays.asList("core_main.py", "core_helper.py");
        JSONArray modules = new JSONArray();

        JSONObject coreModule = new JSONObject();
        coreModule.put("moduleName", "CoreModule");
        coreModule.put("description", "Handles core system functionalities.");
        coreModule.put("version", "1.2.0");
        coreModule.put("lastUpdated", "2024-10-15T12:00:00Z");
        coreModule.put("files", new JSONArray());
        coreModule.put("dependencies", new JSONArray());

        JSONArray fileArray = new JSONArray();
        for (String fileName : files) {
            try {
                String filePath = baseDir + fileName;
                File file = new File(filePath);
                long fileSize = Files.size(Paths.get(filePath)) / 1024;
                String hash = generateFileHash(filePath);

                JSONObject fileInfo = new JSONObject();
                fileInfo.put("fileName", fileName);
                fileInfo.put("filePath", filePath);
                fileInfo.put("hash", hash);
                fileInfo.put("sizeKB", fileSize);

                fileArray.add(fileInfo);
            } catch (IOException | NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
        }

        coreModule.put("files", fileArray);

        JSONObject loggerDependency = new JSONObject();
        loggerDependency.put("moduleName", "LoggerModule");
        loggerDependency.put("requiredVersion", "1.0.0");
        coreModule.getJSONArray("dependencies").add(loggerDependency);

        modules.add(coreModule);
        programInfo.put("modules", modules);

        JSONArray updateHistory = new JSONArray();

        JSONObject versionUpdate1 = new JSONObject();
        versionUpdate1.put("version", "2.1.0");
        versionUpdate1.put("date", "2024-10-15T12:00:00Z");
        versionUpdate1.put("description", "Added new features to CoreModule and updated LoggerModule for better performance.");
        updateHistory.add(versionUpdate1);

        JSONObject versionUpdate2 = new JSONObject();
        versionUpdate2.put("version", "2.0.0");
        versionUpdate2.put("date", "2024-10-01T11:00:00Z");
        versionUpdate2.put("description", "Initial release with CoreModule, LoggerModule, and NetworkModule.");
        updateHistory.add(versionUpdate2);

        programInfo.put("updateHistory", updateHistory);

        saveToFile(programInfo, "programInfo.json");
    }

    private static String generateFileHash(String filePath) throws IOException, NoSuchAlgorithmException {
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

    private static void saveToFile(JSONObject jsonObject, String filename) {
        try (FileWriter file = new FileWriter(filename)) {
            file.write(jsonObject.toJSONString());
            file.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
