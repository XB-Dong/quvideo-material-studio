package com.quvideo.studio;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

import java.io.ByteArrayInputStream;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import javax.imageio.ImageIO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class DemoAssetsTest {
  @TempDir Path root;

  FilesService files() throws Exception {
    return new FilesService(mock(Db.class), root.toString());
  }

  @Test
  void responsesMatchActualImageFormats() throws Exception {
    var files = files();
    var api = new Api(null, null, files, null);
    for (String key : List.of("postcard", "pet", "story", "portrait")) {
      for (String suffix : List.of(".png", "-p1-cover.jpg", "-p1-result.png")) {
        var response = api.demo(key + suffix);
        byte[] bytes = response.getBody();
        boolean jpeg = suffix.endsWith("jpg");
        assertEquals(200, response.getStatusCode().value());
        assertEquals(
            jpeg ? "image/jpeg" : "image/png",
            response.getHeaders().getContentType().toString());
        assertEquals("nosniff", response.getHeaders().getFirst("X-Content-Type-Options"));
        assertEquals(jpeg ? 255 : 137, bytes[0] & 255);
        var decoded = ImageIO.read(new ByteArrayInputStream(bytes));
        assertNotNull(decoded);
        if (jpeg) {
          assertEquals(480, decoded.getWidth());
          assertEquals(640, decoded.getHeight());
          assertTrue(bytes.length <= 180 * 1024);
        } else if (suffix.contains("p1")) {
          assertTrue(bytes.length <= 1024 * 1024);
          assertTrue(Math.max(decoded.getWidth(), decoded.getHeight()) <= 1600);
        }
      }
    }
  }

  @Test
  void rejectsUnknownAndTraversalKeys() throws Exception {
    var files = files();
    for (String key :
        List.of(
            "unknown.jpg", "../pet.png", "%2e%2e%2fpet.png", "pet-p1-cover.png",
            "application.yml", "/pet.png")) {
      assertEquals(404, assertThrows(Problem.class, () -> files.demo(key)).status);
      assertEquals(404, assertThrows(Problem.class, () -> files.demoMime(key)).status);
    }
  }

  @Test
  void newDemoDoesNotOverwriteHistoricalResult() throws Exception {
    var files = files();
    byte[] old = files.demo("pet.png");
    files.write("historical-result.png", old);
    files.write("new-result.png", files.demo("pet-p1-result.png"));
    assertArrayEquals(old, files.read("historical-result.png"));
    assertFalse(Arrays.equals(old, files.read("new-result.png")));
  }
}
