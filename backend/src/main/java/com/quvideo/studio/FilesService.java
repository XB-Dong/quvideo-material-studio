package com.quvideo.studio;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import javax.imageio.ImageIO;
import javax.imageio.stream.ImageInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FilesService {
  private final Db db;
  private final Path root;

  public FilesService(Db db, @Value("${STORAGE_ROOT:/data/materials}") String root)
      throws IOException {
    this.db = db;
    this.root = Path.of(root).toAbsolutePath().normalize();
    Files.createDirectories(this.root);
  }

  Path path(String key) {
    if (key == null || !key.matches("[a-zA-Z0-9.-]+")) throw Problem.missing();
    Path p = root.resolve(key).normalize();
    if (!p.getParent().equals(root)) throw Problem.missing();
    return p;
  }

  private static final Map<String, String> DEMO_TYPES =
      Map.ofEntries(
          Map.entry("postcard.png", "image/png"),
          Map.entry("postcard-p1-cover.jpg", "image/jpeg"),
          Map.entry("postcard-p1-result.png", "image/png"),
          Map.entry("pet.png", "image/png"),
          Map.entry("pet-p1-cover.jpg", "image/jpeg"),
          Map.entry("pet-p1-result.png", "image/png"),
          Map.entry("story.png", "image/png"),
          Map.entry("story-p1-cover.jpg", "image/jpeg"),
          Map.entry("story-p1-result.png", "image/png"),
          Map.entry("portrait.png", "image/png"),
          Map.entry("portrait-p1-cover.jpg", "image/jpeg"),
          Map.entry("portrait-p1-result.png", "image/png"));

  String demoMime(String key) {
    String type = key == null ? null : DEMO_TYPES.get(key);
    if (type == null) throw Problem.missing();
    return type;
  }

  byte[] demo(String key) throws IOException {
    demoMime(key);
    try (InputStream in = getClass().getResourceAsStream("/demo/" + key)) {
      if (in == null) throw Problem.missing();
      return in.readAllBytes();
    }
  }

  Map<String, Object> upload(String user, String templateId, MultipartFile file)
      throws IOException {
    var template = db.template(templateId);
    if (template == null) throw Problem.missing();
    if (file.isEmpty()) throw Problem.invalid("请选择图片");
    if (file.getSize() > ((Number) template.get("maxFileSizeBytes")).longValue())
      throw new Problem(413, "FILE_TOO_LARGE", "图片超过大小限制");
    byte[] bytes = file.getBytes();
    String mime =
        bytes.length >= 8
                && bytes[0] == (byte) 137
                && bytes[1] == 80
                && bytes[2] == 78
                && bytes[3] == 71
            ? "image/png"
            : bytes.length >= 3
                    && bytes[0] == (byte) 255
                    && bytes[1] == (byte) 216
                    && bytes[2] == (byte) 255
                ? "image/jpeg"
                : null;
    if (mime == null || !mime.equals(file.getContentType()))
      throw new Problem(415, "UNSUPPORTED_MEDIA", "请选择真实的 JPEG 或 PNG 图片");
    int width, height;
    try (ImageInputStream stream =
        ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
      var readers = ImageIO.getImageReaders(stream);
      if (!readers.hasNext()) throw Problem.invalid("图片无法解码");
      var reader = readers.next();
      try {
        reader.setInput(stream);
        width = reader.getWidth(0);
        height = reader.getHeight(0);
        if ((long) width * height > 20000000 || width < 1 || height < 1)
          throw Problem.invalid("图片像素超过 2000 万限制");
        if (reader.read(0) == null) throw Problem.invalid("图片损坏");
      } finally {
        reader.dispose();
      }
    } catch (Problem e) {
      throw e;
    } catch (Exception e) {
      throw Problem.invalid("图片损坏或无法读取");
    }
    String id = UUID.randomUUID().toString(),
        key = id + (mime.equals("image/png") ? ".png" : ".jpg");
    write(key, bytes);
    Map<String, Object> a = new HashMap<>();
    a.put("id", id);
    a.put("userId", user);
    a.put("storageKey", key);
    a.put(
        "originalName",
        Optional.ofNullable(file.getOriginalFilename())
            .orElse("image")
            .substring(
                0,
                Math.min(
                    255,
                    Optional.ofNullable(file.getOriginalFilename()).orElse("image").length())));
    a.put("mimeType", mime);
    a.put("sizeBytes", bytes.length);
    a.put("width", width);
    a.put("height", height);
    try {
      db.asset(a);
    } catch (RuntimeException e) {
      Files.deleteIfExists(path(key));
      throw e;
    }
    a.remove("userId");
    a.remove("storageKey");
    a.remove("originalName");
    a.put("url", "/media/assets/" + id);
    return a;
  }

  void write(String key, byte[] bytes) throws IOException {
    Path temp = Files.createTempFile(root, "pending-", ".tmp");
    try {
      Files.write(temp, bytes);
      Files.move(
          temp, path(key), StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
    } finally {
      Files.deleteIfExists(temp);
    }
  }

  boolean exists(String key) {
    return Files.isRegularFile(path(key));
  }

  byte[] read(String key) throws IOException {
    Path p = path(key);
    if (!Files.isRegularFile(p)) throw Problem.missing();
    return Files.readAllBytes(p);
  }
}
