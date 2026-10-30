package com.quvideo.studio;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import javax.imageio.ImageIO;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class ResultThumbnailTest {
  @Test
  void derivativesAreDecodableAndPreserveOriginalAspectAndBytes() throws Exception {
    for (String name : List.of("pet", "postcard", "story", "portrait")) {
      byte[] original;
      try (var input = getClass().getResourceAsStream("/demo/" + name + "-p1-result.png")) {
        original = input.readAllBytes();
      }
      byte[] before = original.clone();
      var source = ImageIO.read(new ByteArrayInputStream(original));
      byte[] thumbnail = ResultThumbnail.create(original);
      var decoded = ImageIO.read(new ByteArrayInputStream(thumbnail));
      assertEquals(255, thumbnail[0] & 255);
      assertEquals(216, thumbnail[1] & 255);
      assertEquals(512, Math.max(decoded.getWidth(), decoded.getHeight()));
      assertEquals(
          source.getWidth() / (double) source.getHeight(),
          decoded.getWidth() / (double) decoded.getHeight(),
          0.005);
      assertTrue(thumbnail.length < original.length / 2, name);
      assertArrayEquals(before, original);
    }
  }

  @Test
  void smallTransparentImagesAreNotUpscaledAndHaveWhiteBackground() throws Exception {
    var source = new BufferedImage(24, 12, BufferedImage.TYPE_INT_ARGB);
    var png = new ByteArrayOutputStream();
    ImageIO.write(source, "png", png);
    var image = ImageIO.read(new ByteArrayInputStream(ResultThumbnail.create(png.toByteArray())));
    assertEquals(24, image.getWidth());
    assertEquals(12, image.getHeight());
    assertEquals(0xffffff, image.getRGB(10, 6) & 0xffffff);
    assertThrows(java.io.IOException.class, () -> ResultThumbnail.create(new byte[] {1, 2}));
  }

  @Test
  void resultVariantsKeepOwnershipTerminalCheckAndOriginalResponse() throws Exception {
    var request = new MockHttpServletRequest();
    var db = mock(Db.class);
    var identity = mock(Identity.class);
    var files = mock(FilesService.class);
    var api = new Api(db, identity, files, null);
    when(identity.require(request)).thenReturn(Map.of("userId", "owner"));
    assertEquals(404, assertThrows(Problem.class, () -> api.result(request, "other", true)).status);
    when(db.taskOwned("running", "owner")).thenReturn(Map.of("status", "RUNNING"));
    assertEquals(404, assertThrows(Problem.class, () -> api.result(request, "running", true)).status);
    verifyNoInteractions(files);
    byte[] original;
    try (var input = getClass().getResourceAsStream("/demo/pet-p1-result.png")) {
      original = input.readAllBytes();
    }
    when(db.taskOwned("done", "owner"))
        .thenReturn(Map.of("status", "SUCCEEDED", "resultKey", "done-result.png"));
    when(files.read("done-result.png")).thenReturn(original);
    var full = api.result(request, "done", false);
    assertArrayEquals(original, full.getBody());
    assertEquals("image/png", full.getHeaders().getContentType().toString());
    var thumb = api.result(request, "done", true);
    assertEquals("image/jpeg", thumb.getHeaders().getContentType().toString());
    assertEquals("no-store", thumb.getHeaders().getCacheControl());
    assertEquals("nosniff", thumb.getHeaders().getFirst("X-Content-Type-Options"));
    verify(db, never()).success(anyString(), anyString());
    when(identity.require(request)).thenThrow(new Problem(401, "SESSION_EXPIRED", "身份已过期"));
    assertEquals(401, assertThrows(Problem.class, () -> api.result(request, "done", true)).status);
    verify(files, times(2)).read("done-result.png");
  }
}
