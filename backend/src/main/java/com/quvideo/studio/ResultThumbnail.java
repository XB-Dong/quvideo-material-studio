package com.quvideo.studio;

import java.awt.Color;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;

/** A display derivative. Original result bytes and task state remain untouched. */
final class ResultThumbnail {
  private ResultThumbnail() {}

  static byte[] create(byte[] original) throws IOException {
    BufferedImage source = ImageIO.read(new ByteArrayInputStream(original));
    if (source == null) throw new IOException("Result image cannot be decoded");
    double scale = Math.min(1.0, 512.0 / Math.max(source.getWidth(), source.getHeight()));
    int width = Math.max(1, (int) Math.round(source.getWidth() * scale));
    int height = Math.max(1, (int) Math.round(source.getHeight() * scale));
    BufferedImage target = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
    var graphics = target.createGraphics();
    try {
      graphics.setColor(Color.WHITE);
      graphics.fillRect(0, 0, width, height);
      graphics.setRenderingHint(
          RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
      graphics.drawImage(source, 0, 0, width, height, null);
    } finally {
      graphics.dispose();
      source.flush();
    }
    var writer = ImageIO.getImageWritersByFormatName("jpeg").next();
    try (var bytes = new ByteArrayOutputStream();
        var output = ImageIO.createImageOutputStream(bytes)) {
      writer.setOutput(output);
      var options = writer.getDefaultWriteParam();
      options.setCompressionMode(javax.imageio.ImageWriteParam.MODE_EXPLICIT);
      options.setCompressionQuality(0.88f);
      writer.write(null, new IIOImage(target, null, null), options);
      output.flush();
      return bytes.toByteArray();
    } finally {
      writer.dispose();
      target.flush();
    }
  }
}
