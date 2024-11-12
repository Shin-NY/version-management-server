package admin.src.api.java;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;

@RestController
public class VersionDownloadController {

    private static final String BASE_PATH = "/home/ubuntu/version-management-server/uploaded_agent";

    @GetMapping("/agent-versions/lts/download")
    public ResponseEntity<FileSystemResource> downloadLatestVersion(@RequestParam String filenames, @RequestParam String version) {
        try {
            // 특정 버전 폴더 찾기
            File baseDirectory = new File(BASE_PATH);
            File versionDirectory = new File(baseDirectory, version);
            if (!versionDirectory.exists() || !versionDirectory.isDirectory()) {
                return ResponseEntity.notFound().build();
            }

            // 요청된 파일명이 해당 버전 폴더에 있는지 확인하고 파일을 준비
            String[] requestedFiles = filenames.split(",");
            for (String filename : requestedFiles) {
                Path filePath = Paths.get(versionDirectory.getAbsolutePath(), filename);
                File file = filePath.toFile();
                if (file.exists()) {
                    FileSystemResource resource = new FileSystemResource(file);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName())
                            .body(resource);
                } else {
                    return ResponseEntity.notFound().build();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }

        return ResponseEntity.notFound().build();
    }
}
